"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { init, useQuery } from "@airstack/airstack-react";
import GET_PROFILE_INFO from "../../graphql/query";
import CastsList from "@/components/CastsList";
import {
  useAddress,
  useContract,
  useContractWrite,
  useStorageUpload,
  useContractRead,
} from "@thirdweb-dev/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaPen } from "react-icons/fa";

const themes = {
  light: `
    body { background-color: white; color: black; }
    .bg { background-color: white; }
    .text { color: black; }
  `,
  dark: `
    body { background-color: black; color: white; }
    .bg { background-color: black; }
    .text { color: white; }
  `,
  highContrast: `
    body { background-color: #0052ff; color: white; }
    .bg { background-color: #0052ff; }
    .text { color: white; }
  `,
};

export default function ProfilePage() {
  const [currentTheme, setCurrentTheme] = useState("light");
  const [themeCSS, setThemeCSS] = useState("");
  const address = useAddress();
  const [apiInitialized, setApiInitialized] = useState(false);
  const { address: walletAddress } = useParams();
  const { mutateAsync: upload } = useStorageUpload();

  // Smart contract information
  const contractAddress = "0x7b0Be0B88762f0b9c2526A1B87E5E95A0a47EF55";
  const { contract } = useContract(contractAddress);
  const { mutateAsync: setThemeCID } = useContractWrite(contract, "setThemeCID");
  const { data: cid, isLoading, error } = useContractRead(contract, "getThemeCID", [walletAddress]);

  const saveThemeToIPFS = async (theme: any) => {
    const file = new File([theme], "theme.css");
    const uris = await upload({ data: [file] });
    return uris[0]; // Return the URI of the uploaded file
  };

  const loadThemeFromIPFS = async (cid: any) => {
    const response = await fetch(cid.replace("ipfs://", "https://ipfs.io/ipfs/"));
    if (!response.ok) {
      throw new Error("Failed to fetch the theme from IPFS");
    }
    return await response.text();
  };

  const changeTheme = async (theme: any) => {
    const css = themes[theme as keyof typeof themes];
    setThemeCSS(css);
    setCurrentTheme(theme);
    const cid = await saveThemeToIPFS(css);
    console.log(`Theme saved with CID: ${cid}`);
    saveCIDOnChain(cid);
  };

  const saveCIDOnChain = async (cid: any) => {
    try {
      const tx = await setThemeCID({ args: [cid] });
      console.log("CID saved on-chain:", cid);
    } catch (error) {
      console.error("Error saving CID on-chain:", error);
    }
  };

  const loadCIDFromChain = async () => {
    if (!cid) return;
    console.log("IPFS CID:", cid);

    try {
      const themeCSS = await loadThemeFromIPFS(cid);
      setThemeCSS(themeCSS);
      console.log("Loaded theme from IPFS:", themeCSS);
    } catch (error) {
      console.error("Error loading CID from chain:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY as string);
      setApiInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (cid) {
      loadCIDFromChain();
    }
  }, [cid]);

  const {
    data,
    loading,
    error: queryError,
  } = useQuery(GET_PROFILE_INFO, { identity: walletAddress }, {
    enabled: apiInitialized && !!walletAddress,
  } as any);

  useEffect(() => {
    if (apiInitialized && walletAddress) {
      console.log("Variables being sent:", { identity: walletAddress });
    }
  }, [apiInitialized, walletAddress]);

  useEffect(() => {
    if (data) {
      console.log("Farcaster feed data:", data.FarcasterCasts.Cast);
    }
  }, [data]);

  if (isLoading || loading) return <div className="text-black text-center mt-20">Loading...</div>;
  if (error || queryError)
    return (
      <div className="text-red-500 text-center mt-20">
        Error: {(error as any)?.message || (queryError as any).message}
      </div>
    );

  const renderProfileSection = (profile: any) => (
    <div className="border-gray-300 p-6 mt-6 w-full max-w-2xl">
      <div className="flex items-center space-x-4">
        <img
          src={profile.profileImage}
          alt={profile.profileName}
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">{profile.profileDisplayName}</h2>
          <p className="text-gray-400">@{profile.profileHandle}</p>
          <p className="mt-2">{profile.profileBio}</p>
          <p className="mt-1 text-sm text-gray-400">
            Followers: {profile.followerCount} | Following: {profile.followingCount}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{ backgroundColor: currentTheme }}
    >
      <h1 className="text-3xl font-bold mt-6">Profile Page</h1>
      <style>{themeCSS}</style>
      <div className={currentTheme}></div>
      {data?.farcasterSocials?.Social &&
        data.farcasterSocials.Social.map((profile: any, index: any) => (
          <div key={index} className="w-full max-w-2xl">
            {renderProfileSection(profile)}
          </div>
        ))}
      {data?.FarcasterCasts?.Cast && <CastsList casts={data.FarcasterCasts.Cast} />}
      {address && address.toLowerCase() === (walletAddress as string)?.toLowerCase() && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="fixed bottom-4 text-black right-4">
              <FaPen className="mr-2" />
              Edit
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={currentTheme} onValueChange={changeTheme}>
              <DropdownMenuRadioItem value="light">Light Theme</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark Theme</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="highContrast">Base Theme</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

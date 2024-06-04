"use client";
import { useState } from "react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/navigation";
import 'remixicon/fonts/remixicon.css';

const client = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

export default function Home() {
  const address = useAddress();
  const router = useRouter();
  const [searchAddress, setSearchAddress] = useState("");

  const handleProfileRedirect = () => {
    if (address) {
      router.push(`/profile/${address}`);
    }
  };

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    if (searchAddress) {
      router.push(`/profile/${searchAddress}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-medium text-center mb-12 max-w-xl ">
          Explore your onchain identity and style it
        </h1>
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full max-w-md relative">
          <input
            type="text"
            placeholder="Enter wallet address"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            className="w-full p-4 pl-12 mb-4 border rounded-full border-gray-400 justify-center align-middle text-black"
          />
        </form>
      </div>
    </main>
  );
}

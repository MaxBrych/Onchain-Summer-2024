import {
  useAddress,
  useDisconnect,
  useNetworkMismatch,
  useSwitchChain,
  useChainId,
  ConnectWallet,
} from "@thirdweb-dev/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { Base } from "@thirdweb-dev/chains";
import { Button } from "./ui/button";

export default function Navbar() {
  const address = useAddress();
  const disconnect = useDisconnect();
  const isMismatched = useNetworkMismatch();
  const switchChain = useSwitchChain();
  const chainId = useChainId();
  const [ensName, setEnsName] = useState<string | null>(null);
  const [ensRecords, setEnsRecords] = useState<Record<string, string>>({});
  const [isLoading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("Chain ID from useChainId:", chainId);
    console.log("Expected Chain ID:", Base.chainId);
    if (chainId && chainId === Base.chainId) {
      console.log("Networks match!");
    } else {
      console.warn("Network mismatch detected.");
    }
  }, [chainId]);

  const handleProfileRedirect = () => {
    if (address) {
      router.push(`/profile/${address}`);
    }
  };

  return (
    <div className="w-full rounded-xl py-2 px-4">
      <div className="justify-between align-middle">
        <div className="align-items-center flex gap-2">
          {!address ? (
            <ConnectWallet
              theme={"light"}
              btnTitle={"Sign in"}
              modalTitle={"Choose Wallet"}
              auth={{ loginOptional: false }}
              switchToActiveChain={true}
              modalSize={"compact"}
            />
          ) : isMismatched ? (
            <button
              className="px-4 text-sm font-semibold bg-white text-black rounded-full h-9"
              onClick={() => switchChain(Base.chainId)}
            >
              Switch Network
            </button>
          ) : (
            <div className="flex gap-1 align-middle">
              <Button onClick={handleProfileRedirect}>Go to your profile</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

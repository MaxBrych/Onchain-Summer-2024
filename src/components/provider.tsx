"use client";
import {
  ThirdwebProvider,
  coinbaseWallet,
  metamaskWallet,
  localWallet,
  walletConnect,
} from "@thirdweb-dev/react";

const client = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

const activeChain = "polygon";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThirdwebProvider
        clientId={client}
        activeChain={activeChain}
        supportedWallets={[
          metamaskWallet({ recommended: true }),

          coinbaseWallet({ recommended: true }),
          walletConnect(),
          localWallet(),
        ]}
      ></ThirdwebProvider>
    </>
  );
}

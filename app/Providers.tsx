"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { sepolia, localhost } from "viem/chains";

const queryClient = new QueryClient();

// Get your chain from env, default to Sepolia
const chains = [sepolia, localhost] as const;

// Configure Wagmi using Privy's helper
export const wagmiConfig = createConfig({
  chains,
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
    [localhost.id]: http("http://127.0.0.1:8545"),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        // Customise the login flow – show email, social, and wallet options
        loginMethods: ["email", "wallet", "google"],
        appearance: {
          theme: "light",
          accentColor: "#2563eb", // blue-600
          logo: "/logo.png", // optional
        },
        // This tells Privy to use the same Wagmi config for the embedded wallet
        wagmiConfig,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

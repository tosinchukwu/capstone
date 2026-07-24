"use client";
import { useState, useEffect } from "react";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { createPublicClient, http, formatEther } from "viem";
import { sepolia } from "viem/chains";

export default function WalletInfo() {
  const { wallets } = useWallets();
  const { exportWallet } = usePrivy();
  const [balance, setBalance] = useState("");

  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  const walletAddress = embeddedWallet?.address;

  useEffect(() => {
    async function fetchBalance() {
      if (!walletAddress) return;
      try {
        const publicClient = createPublicClient({
          chain: sepolia,
          transport: http(),
        });
        const balanceWei = await publicClient.getBalance({
          address: walletAddress as `0x${string}`,
        });
        setBalance(formatEther(balanceWei));
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    }
    fetchBalance();
  }, [walletAddress]);

  if (!embeddedWallet) {
    return <p className="text-sm text-gray-400">No embedded wallet found.</p>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 space-y-2">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100">Your Privy Wallet</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
        <strong>Address:</strong> {walletAddress}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        <strong>Balance (Sepolia):</strong> {balance} ETH
      </p>
      <button
        onClick={() => exportWallet()}
        className="mt-2 text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
      >
        Export Private Key
      </button>
    </div>
  );
}

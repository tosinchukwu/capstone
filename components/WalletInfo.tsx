"use client";
import { useState, useEffect } from "react";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { createPublicClient, http, formatEther } from "viem";
import { sepolia } from "viem/chains";

export default function WalletInfo() {
  const { wallets, ready } = useWallets();
  const { exportWallet } = usePrivy();
  const [balance, setBalance] = useState("");
  const [showExport, setShowExport] = useState(false);

  // 🔍 Debug logs
  console.log("🔍 WalletInfo - ready:", ready);
  console.log("🔍 WalletInfo - wallets:", wallets);

  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  console.log("🔍 WalletInfo - embeddedWallet found:", !!embeddedWallet);

  const walletAddress = embeddedWallet?.address;
  const isEmbedded = !!embeddedWallet;

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

  // If not ready or not embedded, return null (don't show anything)
  if (!ready) {
    return <div className="text-sm text-gray-400">Loading wallet...</div>;
  }

  if (!isEmbedded || !walletAddress) {
    console.log("🔍 WalletInfo - Not embedded or no address – hiding");
    return null;
  }

  const truncatedAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  const handleExport = async () => {
    console.log("🔍 WalletInfo - Export clicked");
    try {
      await exportWallet();
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-3 sm:p-4 max-w-sm mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Your Wallet (Privy)</p>
          <p className="text-sm font-mono text-gray-800 dark:text-gray-100 truncate" title={walletAddress}>
            {truncatedAddress}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Balance: <span className="font-semibold">{balance || "0"} ETH</span>
          </p>
        </div>
        <button
          onClick={() => setShowExport(!showExport)}
          className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded whitespace-nowrap"
        >
          {showExport ? "Cancel" : "Export Private Key"}
        </button>
      </div>
      {showExport && (
        <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <button
            onClick={handleExport}
            className="w-full text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Confirm Export
          </button>
          <p className="text-xs text-gray-400 mt-2">
            Warning: This reveals your private key. Never share it.
          </p>
        </div>
      )}
    </div>
  );
}
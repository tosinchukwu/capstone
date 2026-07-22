"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useEnsName } from "wagmi";

export default function ConnectWallet() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });

  const handleLogout = () => {
    // Clear role and selected doctor from localStorage
    localStorage.removeItem("userRole");
    localStorage.removeItem("selectedDoctorId");
    logout();
  };

  if (!ready) {
    return <div className="animate-pulse text-gray-400 dark:text-gray-500 text-xs sm:text-sm">Loading...</div>;
  }

  const displayName = authenticated && address
    ? (ensName || `${address.slice(0, 6)}...${address.slice(-4)}`)
    : null;

  return (
    <button
      onClick={authenticated ? handleLogout : login}
      className={`
        px-2 py-1 sm:px-4 sm:py-1.5 rounded-lg text-[10px] sm:text-sm font-medium 
        transition-all hover:shadow-md hover:scale-105 active:scale-95 
        whitespace-nowrap
        ${
          authenticated
            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50"
            : "theme-accent-bg text-white"
        }
      `}
    >
      {authenticated ? `Disconnect${displayName ? ` (${displayName})` : ""}` : "Connect"}
    </button>
  );
}
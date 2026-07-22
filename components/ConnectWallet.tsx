"use client";
import { usePrivy } from "@privy-io/react-auth";

export default function ConnectWallet() {
  const { ready, authenticated, login, logout } = usePrivy();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("selectedDoctorId");
    logout();
  };

  if (!ready) {
    return <div className="animate-pulse text-gray-400 dark:text-gray-500 text-xs sm:text-sm">Loading...</div>;
  }

  return (
    <button
      onClick={authenticated ? handleLogout : login}
      className={`
        px-3 py-1.5 rounded-lg text-sm font-medium 
        transition-all hover:shadow-md hover:scale-105 active:scale-95 
        whitespace-nowrap
        ${
          authenticated
            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50"
            : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        }
      `}
    >
      {authenticated ? "Disconnect" : "Connect Wallet"}
    </button>
  );
}
"use client";
import { usePrivy } from "@privy-io/react-auth";

export default function ConnectWallet() {
  const { ready, authenticated, login, logout } = usePrivy();

  if (!ready) {
    return <div className="animate-pulse text-gray-500">Loading...</div>;
  }

  return (
    <button
      onClick={authenticated ? logout : login}
      className={`px-6 py-2 rounded-lg font-medium transition ${
        authenticated
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {authenticated ? "Disconnect" : "Connect / Sign Up"}
    </button>
  );
}

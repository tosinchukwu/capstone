"use client";
import { usePrivy } from "@privy-io/react-auth";

export default function ConnectWallet() {
  const { ready, authenticated, login, logout } = usePrivy();

  if (!ready) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div>
      {!authenticated ? (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={login}
        >
          Connect / Sign Up
        </button>
      ) : (
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={logout}
        >
          Disconnect
        </button>
      )}
    </div>
  );
}

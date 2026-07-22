"use client";
import { useAccount, useEnsName } from "wagmi";

export default function Greeting() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  if (!isConnected || !address) return null;

  const displayName = ensName || `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <p className="text-lg font-medium theme-text">
      {getGreeting()}, {displayName} 👋
    </p>
  );
}
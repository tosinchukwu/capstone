import { useState } from "react";
import { useReadContract } from "wagmi";
import { useSendTransaction, useWallets } from "@privy-io/react-auth";
import { contractConfig } from "@/lib/contract";
import { encodeFunctionData } from "viem";

// Helper to check if the connected wallet is a Privy embedded wallet
const useIsEmbeddedWallet = () => {
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");
  return !!embeddedWallet;
};

// ----- WRITE HOOKS -----

export function useCreateAppointment() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);
  const { sendTransaction } = useSendTransaction();
  const isEmbedded = useIsEmbeddedWallet();

  const create = async (args: any[]) => {
    console.log("⛓️ create() called with args:", args);
    console.log("🔑 Is embedded wallet?", isEmbedded);
    setIsPending(true);
    setError(null);
    try {
      const encodedData = encodeFunctionData({
        abi: contractConfig.abi,
        functionName: "createAppointment",
        args,
      });
      console.log("📤 Sending createAppointment with sponsor:", isEmbedded);
      const result = await sendTransaction(
        {
          to: contractConfig.address,
          data: encodedData,
          chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111"),
        },
        {
          sponsor: isEmbedded, // ✅ Only enable sponsor for embedded wallets
        }
      );
      console.log("✅ createAppointment tx sent, hash:", result);
      setData(result);
      return result;
    } catch (err) {
      console.error("❌ createAppointment tx failed:", err);
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { create, isPending, error, data };
}

export function useConfirmAppointment() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);
  const { sendTransaction } = useSendTransaction();
  const isEmbedded = useIsEmbeddedWallet();

  const confirm = async (args: any[]) => {
    console.log("⛓️ confirm() called with args:", args);
    console.log("🔑 Is embedded wallet?", isEmbedded);
    setIsPending(true);
    setError(null);
    try {
      const encodedData = encodeFunctionData({
        abi: contractConfig.abi,
        functionName: "confirmAppointment",
        args,
      });
      console.log("📤 Sending confirmAppointment with sponsor:", isEmbedded);
      const result = await sendTransaction(
        {
          to: contractConfig.address,
          data: encodedData,
          chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111"),
        },
        {
          sponsor: isEmbedded,
        }
      );
      console.log("✅ confirmAppointment tx sent, hash:", result);
      setData(result);
      return result;
    } catch (err) {
      console.error("❌ confirmAppointment tx failed:", err);
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { confirm, isPending, error, data };
}

export function useCompleteAppointment() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);
  const { sendTransaction } = useSendTransaction();
  const isEmbedded = useIsEmbeddedWallet();

  const complete = async (args: any[]) => {
    console.log("⛓️ complete() called with args:", args);
    console.log("🔑 Is embedded wallet?", isEmbedded);
    setIsPending(true);
    setError(null);
    try {
      const encodedData = encodeFunctionData({
        abi: contractConfig.abi,
        functionName: "completeAppointment",
        args,
      });
      console.log("📤 Sending completeAppointment with sponsor:", isEmbedded);
      const result = await sendTransaction(
        {
          to: contractConfig.address,
          data: encodedData,
          chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111"),
        },
        {
          sponsor: isEmbedded,
        }
      );
      console.log("✅ completeAppointment tx sent, hash:", result);
      setData(result);
      return result;
    } catch (err) {
      console.error("❌ completeAppointment tx failed:", err);
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { complete, isPending, error, data };
}

// ----- READ HOOK -----

export function useGetAppointment(id: number) {
  const result = useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName: "getAppointment",
    args: [BigInt(id)],
  });
  return result;
}

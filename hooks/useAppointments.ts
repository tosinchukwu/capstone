import { useState } from "react";
import { useReadContract } from "wagmi";
import { useSendTransaction } from "@privy-io/react-auth";
import { contractConfig } from "@/lib/contract";
import { encodeFunctionData } from "viem";

export function useCreateAppointment() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);
  const { sendTransaction } = useSendTransaction();

  const create = async (args: any[]) => {
    console.log("⛓️ create() called with args:", args);
    setIsPending(true);
    setError(null);
    try {
      const encodedData = encodeFunctionData({
        abi: contractConfig.abi,
        functionName: "createAppointment",
        args,
      });
      console.log("📤 Sending transaction with sponsor: true");
      const result = await sendTransaction(
        {
          to: contractConfig.address,
          data: encodedData,
          chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111"),
        },
        {
          sponsor: true,
        }
      );
      console.log("✅ Transaction sent, hash:", result);
      setData(result);
      return result;
    } catch (err) {
      console.error("❌ Transaction failed:", err);
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { create, isPending, error, data };
}

// Same for confirm and complete – apply the same logging

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
      console.log("📤 Sending createAppointment with sponsor: true");
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

  const confirm = async (args: any[]) => {
    console.log("⛓️ confirm() called with args:", args);
    setIsPending(true);
    setError(null);
    try {
      const encodedData = encodeFunctionData({
        abi: contractConfig.abi,
        functionName: "confirmAppointment",
        args,
      });
      console.log("📤 Sending confirmAppointment with sponsor: true");
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

  const complete = async (args: any[]) => {
    console.log("⛓️ complete() called with args:", args);
    setIsPending(true);
    setError(null);
    try {
      const encodedData = encodeFunctionData({
        abi: contractConfig.abi,
        functionName: "completeAppointment",
        args,
      });
      console.log("📤 Sending completeAppointment with sponsor: true");
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

export function useGetAppointment(id: number) {
  const result = useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName: "getAppointment",
    args: [BigInt(id)],
  });
  return result;
}

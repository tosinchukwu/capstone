import { useState } from "react";
import { useReadContract, useWriteContract as useWagmiWriteContract } from "wagmi";
import { useSendTransaction, useWallets } from "@privy-io/react-auth";
import { contractConfig } from "@/lib/contract";
import { encodeFunctionData } from "viem";

// Helper hook to handle both embedded and external wallets
function useContractWrite(functionName: string) {
  const { wallets } = useWallets();
  const isEmbedded = wallets.some((w) => w.walletClientType === "privy");
  const { sendTransaction } = useSendTransaction();
  const { writeContract, isPending: wagmiPending, data: wagmiData } = useWagmiWriteContract();
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<any>(null);

  const write = async (args: any[]) => {
    setIsPending(true);
    setData(null);
    try {
      if (isEmbedded) {
        const encodedData = encodeFunctionData({
          abi: contractConfig.abi,
          functionName,
          args,
        });
        const result = await sendTransaction(
          {
            to: contractConfig.address,
            data: encodedData,
            chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111"),
          },
          { sponsor: true }
        );
        setData(result);
        return result;
      } else {
        return new Promise((resolve, reject) => {
          writeContract(
            {
              address: contractConfig.address,
              abi: contractConfig.abi,
              functionName,
              args,
            },
            {
              onSuccess: (data) => {
                setData(data);
                resolve(data);
              },
              onError: (error) => reject(error),
            }
          );
        });
      }
    } finally {
      setIsPending(false);
    }
  };

  return { write, isPending: isPending || wagmiPending, data };
}

// ----- PUBLIC HOOKS -----

export function useCreateAppointment() {
  const { write, isPending, data } = useContractWrite("createAppointment");
  const create = async (args: any[]) => {
    console.log("⛓️ create() called with args:", args);
    return await write(args);
  };
  return { create, isPending, data };
}

export function useConfirmAppointment() {
  const { write, isPending, data } = useContractWrite("confirmAppointment");
  const confirm = async (args: any[]) => {
    console.log("⛓️ confirm() called with args:", args);
    return await write(args);
  };
  return { confirm, isPending, data };
}

export function useCompleteAppointment() {
  const { write, isPending, data } = useContractWrite("completeAppointment");
  const complete = async (args: any[]) => {
    console.log("⛓️ complete() called with args:", args);
    return await write(args);
  };
  return { complete, isPending, data };
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

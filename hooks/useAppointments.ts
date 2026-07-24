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
  const { writeContract, isPending: wagmiPending } = useWagmiWriteContract();
  const [isPending, setIsPending] = useState(false);

  const write = async (args: any[]) => {
    setIsPending(true);
    try {
      if (isEmbedded) {
        // Use Privy sendTransaction with sponsorship
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
        return result;
      } else {
        // Use Wagmi writeContract (no sponsorship)
        return new Promise((resolve, reject) => {
          writeContract(
            {
              address: contractConfig.address,
              abi: contractConfig.abi,
              functionName,
              args,
            },
            {
              onSuccess: (data) => resolve(data),
              onError: (error) => reject(error),
            }
          );
        });
      }
    } finally {
      setIsPending(false);
    }
  };

  return { write, isPending: isPending || wagmiPending };
}

// ----- PUBLIC HOOKS -----

export function useCreateAppointment() {
  const { write, isPending } = useContractWrite("createAppointment");
  const create = async (args: any[]) => {
    console.log("⛓️ create() called with args:", args);
    return await write(args);
  };
  return { create, isPending };
}

export function useConfirmAppointment() {
  const { write, isPending } = useContractWrite("confirmAppointment");
  const confirm = async (args: any[]) => {
    console.log("⛓️ confirm() called with args:", args);
    return await write(args);
  };
  return { confirm, isPending };
}

export function useCompleteAppointment() {
  const { write, isPending } = useContractWrite("completeAppointment");
  const complete = async (args: any[]) => {
    console.log("⛓️ complete() called with args:", args);
    return await write(args);
  };
  return { complete, isPending };
}

// ----- READ HOOK (unchanged) -----

export function useGetAppointment(id: number) {
  const result = useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName: "getAppointment",
    args: [BigInt(id)],
  });
  return result;
}

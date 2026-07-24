import { useReadContract } from "wagmi";
import { useSendTransaction } from "@privy-io/react-auth";
import { contractConfig } from "@/lib/contract";
import { encodeFunctionData } from "viem";

// ----- WRITE HOOKS (using Privy's useSendTransaction with gas sponsorship) -----

export function useCreateAppointment() {
  const { sendTransaction, isPending, error, data } = useSendTransaction();

  const create = (args: any[]) => {
    console.log("⛓️ create() called with args:", args);
    console.log("⛓️ contractConfig:", contractConfig);

    const encodedData = encodeFunctionData({
      abi: contractConfig.abi,
      functionName: "createAppointment",
      args,
    });

    sendTransaction(
      {
        to: contractConfig.address,
        data: encodedData,
        chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111"),
      },
      {
        sponsor: true, // ✅ Enable gas sponsorship
      }
    );
  };

  return { create, isPending, error, data };
}

export function useConfirmAppointment() {
  const { sendTransaction, isPending, error, data } = useSendTransaction();

  const confirm = (args: any[]) => {
    console.log("⛓️ confirm() called with args:", args);
    console.log("⛓️ contractConfig:", contractConfig);

    const encodedData = encodeFunctionData({
      abi: contractConfig.abi,
      functionName: "confirmAppointment",
      args,
    });

    sendTransaction(
      {
        to: contractConfig.address,
        data: encodedData,
        chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111"),
      },
      {
        sponsor: true, // ✅ Enable gas sponsorship
      }
    );
  };

  return { confirm, isPending, error, data };
}

export function useCompleteAppointment() {
  const { sendTransaction, isPending, error, data } = useSendTransaction();

  const complete = (args: any[]) => {
    console.log("⛓️ complete() called with args:", args);
    console.log("⛓️ contractConfig:", contractConfig);

    const encodedData = encodeFunctionData({
      abi: contractConfig.abi,
      functionName: "completeAppointment",
      args,
    });

    sendTransaction(
      {
        to: contractConfig.address,
        data: encodedData,
        chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111"),
      },
      {
        sponsor: true, // ✅ Enable gas sponsorship
      }
    );
  };

  return { complete, isPending, error, data };
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

import { useWriteContract, useReadContract } from "wagmi";
import { contractConfig } from "@/lib/contract";

// ----- WRITE HOOKS -----

export function useCreateAppointment() {
  const { writeContract, isPending, error, data } = useWriteContract();

  const create = (args: any[]) => {
    console.log("⛓️ create() called with args:", args);
    writeContract({
      address: contractConfig.address,
      abi: contractConfig.abi,
      functionName: "createAppointment",
      args,
    });
  };

  return { create, isPending, error, data };
}

export function useConfirmAppointment() {
  const { writeContract, isPending, error, data } = useWriteContract();

  const confirm = (args: any[]) => {
    console.log("⛓️ confirm() called with args:", args);
    writeContract({
      address: contractConfig.address,
      abi: contractConfig.abi,
      functionName: "confirmAppointment",
      args,
    });
  };
  return { confirm, isPending, error, data };
}

export function useCompleteAppointment() {
  const { writeContract, isPending, error, data } = useWriteContract();

  const complete = (args: any[]) => {
    console.log("⛓️ complete() called with args:", args);
    writeContract({
      address: contractConfig.address,
      abi: contractConfig.abi,
      functionName: "completeAppointment",
      args,
    });
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
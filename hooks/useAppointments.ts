import { useWriteContract, useReadContract } from "wagmi";
import { contractConfig } from "@/lib/contract";

// ----- Write hooks -----

export function useCreateAppointment() {
  const { writeContract, isPending } = useWriteContract();
  const create = (args: any[]) => {
    console.log("⛓️ writeContract called for createAppointment with args:", args);
    writeContract({
      address: contractConfig.address,
      abi: contractConfig.abi,
      functionName: "createAppointment",
      args,
    });
  };
  return { create, isPending };
}

export function useConfirmAppointment() {
  const { writeContract, isPending } = useWriteContract();
  const confirm = (args: any[]) => {
    console.log("⛓️ writeContract called for confirmAppointment with args:", args);
    writeContract({
      address: contractConfig.address,
      abi: contractConfig.abi,
      functionName: "confirmAppointment",
      args,
    });
  };
  return { confirm, isPending };
}

export function useCompleteAppointment() {
  const { writeContract, isPending } = useWriteContract();
  const complete = (args: any[]) => {
    console.log("⛓️ writeContract called for completeAppointment with args:", args);
    writeContract({
      address: contractConfig.address,
      abi: contractConfig.abi,
      functionName: "completeAppointment",
      args,
    });
  };
  return { complete, isPending };
}

// ----- Read hook -----

export function useGetAppointment(id: number) {
  const result = useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName: "getAppointment",
    args: [BigInt(id)],
  });
  return result;
}
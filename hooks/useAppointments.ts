import { useReadContract, useWriteContract } from "wagmi";
import { contractConfig } from "@/lib/contract";

export function useCreateAppointment() {
  const { writeContract, isPending } = useWriteContract();
  const create = (args: any[]) => {
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
    writeContract({
      address: contractConfig.address,
      abi: contractConfig.abi,
      functionName: "completeAppointment",
      args,
    });
  };
  return { complete, isPending };
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

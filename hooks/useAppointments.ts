import { useReadContract, useWriteContract } from "wagmi";
import { contractConfig } from "@/lib/contract";

export function useCreateAppointment() {
  const { write, isPending } = useWriteContract();
  const create = (args: any[]) => {
    write({
      address: contractConfig.address,
      abi: contractConfig.abi,
      functionName: "createAppointment",
      args,
    });
  };
  return { create, isPending };
}

export function useConfirmAppointment() {
  const { write, isPending } = useWriteContract();
  const confirm = (args: any[]) => {
    write({
      address: contractConfig.address,
      abi: contractConfig.abi,
      functionName: "confirmAppointment",
      args,
    });
  };
  return { confirm, isPending };
}

export function useCompleteAppointment() {
  const { write, isPending } = useWriteContract();
  const complete = (args: any[]) => {
    write({
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

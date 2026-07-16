import { useContractRead, useContractWrite } from "wagmi";
import { contractConfig } from "@/lib/contract";

export function useCreateAppointment() {
  return useContractWrite({
    ...contractConfig,
    functionName: "createAppointment",
  });
}

export function useConfirmAppointment() {
  return useContractWrite({
    ...contractConfig,
    functionName: "confirmAppointment",
  });
}

export function useCompleteAppointment() {
  return useContractWrite({
    ...contractConfig,
    functionName: "completeAppointment",
  });
}

export function useGetAppointment(id: number) {
  return useContractRead({
    ...contractConfig,
    functionName: "getAppointment",
    args: [BigInt(id)],
  });
}

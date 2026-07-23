import { useWriteContract, useReadContract } from "wagmi";
import { contractConfig } from "@/lib/contract";

// ----- WRITE HOOKS -----

export function useCreateAppointment() {
  const { writeContract, isPending, error, data } = useWriteContract();

  const create = (args: any[]) => {
    console.log("⛓️ create() called with args:", args);
    console.log("⛓️ contractConfig:", contractConfig);
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
    console.log("⛓️ contractConfig:", contractConfig);
    writeContract({
      address: contractConfig.address,
      abi: contractConfig.abi,
      functionName: "confirmAppointment",
      args,
    });
  };
  return { confirm, isPending, error, data };
}

// ✅ FIXED: CompleteAppointment with proper logging
export function useCompleteAppointment() {
  const { writeContract, isPending, error, data } = useWriteContract();

  const complete = (args: any[]) => {
    console.log("⛓️ complete() called with args:", args);
    console.log("⛓️ contractConfig:", contractConfig);
    console.log("⛓️ About to call writeContract for completeAppointment");

    try {
      writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: "completeAppointment",
        args,
      });
      console.log("✅ writeContract called successfully");
    } catch (err) {
      console.error("❌ writeContract threw an error:", err);
      throw err;
    }
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
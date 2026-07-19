import { useWriteContract, useReadContract } from "wagmi";
import { contractConfig } from "@/lib/contract";

// ----- WRITE HOOKS -----

export function useCreateAppointment() {
  const { writeContract, isPending, error } = useWriteContract();

  const create = async (args: any[]) => {
    console.log("⛓️ create() called with args:", args);
    console.log("⛓️ contractConfig:", contractConfig);

    if (!contractConfig.address) {
      console.error("❌ Contract address is missing!");
      throw new Error("Contract address not configured");
    }
    if (!contractConfig.abi || (Array.isArray(contractConfig.abi) && contractConfig.abi.length === 0)) {
      console.error("❌ ABI is missing or empty!");
      throw new Error("ABI not configured");
    }

    try {
      console.log("⛓️ Calling writeContract with:", {
        address: contractConfig.address,
        functionName: "createAppointment",
        args,
      });
      await writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: "createAppointment",
        args,
      });
      console.log("✅ writeContract executed successfully.");
    } catch (err) {
      console.error("❌ writeContract threw an error:", err);
      throw err;
    }
  };

  return { create, isPending, error };
}

export function useConfirmAppointment() {
  const { writeContract, isPending, error } = useWriteContract();

  const confirm = async (args: any[]) => {
    console.log("⛓️ confirm() called with args:", args);
    try {
      await writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: "confirmAppointment",
        args,
      });
    } catch (err) {
      console.error("❌ confirm error:", err);
      throw err;
    }
  };
  return { confirm, isPending, error };
}

export function useCompleteAppointment() {
  const { writeContract, isPending, error } = useWriteContract();

  const complete = async (args: any[]) => {
    console.log("⛓️ complete() called with args:", args);
    try {
      await writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: "completeAppointment",
        args,
      });
    } catch (err) {
      console.error("❌ complete error:", err);
      throw err;
    }
  };
  return { complete, isPending, error };
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
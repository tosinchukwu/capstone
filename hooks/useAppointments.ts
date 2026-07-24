// ✅ Use @privy-io/wagmi for write hooks (supports sponsorship)
import { useWriteContract } from "@privy-io/wagmi";
// ✅ Keep useReadContract from wagmi (reads don't need sponsorship)
import { useReadContract } from "wagmi";
import { contractConfig } from "@/lib/contract";

// ----- WRITE HOOKS (with gas sponsorship) -----

export function useCreateAppointment() {
  const { writeContract, isPending, error, data } = useWriteContract();

  const create = (args: any[]) => {
    console.log("⛓️ create() called with args:", args);
    console.log("⛓️ contractConfig:", contractConfig);
    writeContract(
      {
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: "createAppointment",
        args,
      },
      { sponsor: true } // ✅ Enable gas sponsorship
    );
  };

  return { create, isPending, error, data };
}

export function useConfirmAppointment() {
  const { writeContract, isPending, error, data } = useWriteContract();

  const confirm = (args: any[]) => {
    console.log("⛓️ confirm() called with args:", args);
    console.log("⛓️ contractConfig:", contractConfig);
    writeContract(
      {
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: "confirmAppointment",
        args,
      },
      { sponsor: true } // ✅ Enable gas sponsorship
    );
  };
  return { confirm, isPending, error, data };
}

export function useCompleteAppointment() {
  const { writeContract, isPending, error, data } = useWriteContract();

  const complete = (args: any[]) => {
    console.log("⛓️ complete() called with args:", args);
    console.log("⛓️ contractConfig:", contractConfig);
    writeContract(
      {
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: "completeAppointment",
        args,
      },
      { sponsor: true } // ✅ Enable gas sponsorship
    );
  };
  return { complete, isPending, error, data };
}

// ----- READ HOOK (no changes needed) -----

export function useGetAppointment(id: number) {
  const result = useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName: "getAppointment",
    args: [BigInt(id)],
  });
  return result;
}

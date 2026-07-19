import abi from "@/abis/HealthConsultationBooking.json";

// Cast the ABI to any to bypass complex type checking
// This is safe because the ABI is correctly structured
export const contractConfig = {
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
  abi: abi as any,
};
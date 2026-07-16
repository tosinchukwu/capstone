import { getContract } from 'viem';
import { config } from './wagmi';
import abi from '@/abis/HealthConsultationBooking.json';

export const contractConfig = {
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
  abi,
};

export function getContractInstance() {
  return getContract({
    ...contractConfig,
    client: config.getClient(),
  });
}

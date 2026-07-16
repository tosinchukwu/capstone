import { useContract } from 'wagmi';
import { contractConfig } from '@/lib/contract';
export function useContractInstance() {
  return useContract({
    ...contractConfig,
  });
}

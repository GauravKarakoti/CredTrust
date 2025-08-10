import { useWalletClient } from 'wagmi';
import { type WalletClient } from 'viem';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { useMemo } from 'react';

function walletClientToSigner(walletClient: WalletClient): JsonRpcSigner | undefined {
  const { account, chain, transport } = walletClient;

  // Add a guard clause to ensure account and chain are defined.
  // If they aren't, we can't create a signer, so we return undefined.
  if (!account || !chain) {
    return undefined;
  }

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient],
  );
}
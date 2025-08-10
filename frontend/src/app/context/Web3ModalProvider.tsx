"use client";

// Corrected imports for the Wagmi adapter
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiProvider } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Setup queryClient
const queryClient = new QueryClient();

const projectId = '8ad7413ad257e98832358fdf61ec3f1f';

// Create wagmiConfig
const metadata = {
  name: 'CredTrust',
  description: 'CredTrust Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [mainnet, sepolia] as const;
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata
});

// Create modal - **'chains' property removed**
createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
});

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig} >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
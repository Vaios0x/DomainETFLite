import { createConfig, http } from 'wagmi';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { domaTestnet } from './doma-chain';

export const config = createConfig({
  chains: [domaTestnet],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
    }),
    coinbaseWallet({
      appName: 'DomainETF Lite',
    }),
  ],
  transports: {
    [domaTestnet.id]: http(),
  },
  ssr: true,
});

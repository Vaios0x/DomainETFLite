import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { domaTestnet } from './doma-chain';

export const rainbowKitConfig = getDefaultConfig({
  appName: 'DomainETF Lite',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [domaTestnet],
  ssr: true,
  appDescription: 'DomainETF Lite - Decentralized Trading Platform',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  appIcon: '/logo.svg',
});

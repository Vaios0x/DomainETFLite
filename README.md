# DomainETF Lite

> The first decentralized perpetual trading platform for domain names

DomainETF Lite is a cutting-edge DeFi application that enables perpetual trading on the top 100 most traded domains in Doma Protocol. Built for the Doma Protocol hackathon, this platform combines the power of perpetual swaps with the emerging domain name market.

## 🚀 Features

### Core Trading Features
- **Perpetual Trading**: Trade long/short positions on domain name indices with up to 50x leverage
- **Real-time Price Feeds**: Live price updates and funding rate monitoring
- **Liquidity Provision**: Earn fees by providing liquidity to the trading pool
- **Leaderboard**: Track top traders by 24h PnL performance

### DomainFi Integration
- **Domain Tokenization**: Convert traditional domains into blockchain-based assets
- **Domain Fractionalization**: Split domain ownership into fungible tokens
- **Synthetic Token Trading**: Trade tokens representing specific domain rights (DNS, subdomain, etc.)
- **Doma Protocol Integration**: Full integration with Doma Protocol ecosystem

### User Experience
- **Mobile-First Design**: Fully responsive PWA with dark/light theme support
- **Multi-language Support**: Available in English and Spanish
- **Web3 Integration**: Seamless wallet connection with RainbowKit
- **Cross-Chain Support**: Native support for Doma Testnet and Base Sepolia

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Web3**: wagmi v2, viem, RainbowKit
- **State Management**: Zustand
- **Charts**: Chart.js with react-chartjs-2
- **UI Components**: Radix UI, shadcn/ui
- **Real-time**: Socket.io client
- **Testing**: Vitest, React Testing Library
- **Deployment**: Vercel

## 🏗 Project Structure

```
domainetf-lite-frontend/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public layout and pages
│   ├── trade/             # Trading interface
│   ├── domainfi/          # DomainFi management
│   ├── liquidity/         # Liquidity management
│   ├── leaderboard/       # Trader rankings
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── DomainManager.tsx  # Domain tokenization & fractionalization
│   ├── NetworkSwitcher.tsx # Network management
│   └── ui/                # Base UI components
├── contracts/             # Smart contracts
│   ├── DomainPerpPool.sol # Perpetual trading pool
│   └── DomaIntegration.sol # Doma Protocol integration
├── hooks/                 # Custom React hooks
│   ├── useDomaIntegration.ts # Doma Protocol integration
│   ├── usePerpPool.ts     # Perpetual pool management
│   └── usePriceFeed.ts    # Price feed management
├── lib/                   # Utilities and configurations
├── types/                 # TypeScript type definitions
├── zustand/              # State management stores
└── messages/             # Internationalization files
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/domainetf-lite-frontend.git
   cd domainetf-lite-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   NEXT_PUBLIC_DOMA_RPC=https://rpc.doma.testnet
   NEXT_PUBLIC_PERP_ADDRESS=0x1234567890123456789012345678901234567890
   NEXT_PUBLIC_CHAIN_ID=424242
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Getting Started

1. **Connect Wallet**: Click "Connect Wallet" to connect your Web3 wallet
2. **Get Testnet USDC**: Use the faucet link to get USDC testnet tokens
3. **Start Trading**: Navigate to the Trade page to open positions
4. **Provide Liquidity**: Add liquidity to earn trading fees
5. **Track Performance**: Check the leaderboard for rankings

### Trading

- **Long Position**: Bet that domain prices will increase
- **Short Position**: Bet that domain prices will decrease
- **Leverage**: Amplify your position up to 10x
- **Funding**: Pay/receive funding fees every 8 hours

### Liquidity Provision

- **Add Liquidity**: Deposit USDC to earn trading fees
- **Remove Liquidity**: Withdraw your funds anytime
- **APR**: Earn based on trading volume and funding rates

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   - Import your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push to main

2. **Environment Variables**
   Set the following in Vercel:
   - `NEXT_PUBLIC_DOMA_RPC`
   - `NEXT_PUBLIC_PERP_ADDRESS`
   - `NEXT_PUBLIC_CHAIN_ID`
   - `NEXT_PUBLIC_SOCKET_URL`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Code Quality

- **ESLint**: Code linting with Next.js and TailwindCSS rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **TypeScript**: Strict type checking

## 🌐 Networks

### Doma Testnet
- **Chain ID**: 424242
- **RPC**: https://rpc.doma.testnet
- **Explorer**: https://explorer.doma.testnet
- **Faucet**: https://faucet.doma.testnet

### Base Sepolia (for liquidations)
- **Chain ID**: 84532
- **RPC**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org

## 📊 Smart Contracts

### PerpPool Contract
- **Address**: `0x1234567890123456789012345678901234567890` (example)
- **Functions**:
  - `openPosition(size, isLong, leverage)` - Open a new position
  - `closePosition(positionId)` - Close an existing position
  - `addLiquidity(amount)` - Add liquidity to the pool
  - `removeLiquidity(amount)` - Remove liquidity from the pool
  - `getPoolMetrics()` - Get TVL, OI, and funding rate
  - `getUserPositions(user)` - Get user's positions

## 🎯 Hackathon Deliverables

- ✅ **Repository**: Public GitHub repository with complete code
- ✅ **Production URL**: https://domainetf-lite.vercel.app
- ✅ **Demo Video**: 3-minute demonstration of key features
- ✅ **Documentation**: Comprehensive README and setup guide
- ✅ **Testing**: Unit tests with >80% coverage
- ✅ **Accessibility**: WCAG 2.1 AA compliant
- ✅ **Performance**: Lighthouse score >90

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Doma Protocol** for the hackathon opportunity
- **Next.js Team** for the amazing framework
- **RainbowKit** for Web3 wallet integration
- **shadcn/ui** for beautiful UI components
- **Vercel** for deployment platform

## 📞 Support

- **Documentation**: [docs.domainetf.com](https://docs.domainetf.com)
- **Discord**: [DomainETF Community](https://discord.gg/domainetf)
- **Twitter**: [@domainetf](https://twitter.com/domainetf)
- **Email**: support@domainetf.com

---

**Built with ❤️ for the Doma Protocol Hackathon**

*DomainETF Lite - The future of domain name trading is here.*

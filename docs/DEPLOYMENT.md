# DomainETF Lite - Guía de Despliegue

## Visión General

Esta guía proporciona instrucciones detalladas para desplegar DomainETF Lite en diferentes entornos, desde desarrollo local hasta producción en Vercel.

## Prerrequisitos

### Software Requerido
- Node.js >= 18.0.0
- npm >= 8.0.0
- Git
- Cuenta de Vercel
- Wallet de Web3 (MetaMask, Coinbase Wallet, etc.)

### Variables de Entorno
```bash
# Doma Protocol
NEXT_PUBLIC_DOMA_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_DOMA_OWNERSHIP_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_DOMA_SYNTHETIC_TOKEN_ADDRESS=0x...

# Perpetual Pool
NEXT_PUBLIC_PERP_POOL_ADDRESS=0x...

# Base Testnet
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://...
NEXT_PUBLIC_BASE_SEPOLIA_CHAIN_ID=84532

# Socket.io
NEXT_PUBLIC_SOCKET_URL=ws://localhost:3001

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

## Despliegue Local

### 1. Clonar el Repositorio
```bash
git clone https://github.com/your-username/domainetf-lite.git
cd domainetf-lite
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
cp env.example .env.local
# Editar .env.local con tus valores
```

### 4. Ejecutar en Modo Desarrollo
```bash
npm run dev
```

### 5. Ejecutar Servidor Socket (Opcional)
```bash
npm run dev:socket
```

## Despliegue en Vercel

### 1. Preparación del Proyecto

#### Verificar Configuración
```bash
# Verificar que el build funciona
npm run build

# Ejecutar tests
npm run test

# Verificar tipos
npm run type-check

# Verificar linting
npm run lint
```

#### Optimizar para Producción
```bash
# Analizar bundle
npm run analyze

# Ejecutar auditorías
npm run audit:all
```

### 2. Configuración de Vercel

#### Crear Proyecto en Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Desplegar
vercel
```

#### Configurar Variables de Entorno en Vercel
```bash
# A través de CLI
vercel env add NEXT_PUBLIC_DOMA_REGISTRY_ADDRESS
vercel env add NEXT_PUBLIC_PERP_POOL_ADDRESS
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# ... agregar todas las variables necesarias

# O a través del dashboard de Vercel
# https://vercel.com/dashboard -> Project -> Settings -> Environment Variables
```

### 3. Configuración de Dominio Personalizado

#### Agregar Dominio
```bash
# Agregar dominio
vercel domains add yourdomain.com

# Configurar DNS
# A record: @ -> 76.76.19.61
# CNAME: www -> cname.vercel-dns.com
```

#### Configurar SSL
```bash
# SSL se configura automáticamente en Vercel
# Verificar en: https://vercel.com/dashboard -> Project -> Settings -> Domains
```

### 4. Configuración de CI/CD

#### GitHub Actions (Opcional)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - run: npm run lint
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Despliegue de Smart Contracts

### 1. Configuración de Hardhat

#### Instalar Dependencias
```bash
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
```

#### Configurar hardhat.config.js
```javascript
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.19",
  networks: {
    domaTestnet: {
      url: process.env.DOMA_TESTNET_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1001,
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 84532,
    },
  },
};
```

### 2. Desplegar Contratos

#### Script de Despliegue
```javascript
// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  
  // Desplegar DomainPerpPool
  const DomainPerpPool = await ethers.getContractFactory("DomainPerpPool");
  const perpPool = await DomainPerpPool.deploy();
  await perpPool.deployed();
  
  console.log("DomainPerpPool deployed to:", perpPool.address);
  
  // Desplegar DomaIntegration
  const DomaIntegration = await ethers.getContractFactory("DomaIntegration");
  const domaIntegration = await DomaIntegration.deploy();
  await domaIntegration.deployed();
  
  console.log("DomaIntegration deployed to:", domaIntegration.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

#### Ejecutar Despliegue
```bash
# Desplegar en Doma Testnet
npx hardhat run scripts/deploy.js --network domaTestnet

# Desplegar en Base Sepolia
npx hardhat run scripts/deploy.js --network baseSepolia
```

### 3. Verificar Contratos

#### Script de Verificación
```bash
# Verificar en Doma Testnet
npx hardhat verify --network domaTestnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>

# Verificar en Base Sepolia
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Configuración de Redes

### 1. Doma Testnet

#### Configuración de Red
```javascript
// lib/constants.ts
export const domaTestnet = {
  id: 1001,
  name: 'Doma Testnet',
  network: 'doma-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Doma',
    symbol: 'DOMA',
  },
  rpcUrls: {
    public: { http: ['https://rpc.doma.testnet'] },
    default: { http: ['https://rpc.doma.testnet'] },
  },
  blockExplorers: {
    default: { name: 'Doma Explorer', url: 'https://explorer.doma.testnet' },
  },
  testnet: true,
};
```

#### Agregar a MetaMask
```javascript
// Red: Doma Testnet
// RPC URL: https://rpc.doma.testnet
// Chain ID: 1001
// Symbol: DOMA
// Block Explorer: https://explorer.doma.testnet
```

### 2. Base Sepolia

#### Configuración de Red
```javascript
// lib/constants.ts
export const baseSepolia = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://sepolia.base.org'] },
    default: { http: ['https://sepolia.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
};
```

## Monitoreo y Mantenimiento

### 1. Monitoreo de Aplicación

#### Vercel Analytics
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### Error Tracking
```typescript
// components/ErrorBoundary.tsx
import { captureException } from '@sentry/nextjs';

export class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    captureException(error, { extra: errorInfo });
  }
}
```

### 2. Monitoreo de Smart Contracts

#### Event Monitoring
```javascript
// scripts/monitor.js
const contract = new ethers.Contract(address, abi, provider);

contract.on('PositionOpened', (user, domain, size, leverage, isLong) => {
  console.log('New position opened:', { user, domain, size, leverage, isLong });
});

contract.on('PositionClosed', (user, domain, pnl) => {
  console.log('Position closed:', { user, domain, pnl });
});
```

### 3. Backup y Recuperación

#### Backup de Base de Datos
```bash
# Backup de datos de usuario (si aplica)
pg_dump -h localhost -U username -d domainetf > backup.sql

# Backup de archivos estáticos
tar -czf static-backup.tar.gz public/
```

#### Recuperación
```bash
# Restaurar base de datos
psql -h localhost -U username -d domainetf < backup.sql

# Restaurar archivos estáticos
tar -xzf static-backup.tar.gz
```

## Optimización de Rendimiento

### 1. Frontend Optimization

#### Bundle Analysis
```bash
# Analizar bundle
npm run analyze

# Optimizar imágenes
npm run optimize:images

# Minificar CSS
npm run minify:css
```

#### Caching Strategy
```javascript
// next.config.ts
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### 2. Smart Contract Optimization

#### Gas Optimization
```solidity
// Usar uint256 en lugar de uint8 para storage
uint256 public constant MAX_LEVERAGE = 100;

// Usar events en lugar de storage para datos históricos
event PositionOpened(address indexed user, string domain, uint256 size);

// Usar libraries para funciones comunes
library Math {
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }
}
```

## Seguridad

### 1. Frontend Security

#### Content Security Policy
```javascript
// next.config.ts
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};
```

#### Input Validation
```typescript
// lib/validation.ts
import { z } from 'zod';

export const tradeSchema = z.object({
  size: z.number().min(0.01).max(1000),
  leverage: z.number().min(1).max(100),
  isLong: z.boolean(),
});
```

### 2. Smart Contract Security

#### Access Control
```solidity
// Usar OpenZeppelin AccessControl
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DomainPerpPool is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PRICE_UPDATER_ROLE = keccak256("PRICE_UPDATER_ROLE");
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
}
```

#### Reentrancy Protection
```solidity
// Usar ReentrancyGuard
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DomainPerpPool is ReentrancyGuard {
    function openPosition(...) external nonReentrant {
        // Lógica de apertura de posición
    }
}
```

## Troubleshooting

### 1. Problemas Comunes

#### Error de Build
```bash
# Limpiar cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

#### Error de Conexión Web3
```typescript
// Verificar configuración de red
const { chain } = useNetwork();
if (chain?.id !== 1001) {
  // Cambiar a Doma Testnet
  switchNetwork?.(1001);
}
```

#### Error de Transacción
```typescript
// Manejar errores de transacción
try {
  const tx = await openPosition(params);
  await tx.wait();
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    // Mostrar error de fondos insuficientes
  } else if (error.code === 'USER_REJECTED') {
    // Usuario rechazó la transacción
  }
}
```

### 2. Logs y Debugging

#### Frontend Logs
```typescript
// Habilitar logs de desarrollo
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', { user, position, price });
}
```

#### Smart Contract Logs
```solidity
// Usar eventos para debugging
event DebugInfo(address user, uint256 value, string message);

function debugFunction() external {
    emit DebugInfo(msg.sender, msg.value, "Function called");
}
```

## Conclusión

Esta guía proporciona una base sólida para desplegar DomainETF Lite en diferentes entornos. Para obtener soporte adicional o reportar problemas, consulta la documentación del proyecto o contacta al equipo de desarrollo.

### Recursos Adicionales
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Hardhat](https://hardhat.org/docs)
- [Documentación de wagmi](https://wagmi.sh/docs)
- [Documentación de RainbowKit](https://www.rainbowkit.com/docs)

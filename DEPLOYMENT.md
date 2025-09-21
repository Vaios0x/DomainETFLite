# 🚀 Deployment Guide - DomainETF Lite

## Vercel Deployment

### Option 1: Automatic Deployment via GitHub (Recommended)

1. **Connect to Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"

2. **Import Repository:**
   - Select "Import Git Repository"
   - Choose `Vaios0x/DomainETFLite`
   - Click "Import"

3. **Configure Project:**
   - **Project Name:** `domain-etflite`
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

4. **Environment Variables:**
   ```
   NEXT_PUBLIC_DOMA_RPC=https://rpc-testnet.doma.xyz
   NEXT_PUBLIC_CHAIN_ID=1001
   NEXT_PUBLIC_PERP_ADDRESS=0x0000000000000000000000000000000000000000
   NEXT_PUBLIC_SOCKET_URL=https://domain-etflite.vercel.app
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be available at `https://domain-etflite.vercel.app`

### Option 2: Manual Deployment via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod --yes
```

### Option 3: GitHub Actions (CI/CD)

The project includes GitHub Actions workflow for automatic deployment:

- **File:** `.github/workflows/deploy.yml`
- **Trigger:** Push to `master` branch
- **Auto-deploy:** Every commit automatically deploys to Vercel

## 🔧 Build Configuration

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Vercel Configuration (vercel.json)
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

## 🌐 Live URLs

- **Production:** https://domain-etflite.vercel.app
- **GitHub Repository:** https://github.com/Vaios0x/DomainETFLite
- **Vercel Dashboard:** https://vercel.com/vai0sxs-projects/domain-etflite

## 📱 PWA Features

The app is configured as a Progressive Web App (PWA) with:
- Service Worker for offline functionality
- App manifest for mobile installation
- Responsive design for all devices

## 🔗 Doma Protocol Integration

- **Testnet RPC:** https://rpc-testnet.doma.xyz
- **Explorer:** https://explorer-testnet.doma.xyz
- **Chain ID:** 1001
- **Network:** Doma Testnet

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check Node.js version (>=18.0.0)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables:**
   - Ensure all required env vars are set in Vercel dashboard
   - Check variable names match exactly

3. **API Issues:**
   - Verify Doma Testnet RPC is accessible
   - Check CORS settings for API endpoints

### Support:
- **GitHub Issues:** https://github.com/Vaios0x/DomainETFLite/issues
- **Documentation:** See README.md for detailed setup instructions

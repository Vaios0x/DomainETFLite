import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ToastContainer } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { TutorialTrigger } from "@/components/Tutorial";
import { ClientOnly } from "@/components/ClientOnly";
import PublicLayout from "./(public)/layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DomainETF Lite | Perpetuals on Top-100 Domains",
  description: "Trade perpetual swaps on the top 100 most traded domains in Doma Protocol. The first decentralized perpetual trading platform for domain names.",
  keywords: ["DeFi", "perpetuals", "domains", "trading", "Doma Protocol", "Web3"],
  authors: [{ name: "DomainETF Team" }],
  creator: "DomainETF",
  publisher: "DomainETF",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://domainetf-lite.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "es-ES": "/es",
    },
  },
  openGraph: {
    title: "DomainETF Lite | Perpetuals on Top-100 Domains",
    description: "Trade perpetual swaps on the top 100 most traded domains in Doma Protocol.",
    url: "https://domainetf-lite.vercel.app",
    siteName: "DomainETF Lite",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "DomainETF Lite - Perpetual Trading Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DomainETF Lite | Perpetuals on Top-100 Domains",
    description: "Trade perpetual swaps on the top 100 most traded domains in Doma Protocol.",
    images: ["/og.png"],
    creator: "@domainetf",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <Providers>
            <PublicLayout>
              {children}
            </PublicLayout>
            <ToastContainer />
            <ClientOnly>
              <PWAInstallPrompt />
            </ClientOnly>
            <ClientOnly>
              <TutorialTrigger />
            </ClientOnly>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

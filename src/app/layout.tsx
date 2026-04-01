import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Providers from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { EmailVerifyBanner } from "@/components/auth/EmailVerifyBanner";
import { ChatbotWidget } from "@/components/common/ChatbotWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sport-store-zeta.vercel.app';
const SITE_NAME = 'SportStore';
const SITE_DESCRIPTION = 'Cửa hàng trang phục & phụ kiện thể thao chính hãng — Nike, Adidas, Puma, Under Armour và hàng trăm thương hiệu uy tín. Giao hàng toàn quốc, đổi trả dễ dàng.';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Trang phục & Phụ kiện Thể thao Chính hãng`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'thể thao', 'trang phục thể thao', 'phụ kiện thể thao',
    'Nike', 'Adidas', 'Puma', 'Under Armour', 'giày thể thao',
    'áo thể thao', 'quần thể thao', 'SportStore', 'mua sắm thể thao',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'shopping',
  applicationName: SITE_NAME,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Trang phục & Phụ kiện Thể thao Chính hãng`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Trang phục thể thao chính hãng`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Trang phục & Phụ kiện Thể thao Chính hãng`,
    description: SITE_DESCRIPTION,
    images: ['/og-image.jpg'],
    creator: '@sportstore_vn',
    site: '@sportstore_vn',
  },
  alternates: {
    canonical: SITE_URL,
    languages: { 'vi-VN': SITE_URL },
  },
  icons: {
    icon: [
      { url: '/favici.png?v=logo-new', sizes: 'any' },
    ],
    apple: '/favici.png?v=logo-new',
    shortcut: '/favici.png?v=logo-new',
  },
  manifest: '/manifest.webmanifest',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <TooltipProvider>
            <EmailVerifyBanner />
            <main className="flex min-h-screen flex-col">{children}</main>
            <ChatbotWidget />
            <Toaster position="top-center" richColors />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}

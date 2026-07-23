import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { DirectionProvider } from "@/components/global/direction-provider";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

import "./globals.css";

const IranYekan = localFont({
  src: [
    {
      path: "../assets/fonts/IRANYekanLight.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/IRANYekanRegular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/IRANYekanMedium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/iranyekanwebbold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/IRANYekanExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-iran-yekan",
  display: "swap",
  preload: true,
  fallback: ["Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  title: {
    default: siteConfig.title,
    template: "%s | Mahdi Rashidi",
  },
  description: siteConfig.description,
  applicationName: "Mahdi Rashidi Portfolio",
  authors: [
    {
      name: siteConfig.name,
      url: siteConfig.githubUrl,
    },
  ],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  keywords: [
    "Mahdi Rashidi",
    "full-stack developer",
    "Next.js developer",
    "React developer",
    "TypeScript developer",
    "web application development",
    "accessible web development",
    "SEO-focused development",
  ],
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  icons: {
    icon: "/logo/logo.jpg",
    apple: "/logo/logo.jpg",
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Mahdi Rashidi",
    title: siteConfig.title,
    description: siteConfig.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.shortDescription,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0b0b0c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={cn("tw:h-full", "tw:scroll-smooth", "tw:antialiased", IranYekan.variable)}
    >
      <body suppressHydrationWarning className="tw:flex tw:min-h-full tw:flex-col">
        <DirectionProvider direction="ltr">{children}</DirectionProvider>
      </body>
    </html>
  );
}

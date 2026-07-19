import type { Metadata } from "next";
import localFont from "next/font/local";

import { DirectionProvider } from "@/components/global/direction-provider";
import { cn } from "@/lib/utils";

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
  title: "Mahdi Rashidi | Portfolio",
  description: "Mahdi Rashidi's personal developer portfolio.",
  icons: {
    icon: "/logo/logo.jpg",
  },
  openGraph: {
    title: "Mahdi Rashidi | Portfolio",
    description: "Mahdi Rashidi's personal developer portfolio.",
    images: [
      {
        url: "/images/mahdi-rashidi.webp",
        width: 1537,
        height: 1920,
        alt: "Mahdi Rashidi",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={cn("tw:h-full", "tw:antialiased", IranYekan.variable)}>
      <body className="tw:flex tw:min-h-full tw:flex-col">
        <DirectionProvider>{children}</DirectionProvider>
      </body>
    </html>
  );
}

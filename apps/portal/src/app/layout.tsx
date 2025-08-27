import { Inter } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/providers";
import { Metadata } from "next";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Inter({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Unfaa Store",
  description:
    "Comprehensive e-commerce business solutions providing seamless online store management, inventory tracking, payment processing, and customer engagement tools for modern businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

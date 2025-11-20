import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/contexts/WalletContext";
import { ToastProvider } from "@/components/common/Toast";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Axiom Command Center",
  description: "High-Fidelity Dark Mode Glassmorphism Dashboard for AI Agent Monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} ${spaceGrotesk.variable} antialiased bg-axiom-dark text-white`}
      >
        <ToastProvider>
          <WalletContextProvider>
            {children}
          </WalletContextProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
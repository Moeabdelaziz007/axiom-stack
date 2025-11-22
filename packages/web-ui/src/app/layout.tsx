import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import "../styles/cyberpunk-theme.css";
import { WalletContextProvider } from "@/contexts/WalletContext";
import { ToastProvider } from "@/components/common/Toast";
import CommandSidebar from "@/components/layout/CommandSidebar";

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

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Axiom Command Center - Quantum AI Platform",
  description: "Design, Deploy, and Manage AI Agents in the Quantum Command Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} ${spaceGrotesk.variable} ${orbitron.variable} ${rajdhani.variable} antialiased bg-dark-void text-white overflow-x-hidden font-rajdhani`}
      >
        {/* Holographic Gradient Mesh Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-dark-void" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(0, 255, 255, 0.15), transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(157, 78, 221, 0.1), transparent 50%),
                radial-gradient(circle at 40% 70%, rgba(79, 172, 254, 0.08), transparent 50%)
              `,
              animation: 'float 20s ease-in-out infinite'
            }}
          />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <ToastProvider>
          <WalletContextProvider>
            <div className="flex min-h-screen">
              {/* Command Sidebar */}
              <CommandSidebar />

              {/* Main Content Area */}
              <main className="flex-1 ml-64">
                {children}
              </main>
            </div>
          </WalletContextProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
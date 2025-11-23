import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import "../styles/cyberpunk-theme.css";
import { WalletContextProvider } from "@/contexts/WalletContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/components/common/Toast";
import CommandSidebar from "@/components/layout/CommandSidebar";
import QuantumBackground from "@/components/layout/QuantumBackground";

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
        {/* Background handled by QuantumBackground component */}

        <ToastProvider>
          <ThemeProvider>
            <WalletContextProvider>
              <SocketProvider>
                <div className="flex min-h-screen relative">
                  <QuantumBackground />

                  {/* Command Sidebar (Desktop) */}
                  <div className="hidden md:block fixed h-full z-20">
                    <CommandSidebar />
                  </div>

                  {/* Main Content Area */}
                  <main className="flex-1 md:ml-64 relative z-10 min-h-screen">
                    {children}
                  </main>
                </div>
              </SocketProvider>
            </WalletContextProvider>
          </ThemeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
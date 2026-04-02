import type { Metadata } from "next";
import { JetBrains_Mono, DM_Sans } from "next/font/google";
import Navbar from "@/components/Navbar"; // <-- 1. Import the Navbar!
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Fintastic Lab — Interactive Finance Simulations",
  description:
    "Interactive Fintastic Labs for commerce students. Understand the logic, not just the formulas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${mono.variable} ${sans.variable} font-sans bg-zinc-950 text-zinc-100 antialiased selection:bg-amber-500/20 selection:text-amber-200`}
      >
        {/* Film-grain noise — barely visible, adds texture */}
        <div
          className="pointer-events-none fixed inset-0 z-[60] opacity-[0.018]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* 2. Place the Navbar here so it appears on every page! */}
        <Navbar />

        {children}
      </body>
    </html>
  );
}
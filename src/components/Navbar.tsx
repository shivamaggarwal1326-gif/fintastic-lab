"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Labs" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  // Hide the main navbar inside module pages (they have their own back-bar)
  const insideModule = pathname.startsWith("/modules");
  if (insideModule) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-xl"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
        {/* ── Brand ─────────────────────────── */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center transition-colors group-hover:bg-amber-500/15">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-sm font-mono font-bold tracking-tight text-zinc-200">
            Fintastic Lab<span className="text-amber-500">.</span>
          </span>
        </Link>

        {/* ── Links ─────────────────────────── */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <motion.span
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative px-3.5 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                    active
                      ? "text-amber-400 bg-amber-500/8"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-[1px] bg-amber-500/60"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </motion.span>
              </Link>
            );
          })}

          {/* Status dot */}
          <div className="ml-3 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
            <span className="text-[10px] font-mono text-zinc-700 hidden sm:inline">
              Online
            </span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
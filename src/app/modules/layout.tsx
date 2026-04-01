"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Terminal } from "lucide-react";

export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ── Sticky Lab Bar ──────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-xl"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          {/* Back to hub */}
          <Link href="/dashboard">
            <motion.div
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Hub</span>
            </motion.div>
          </Link>

          {/* Center brand */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Terminal className="w-3 h-3 text-amber-400" />
            </div>
            <span className="text-xs font-mono font-bold text-zinc-400 tracking-tight hidden sm:inline">
              Finance Lab<span className="text-amber-500">.</span>
            </span>
          </div>

          {/* Right status */}
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.4)]" />
            <span className="text-[10px] font-mono text-zinc-600 hidden sm:inline">
              Lab Active
            </span>
          </div>
        </div>
      </motion.header>

      {/* ── Module content ──────────────────────────────── */}
      <main>{children}</main>
    </div>
  );
}

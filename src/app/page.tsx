"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Landmark, PieChart, Briefcase } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-5" style={{ fontFamily: "var(--font-mono, 'JetBrains Mono'), 'Fira Mono', monospace" }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center space-y-8">
        
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Fintastic Lab<span className="text-amber-500">.</span></h1>
          <p className="text-sm text-zinc-500">Interactive financial modules.</p>
        </div>

        <div className="grid gap-4">
          <Link href="/portfolio">
            <div className="group relative rounded-2xl border border-amber-500/25 bg-amber-500/5 p-6 text-left hover:bg-amber-500/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <PieChart className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">Portfolio Management</h2>
              </div>
              <p className="text-sm text-zinc-500 ml-14">CAPM, Efficient Frontier, Sharpe Ratio & more.</p>
            </div>
          </Link>

          <Link href="/fixed-income">
            <div className="group relative rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-6 text-left hover:bg-cyan-500/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Landmark className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors">Fixed Income</h2>
              </div>
              <p className="text-sm text-zinc-500 ml-14">Bond valuation, yields, and duration.</p>
            </div>
          </Link>

          {/* New Financial Management Hub Link */}
          <Link href="/financial-management">
            <div className="group relative rounded-2xl border border-indigo-500/25 bg-indigo-500/5 p-6 text-left hover:bg-indigo-500/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors">Financial Management</h2>
              </div>
              <p className="text-sm text-zinc-500 ml-14">Time Value of Money, Capital Budgeting, & more.</p>
            </div>
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
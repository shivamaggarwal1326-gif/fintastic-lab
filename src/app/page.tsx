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

{/* Statistics & Probability Card */}
        <Link 
          href="/statistics" 
          className="block group w-full max-w-2xl mx-auto rounded-2xl border border-rose-500/25 bg-rose-500/5 p-6 transition-all duration-300 hover:bg-rose-500/10 hover:shadow-[0_0_32px_-8px_rgba(244,63,94,0.15)]"
        >
          <div className="flex items-start gap-5">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner shadow-white/5 border border-rose-500/30 text-rose-400 bg-rose-500/10">
              {/* Bar Chart Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono text-zinc-100 mb-2 group-hover:text-rose-400 transition-colors">
                Statistics & Probability
              </h2>
              <p className="text-sm text-zinc-500 font-mono leading-relaxed">
                Central tendency, variance, distributions, and hypothesis testing.
              </p>
            </div>
          </div>
        </Link>
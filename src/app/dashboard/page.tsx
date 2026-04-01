"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Lock,
  TrendingUp,
  BarChart3,
  Calculator,
  Globe,
} from "lucide-react";
import Navbar from "@/components/Navbar";

/* ── Animation variants ──────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/* ── Module data ─────────────────────────────────────── */

interface Module {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  tags: string[];
  active: boolean;
}

const MODULES: Module[] = [
  {
    id: "fixed-income",
    title: "Bond Valuation",
    subtitle: "Fixed Income",
    description:
      "Lend ₹1,000 to your friend Rahul. Watch coupon, yield, and price dance on a seesaw. Then become the market.",
    icon: <TrendingUp className="w-5 h-5" />,
    href: "/modules/fixed-income",
    tags: ["Coupon Rate", "YTM", "Duration", "Convexity"],
    active: true,
  },
  {
    id: "portfolio",
    title: "Portfolio Management",
    subtitle: "Modern Portfolio Theory",
    description:
      "Build a portfolio. Drag the efficient frontier. Understand risk vs return — not as theory, but as physics.",
    icon: <BarChart3 className="w-5 h-5" />,
    href: "/modules/portfolio",
    tags: ["Markowitz", "Sharpe Ratio", "Efficient Frontier"],
    active: true,
  },
  {
    id: "quant",
    title: "Quantitative Methods",
    subtitle: "Statistical Foundations",
    description:
      "Probability distributions, hypothesis tests, and regression — visualised so the numbers make sense.",
    icon: <Calculator className="w-5 h-5" />,
    href: "#",
    tags: ["Distributions", "Regression", "Time Series"],
    active: false,
  },
  {
    id: "macro",
    title: "Macro Economics",
    subtitle: "The Big Picture",
    description:
      "GDP, inflation, fiscal policy — simulate an economy and watch how one lever moves everything else.",
    icon: <Globe className="w-5 h-5" />,
    href: "#",
    tags: ["GDP", "Inflation", "Monetary Policy"],
    active: false,
  },
];

/* ── Module Card ─────────────────────────────────────── */

function ModuleCard({ mod, index }: { mod: Module; index: number }) {
  const Wrapper = mod.active ? Link : "div";
  const wrapperProps = mod.active ? { href: mod.href } : {};

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      {/* @ts-ignore — conditional Link/div */}
      <Wrapper {...wrapperProps}>
        <motion.div
          whileHover={mod.active ? { y: -4, scale: 1.01 } : {}}
          whileTap={mod.active ? { scale: 0.99 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 ${
            mod.active
              ? "border-amber-500/25 bg-zinc-900/60 hover:border-amber-500/45 hover:shadow-[0_0_36px_-8px_rgba(245,158,11,0.15)] cursor-pointer"
              : "border-zinc-800/50 bg-zinc-900/25 cursor-not-allowed"
          }`}
        >
          {/* Top accent line */}
          {mod.active && (
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          )}

          <div className="p-6">
            {/* Header row */}
            <div className="flex items-start justify-between mb-5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  mod.active
                    ? "bg-amber-500/8 border border-amber-500/25 text-amber-400"
                    : "bg-zinc-800/40 border border-zinc-800/60 text-zinc-600"
                }`}
              >
                {mod.active ? mod.icon : <Lock className="w-4 h-4" />}
              </div>

              <span
                className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  mod.active
                    ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/8"
                    : "text-zinc-600 border-zinc-800 bg-zinc-800/30"
                }`}
              >
                {mod.active ? "Live" : "Coming Soon"}
              </span>
            </div>

            {/* Title */}
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">
              {mod.subtitle}
            </p>
            <h3
              className={`text-lg font-bold font-mono mb-2 ${
                mod.active ? "text-zinc-100" : "text-zinc-600"
              }`}
            >
              {mod.title}
            </h3>

            {/* Description */}
            <p
              className={`text-sm leading-relaxed mb-5 ${
                mod.active ? "text-zinc-500" : "text-zinc-700"
              }`}
            >
              {mod.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {mod.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                    mod.active
                      ? "bg-zinc-800/50 text-zinc-500 border-zinc-700/30"
                      : "bg-zinc-900/50 text-zinc-700 border-zinc-800/40"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            {mod.active ? (
              <div className="inline-flex items-center gap-2 text-sm font-mono font-semibold text-amber-400 group-hover:gap-3 transition-all">
                <span>Launch Lab</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 text-sm font-mono text-zinc-700">
                <Lock className="w-3.5 h-3.5" />
                <span>Locked</span>
              </div>
            )}
          </div>
        </motion.div>
      </Wrapper>
    </motion.div>
  );
}

/* ── Page ─────────────────────────────────────────────── */

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Background texture */}
      <div className="fixed inset-0 dot-grid opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pt-28 pb-20">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] w-8 bg-amber-500/40" />
            <span className="text-[10px] font-mono text-amber-500/70 uppercase tracking-widest">
              Lab Hub
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
            Choose your simulation
          </h1>
          <p className="text-sm text-zinc-600 mt-2 font-mono">
            Each module is a self-contained lab. No slides. No PDFs. Just live
            math.
          </p>
        </motion.div>

        {/* Module grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {MODULES.map((mod, i) => (
            <ModuleCard key={mod.id} mod={mod} index={i} />
          ))}
        </div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-[10px] font-mono text-zinc-800 mt-14"
        >
          Finance Lab · financelab.in
        </motion.p>
      </div>
    </div>
  );
}

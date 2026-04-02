"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Terminal, Briefcase, Landmark, PieChart, ArrowRight, Sparkles, BookOpen, Activity } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// ELEGANT FLOATING BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════

function ElegantBackground() {
  const elements = useMemo(() => {
    const symbols = ["₹", "WACC", "NPV", "α", "β", "YTM", "Dur", "DCF", "σ²", "CAPM", "1.15", "OAS"];
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      text: symbols[Math.floor(Math.random() * symbols.length)],
      x: Math.random() * 100,
      scale: Math.random() * 0.6 + 0.4,
      duration: Math.random() * 25 + 25,
      delay: Math.random() * -30,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Deep Central Glows matching the 3 subjects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] opacity-30 mix-blend-screen" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] opacity-30 mix-blend-screen" />

      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute font-mono font-bold select-none text-zinc-500/10"
          initial={{ x: `${el.x}vw`, y: "110vh", scale: el.scale }}
          animate={{ y: "-10vh", rotate: [0, 15, -15, 0] }}
          transition={{ y: { duration: el.duration, repeat: Infinity, ease: "linear", delay: el.delay }, rotate: { duration: el.duration * 0.8, repeat: Infinity, ease: "easeInOut" } }}
          style={{ fontSize: `${el.scale * 3.5}rem`, filter: `blur(${el.scale > 0.8 ? 0 : 3}px)` }}
        >
          {el.text}
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE DATA
// ═══════════════════════════════════════════════════════════════════════════

const MODULES = [
  {
    id: "pm",
    title: "Portfolio Management",
    tag: "Most Popular",
    stats: "14 Topics · 5 Labs",
    description: "Build the efficient frontier. Understand CAPM, Sharpe ratios, active vs passive management, and behavioral finance.",
    icon: <PieChart className="w-8 h-8" />,
    link: "/portfolio",
    colors: { 
      text: "text-amber-400", 
      bg: "bg-amber-500/10", 
      border: "border-amber-500/30", 
      glow: "group-hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.4)]",
      gradient: "from-amber-500/5 via-transparent to-transparent",
      iconGlow: "group-hover:shadow-[0_0_20px_0_rgba(245,158,11,0.4)]"
    }
  },
  {
    id: "fi",
    title: "Fixed Income",
    tag: "Advanced",
    stats: "9 Topics · 1 Lab",
    description: "Navigate the debt markets. Calculate yield to maturity, duration, convexity, and analyze complex embedded options.",
    icon: <Landmark className="w-8 h-8" />,
    link: "/fixed-income",
    colors: { 
      text: "text-cyan-400", 
      bg: "bg-cyan-500/10", 
      border: "border-cyan-500/30", 
      glow: "group-hover:shadow-[0_0_60px_-15px_rgba(6,182,212,0.4)]",
      gradient: "from-cyan-500/5 via-transparent to-transparent",
      iconGlow: "group-hover:shadow-[0_0_20px_0_rgba(6,182,212,0.4)]"
    }
  },
  {
    id: "fm",
    title: "Financial Management",
    tag: "Core Foundation",
    stats: "9 Topics · 2 Labs",
    description: "Master the core of corporate finance. Learn capital budgeting, risk-return trade-offs, and the time value of money.",
    icon: <Briefcase className="w-8 h-8" />,
    link: "/financial-management", // Note: Ensure this matches your actual routing path
    colors: { 
      text: "text-indigo-400", 
      bg: "bg-indigo-500/10", 
      border: "border-indigo-500/30", 
      glow: "group-hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.4)]",
      gradient: "from-indigo-500/5 via-transparent to-transparent",
      iconGlow: "group-hover:shadow-[0_0_20px_0_rgba(99,102,241,0.4)]"
    }
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden flex flex-col items-center py-20 px-5" style={{ fontFamily: "var(--font-mono, 'JetBrains Mono'), 'Fira Mono', monospace" }}>
      <ElegantBackground />

      <div className="relative z-10 max-w-6xl w-full mt-10">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl mb-2 relative group">
            <div className="absolute inset-0 bg-amber-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Terminal className="w-8 h-8 text-amber-400 relative z-10" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            Fintastic Lab<span className="text-amber-500">.</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Interactive financial simulations and deep-dive academic theory. 
            Bridge the gap between textbook formulas and real-world mechanics.
          </p>
        </motion.div>

        {/* Modules Grid */}
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="grid lg:grid-cols-3 gap-6 md:gap-8"
        >
          {MODULES.map((mod) => (
            <motion.div key={mod.id} variants={itemVariants}>
              <Link href={mod.link} className="block h-full outline-none">
                <div className={`group relative h-full rounded-[2rem] border border-zinc-800 overflow-hidden transition-all duration-500 bg-zinc-900/40 backdrop-blur-xl hover:border-zinc-600 hover:-translate-y-2 ${mod.colors.glow}`}>
                  
                  {/* Internal Gradient Glow on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${mod.colors.gradient}`} />
                  
                  <div className="p-8 flex flex-col h-full relative z-10">
                    
                    {/* Top Row: Icon & Tag */}
                    <div className="flex items-start justify-between mb-8">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-zinc-800 bg-zinc-950 transition-all duration-500 ${mod.colors.text} ${mod.colors.iconGlow}`}>
                        {mod.icon}
                      </div>
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border border-zinc-800 bg-zinc-950/50 ${mod.colors.text}`}>
                        {mod.tag}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-3 text-zinc-100 group-hover:text-white transition-colors">
                      {mod.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 mb-4 text-xs font-mono text-zinc-500">
                      <div className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Theory</div>
                      <div className="w-1 h-1 rounded-full bg-zinc-700" />
                      <div className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Interactive</div>
                    </div>

                    <p className="text-sm text-zinc-400 leading-relaxed flex-1 mb-8 group-hover:text-zinc-300 transition-colors">
                      {mod.description}
                    </p>

                    {/* Footer: Stats & Arrow */}
                    <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
                      <span className="text-xs font-mono text-zinc-500">
                        {mod.stats}
                      </span>
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 group-hover:border-current transition-colors ${mod.colors.text}`}>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
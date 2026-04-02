"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle, Search, 
  Briefcase, Target, Scale, Users, Clock, 
  BarChart, Building2, BookOpen, HelpCircle, 
  Lightbulb, Layers, GraduationCap, Activity, TrendingUp, Compass
} from "lucide-react";
import {
  LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell
} from "recharts";

// ═══════════════════════════════════════════════════════════════════════════
// ELEGANT FLOATING BACKGROUND (NEW)
// ═══════════════════════════════════════════════════════════════════════════

function ElegantBackground() {
  // Generate random floating financial elements with varying depths and speeds
  const elements = useMemo(() => {
    const symbols = ["₹", "$", "%", "8.5%", "1.15", "WACC", "NPV", "IRR", "ROI", "0.00", "▲", "▼", "10k", "DCF"];
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      text: symbols[Math.floor(Math.random() * symbols.length)],
      x: Math.random() * 100, // starting X position (vw)
      scale: Math.random() * 0.6 + 0.4, // size variation
      duration: Math.random() * 25 + 25, // speed
      delay: Math.random() * -30, // staggered starts
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Premium Vercel-style Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Deep Central Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] opacity-50 mix-blend-screen" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] opacity-30 mix-blend-screen" />

      {/* Floating Numbers & Symbols */}
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute font-mono font-bold select-none text-zinc-500/10"
          initial={{ x: `${el.x}vw`, y: "110vh", scale: el.scale }}
          animate={{ y: "-10vh", rotate: [0, 15, -15, 0] }}
          transition={{
            y: { duration: el.duration, repeat: Infinity, ease: "linear", delay: el.delay },
            rotate: { duration: el.duration * 0.8, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ 
            fontSize: `${el.scale * 3.5}rem`, 
            filter: `blur(${el.scale > 0.8 ? 0 : 3}px)` // Creates depth of field
          }}
        >
          {el.text}
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// THEMES & STYLES
// ═══════════════════════════════════════════════════════════════════════════

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.22 } },
};

const slideRight = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
};

const getAccent = (color: string) => {
  const map: any = {
    indigo: { text: "text-indigo-400", bgLight: "bg-indigo-500/10", bgGhost: "bg-indigo-500/5", border: "border-indigo-500/25", via: "via-indigo-500/40", accent: "accent-indigo-500", glow: "hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)]" },
    fuchsia: { text: "text-fuchsia-400", bgLight: "bg-fuchsia-500/10", bgGhost: "bg-fuchsia-500/5", border: "border-fuchsia-500/25", via: "via-fuchsia-500/40", accent: "accent-fuchsia-500", glow: "hover:shadow-[0_0_40px_-10px_rgba(217,70,239,0.2)]" },
    violet: { text: "text-violet-400", bgLight: "bg-violet-500/10", bgGhost: "bg-violet-500/5", border: "border-violet-500/25", via: "via-violet-500/40", accent: "accent-violet-500", glow: "hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.2)]" },
    emerald: { text: "text-emerald-400", bgLight: "bg-emerald-500/10", bgGhost: "bg-emerald-500/5", border: "border-emerald-500/25", via: "via-emerald-500/40", accent: "accent-emerald-500", glow: "hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)]" },
    rose: { text: "text-rose-400", bgLight: "bg-rose-500/10", bgGhost: "bg-rose-500/5", border: "border-rose-500/25", via: "via-rose-500/40", accent: "accent-rose-500", glow: "hover:shadow-[0_0_40px_-10px_rgba(244,63,94,0.2)]" },
    sky: { text: "text-sky-400", bgLight: "bg-sky-500/10", bgGhost: "bg-sky-500/5", border: "border-sky-500/25", via: "via-sky-500/40", accent: "accent-sky-500", glow: "hover:shadow-[0_0_40px_-10px_rgba(14,165,233,0.2)]" },
    teal: { text: "text-teal-400", bgLight: "bg-teal-500/10", bgGhost: "bg-teal-500/5", border: "border-teal-500/25", via: "via-teal-500/40", accent: "accent-teal-500", glow: "hover:shadow-[0_0_40px_-10px_rgba(20,184,166,0.2)]" },
    orange: { text: "text-orange-400", bgLight: "bg-orange-500/10", bgGhost: "bg-orange-500/5", border: "border-orange-500/25", via: "via-orange-500/40", accent: "accent-orange-500", glow: "hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.2)]" }
  };
  return map[color] || map.indigo;
};

// ═══════════════════════════════════════════════════════════════════════════
// ANALOGY VISUALIZATIONS (FRAMER MOTION)
// ═══════════════════════════════════════════════════════════════════════════

const AnalogyVisuals = {
  // Intro FM: Heart Pumping Blood
  IntroHeart: ({ color }: { color: string }) => {
    const c = getAccent(color);
    return (
      <div className="relative w-24 h-24">
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className={`absolute inset-0 rounded-full ${c.bgLight} blur-xl`} />
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="flex items-center justify-center h-full relative z-10">
          <Activity className={`w-12 h-12 ${c.text}`} />
        </motion.div>
        {[0, 90, 180, 270].map((angle) => (
          <motion.div key={angle} animate={{ x: [0, Math.cos(angle * Math.PI / 180) * 45], y: [0, Math.sin(angle * Math.PI / 180) * 45], opacity: [1, 0], scale: [1, 0.5] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }} className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${c.bgLight} border ${c.border}`} style={{ marginTop: '-4px', marginLeft: '-4px' }} />
        ))}
      </div>
    );
  },

  // Goals of FM: Sprint vs Marathon
  GoalsMarathon: ({ color }: { color: string }) => {
    const c = getAccent(color);
    return (
      <div className="relative w-32 h-20 border-b border-l border-zinc-700 flex items-end">
        <motion.div animate={{ height: ["0%", "90%", "30%", "30%"] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="w-4 bg-zinc-600 rounded-t-sm mx-2" />
        <motion.div animate={{ height: ["0%", "30%", "60%", "100%"] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className={`w-4 ${c.bgLight} border ${c.border} rounded-t-sm mx-2`} />
        <div className={`absolute top-2 right-2 text-[10px] font-mono ${c.text}`}>Wealth</div>
        <div className="absolute top-2 left-6 text-[10px] font-mono text-zinc-500">Profit</div>
      </div>
    );
  },

  // Risk-Return: Rollercoaster
  RiskRollercoaster: ({ color }: { color: string }) => {
    const c = getAccent(color);
    return (
      <div className="relative w-32 h-20 flex items-center justify-center">
        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
          <motion.path d="M 0 25 Q 20 0, 40 25 T 80 25 T 100 -10" fill="transparent" stroke="currentColor" strokeWidth="2" className="text-zinc-700" />
          <motion.circle r="4" className={c.text} fill="currentColor"
            animate={{ offsetDistance: ["0%", "100%"] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            style={{ offsetPath: "path('M 0 25 Q 20 0, 40 25 T 80 25 T 100 -10')" }}
          />
        </svg>
      </div>
    );
  },

  // Agency Problem: Two conflicting targets
  AgencyArrows: ({ color }: { color: string }) => {
    const c = getAccent(color);
    return (
      <div className="relative w-32 h-24 flex items-center justify-between px-2">
        <div className="flex flex-col items-center gap-2">
          <Users className="w-6 h-6 text-zinc-500" />
          <span className="text-[8px] font-mono text-zinc-500">Principal</span>
        </div>
        <div className="relative flex-1 h-full flex items-center justify-center">
          <motion.div animate={{ width: ["0%", "100%", "0%"], x: ["-50%", "0%", "50%"] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className={`h-0.5 ${c.bgLight} absolute`} />
          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }} className={`z-10 ${c.text}`}><ArrowRight className="w-5 h-5" /></motion.div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Briefcase className={`w-6 h-6 ${c.text}`} />
          <span className={`text-[8px] font-mono ${c.text}`}>Agent</span>
        </div>
      </div>
    );
  },

  // Emerging Roles: Radar / Navigator
  NavigatorRadar: ({ color }: { color: string }) => {
    const c = getAccent(color);
    return (
      <div className={`relative w-20 h-20 rounded-full border-2 border-zinc-800 ${c.bgGhost} overflow-hidden flex items-center justify-center`}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute inset-0 origin-center" style={{ background: `conic-gradient(from 0deg, transparent 70%, ${c.glow.match(/rgba\([^)]+\)/)?.[0].replace(',0)', ',0.4)') || 'rgba(255,255,255,0.2)'} 100%)` }} />
        <Compass className={`w-6 h-6 ${c.text} relative z-10`} />
      </div>
    );
  },

  // TVM: Growing Seed
  TVMSeed: ({ color }: { color: string }) => {
    const c = getAccent(color);
    return (
      <div className="relative w-24 h-24 flex items-end justify-center pb-4">
        <motion.div initial={{ height: "10%" }} animate={{ height: ["10%", "80%", "10%"] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className={`w-6 ${c.bgLight} border border-b-0 ${c.border} rounded-t-md relative flex justify-center`}>
          <motion.div animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8], y: [-10, -20, -10] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className={`absolute -top-6 ${c.text}`}>
            <TrendingUp className="w-5 h-5" />
          </motion.div>
        </motion.div>
        <div className="absolute bottom-3 w-16 h-1 bg-zinc-700 rounded-full" />
      </div>
    );
  },

  // Cap Budgeting Process: Blueprint to House
  CapBudgetHouse: ({ color }: { color: string }) => {
    const c = getAccent(color);
    return (
      <div className="relative w-24 h-24 flex items-center justify-center">
        <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="absolute">
          <Layers className="w-12 h-12 text-zinc-700" />
        </motion.div>
        <motion.div animate={{ opacity: [0, 1, 0], scale: [0.9, 1.1, 0.9] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="absolute">
          <Building2 className={`w-12 h-12 ${c.text}`} />
        </motion.div>
      </div>
    );
  },

  // Cap Budgeting Tech: Scales
  NPVScales: ({ color }: { color: string }) => {
    const c = getAccent(color);
    return (
      <div className="relative w-24 h-24 flex items-center justify-center">
        <motion.div animate={{ rotate: [-10, 15, -10] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="origin-bottom w-full h-full flex flex-col items-center justify-end pb-4">
          <div className="w-16 h-1 bg-zinc-600 rounded-full relative">
            <div className={`absolute -left-2 -top-6 w-5 h-5 ${c.bgLight} border ${c.border} rounded-full flex items-center justify-center`}><span className={`text-[8px] ${c.text}`}>₹</span></div>
            <div className="absolute -right-2 -top-4 w-5 h-5 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center"><span className="text-[8px] text-zinc-500">t</span></div>
          </div>
          <div className="w-1 h-12 bg-zinc-700 rounded-t-sm" />
          <div className="w-8 h-1 bg-zinc-600 rounded-full" />
        </motion.div>
      </div>
    );
  },

  // Capital Structure: The Smoothie
  SmoothieMix: ({ color }: { color: string }) => {
    const c = getAccent(color);
    return (
      <div className="w-16 h-20 border-2 border-zinc-700 rounded-b-xl rounded-t-sm relative overflow-hidden bg-zinc-950 flex flex-col justify-end">
        <motion.div animate={{ height: ["40%", "60%", "40%"] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className={`w-full ${c.bgLight} border-t ${c.border} flex items-center justify-center overflow-hidden`}>
          <span className={`text-[8px] font-mono font-bold ${c.text}`}>DEBT</span>
        </motion.div>
        <motion.div animate={{ height: ["60%", "40%", "60%"] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="w-full bg-zinc-800/50 border-t border-zinc-700 flex items-center justify-center overflow-hidden">
          <span className="text-[8px] font-mono font-bold text-zinc-400">EQUITY</span>
        </motion.div>
      </div>
    );
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

type DepthLevel = "beginner" | "intermediate" | "advanced";

function DepthExplanation({ beginner, intermediate, advanced, analogy, visual, color = "indigo" }: any) {
  const [depth, setDepth] = useState<DepthLevel>("beginner");
  const c = getAccent(color);

  return (
    <div className="space-y-6">
      {analogy && (
        <motion.div variants={fadeUp} className={`${c.bgLight} ${c.border} border rounded-2xl p-0 overflow-hidden flex flex-col md:flex-row items-stretch`}>
          {/* Visual Section */}
          {visual && (
            <div className={`w-full md:w-1/3 min-h-[160px] ${c.bgGhost} border-b md:border-b-0 md:border-r ${c.border} flex items-center justify-center p-6 relative overflow-hidden`}>
               <div className="relative z-10 w-full h-full flex items-center justify-center">
                  {visual}
               </div>
               <div className={`absolute inset-0 opacity-20 bg-gradient-to-br from-transparent ${c.via} to-transparent`} />
            </div>
          )}

          {/* Text Section */}
          <div className="flex-1 p-6 flex gap-4 items-start">
            <div className={`w-10 h-10 rounded-full ${c.bgLight} flex items-center justify-center shrink-0`}>
              <Lightbulb className={`w-5 h-5 ${c.text}`} />
            </div>
            <div>
              <h3 className={`text-sm font-bold font-mono ${c.text} mb-2`}>Concept Analogy</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">{analogy}</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-5 relative z-10 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <h2 className="text-lg font-bold font-mono text-zinc-100">Academic Theory</h2>
          
          {/* Elegant Depth Tabs */}
          <div className="flex gap-2">
            {(["beginner", "intermediate", "advanced"] as DepthLevel[]).map((level) => (
              <button key={level} onClick={() => setDepth(level)}
                className={`relative px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  depth === level ? c.text : "text-zinc-500 hover:text-zinc-300"
                }`}>
                {depth === level && (
                  <motion.div layoutId="depthIndicator" className={`absolute inset-0 rounded-lg ${c.bgLight} border ${c.border}`} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                <span className="relative z-10">{level}</span>
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={depth} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
            className="text-sm text-zinc-400 leading-relaxed min-h-[80px] space-y-3">
            {depth === "beginner" && beginner}
            {depth === "intermediate" && intermediate}
            {depth === "advanced" && advanced}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function SliderInput({ label, hint, min, max, step, value, onChange, accent = "indigo", suffix = "", prefix = "" }: any) {
  const c = getAccent(accent);
  return (
    <motion.div variants={slideRight} className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <label className="text-xs font-mono text-zinc-400">{label}</label>
        <span className={`text-sm font-bold font-mono ${c.text}`}>{prefix}{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer ${c.accent}`} />
      {hint && <p className="text-[10px] text-zinc-600 mt-0.5">{hint}</p>}
    </motion.div>
  );
}

function StatCard({ label, value, sub, accent = "zinc", glow = false }: any) {
  const colors: Record<string, string> = { indigo: "text-indigo-400", violet: "text-violet-400", fuchsia: "text-fuchsia-400", emerald: "text-emerald-400", rose: "text-rose-400", zinc: "text-zinc-200", teal: "text-teal-400", sky: "text-sky-400", orange: "text-orange-400" };
  const borderColor = glow && accent !== "zinc" ? getAccent(accent).border : "border-zinc-800";
  
  return (
    <motion.div layout variants={fadeUp}
      className={`bg-zinc-900/60 border rounded-xl p-3 transition-all duration-500 ${borderColor} ${glow ? getAccent(accent).glow : ''}`}>
      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
      <motion.p key={value} initial={{ opacity: 0.5, y: -3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
        className={`text-lg font-bold font-mono ${colors[accent] ?? colors.zinc}`}>{value}</motion.p>
      {sub && <p className="text-[10px] text-zinc-600 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function QuestionsTab({ questions, color }: { questions: { q: string; a: string }[], color: string }) {
  const c = getAccent(color);
  return (
    <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <HelpCircle className={`w-6 h-6 ${c.text}`} />
        <h2 className="text-lg font-bold font-mono text-zinc-100">Short Answer Practice</h2>
      </div>
      <div className="space-y-4">
        {questions.map((item, idx) => (
          <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
            <p className="text-sm font-bold text-zinc-200 mb-3">Q: {item.q}</p>
            <div className={`pl-4 border-l-2 ${c.border}`}>
              <p className="text-sm text-zinc-400 leading-relaxed"><strong>Ans:</strong> {item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 25-QUESTION UNIT QUIZ ENGINE
// ═══════════════════════════════════════════════════════════════════════════

function UnitQuiz({ unit, questions, onBack }: { unit: number, questions: any[], onBack: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);

  const handleSelect = (qIndex: number, optIndex: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct) score++; });
    return score;
  };

  if (isSubmitted) {
    const score = calculateScore();
    const pass = score >= 15; // 60% to pass
    return (
      <div className="max-w-4xl mx-auto space-y-8 relative z-10 pb-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="px-3 py-1.5 text-xs font-mono text-zinc-500 border border-zinc-800 rounded-lg bg-zinc-950 hover:text-zinc-200 transition-colors">Return to Hub</button>
          <h1 className="text-2xl font-bold font-mono">Unit {unit} Final Exam Results</h1>
        </div>

        <div className={`bg-zinc-900/80 border ${pass ? 'border-emerald-500/30' : 'border-rose-500/30'} rounded-2xl p-8 text-center space-y-4`}>
          <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Final Score</p>
          <div className={`text-6xl font-bold font-mono ${pass ? 'text-emerald-400' : 'text-rose-400'}`}>
            {score} / 25
          </div>
          <p className="text-zinc-400">{pass ? "Excellent work! You have a solid grasp of this unit." : "You might want to review the core concepts again."}</p>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold font-mono border-b border-zinc-800 pb-2">Detailed Breakdown</h3>
          {questions.map((q, i) => {
            const userAns = answers[i];
            const isCorrect = userAns === q.correct;
            const notAnswered = userAns === undefined;
            return (
              <div key={i} className={`bg-zinc-900/60 border ${isCorrect ? 'border-emerald-500/20' : 'border-rose-500/20'} rounded-xl p-6 space-y-4`}>
                <div className="flex gap-3">
                  <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                  <p className="text-sm font-bold text-zinc-200 leading-relaxed">{i + 1}. {q.q}</p>
                </div>
                
                <div className="pl-9 space-y-3">
                  <div className="text-sm text-zinc-400">
                    <span className="font-bold text-zinc-500 mr-2">Your Answer:</span> 
                    <span className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{notAnswered ? "Skipped" : q.options[userAns]}</span>
                  </div>
                  {!isCorrect && (
                    <div className="text-sm text-zinc-400">
                      <span className="font-bold text-zinc-500 mr-2">Correct Answer:</span> 
                      <span className="text-emerald-400">{q.options[q.correct]}</span>
                    </div>
                  )}
                  <div className="mt-4 p-4 bg-zinc-950 rounded-lg border border-zinc-800/50">
                    <p className="text-xs font-bold text-indigo-400 mb-1 uppercase tracking-widest">Why?</p>
                    <p className="text-sm text-zinc-400 leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  const progress = (Object.keys(answers).length / 25) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative z-10">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="px-3 py-1.5 text-xs font-mono text-zinc-500 border border-zinc-800 rounded-lg bg-zinc-950 hover:text-zinc-200 transition-colors">Exit Quiz</button>
        <span className="text-sm font-mono text-zinc-400">Question {currentQ + 1} of 25</span>
      </div>

      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
        <motion.div className="h-full bg-indigo-500" animate={{ width: `${progress}%` }} />
      </div>

      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 min-h-[400px] flex flex-col">
        <h2 className="text-xl font-bold text-zinc-100 mb-8 leading-relaxed">{currentQ + 1}. {q.q}</h2>
        
        <div className="space-y-3 flex-1">
          {q.options.map((opt: string, idx: number) => {
            const isSelected = answers[currentQ] === idx;
            return (
              <div key={idx} role="button" onClick={() => handleSelect(currentQ, idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all text-sm cursor-pointer ${
                  isSelected ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-indigo-500' : 'border-zinc-700'}`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                  </div>
                  {opt}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-zinc-800">
          <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} className="px-4 py-2 text-sm font-mono text-zinc-500 disabled:opacity-30 hover:text-zinc-300 transition-colors">Previous</button>
          {currentQ === 24 ? (
            <button onClick={() => setIsSubmitted(true)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-colors">Submit Exam</button>
          ) : (
            <button onClick={() => setCurrentQ(Math.min(24, currentQ + 1))} className="px-6 py-2 bg-zinc-800 text-zinc-200 rounded-lg text-sm font-bold hover:bg-zinc-700 transition-colors">Next</button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        {questions.map((_, i) => (
          <button key={i} onClick={() => setCurrentQ(i)}
            className={`w-6 h-6 rounded text-[10px] font-mono flex items-center justify-center transition-colors ${
              currentQ === i ? 'bg-zinc-200 text-zinc-900 font-bold' : answers[i] !== undefined ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-zinc-950 border border-zinc-800 text-zinc-600 hover:bg-zinc-800'
            }`}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB TYPE
// ═══════════════════════════════════════════════════════════════════════════

type TabId = "theory" | "math" | "lab" | "questions";

// ═══════════════════════════════════════════════════════════════════════════
// TIME VALUE OF MONEY INTERACTIVE LAB
// ═══════════════════════════════════════════════════════════════════════════

function TimeValueMoneyLab({ onBack }: { onBack: () => void }) {
  const [pv, setPv] = useState(10000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(10);
  const [mode, setMode] = useState<"fv" | "annuity">("fv");

  const data = useMemo(() => {
    return Array.from({ length: years }, (_, i) => {
      const yr = i + 1;
      const fv = mode === "fv"
        ? Math.round(pv * Math.pow(1 + rate / 100, yr))
        : Math.round(pv * ((Math.pow(1 + rate / 100, yr) - 1) / (rate / 100)));
      return { year: `Y${yr}`, value: fv };
    });
  }, [pv, rate, years, mode]);

  const finalValue = data[data.length - 1]?.value ?? 0;
  const gain = finalValue - (mode === "fv" ? pv : pv * years);
  const c = getAccent("teal");

  const content = TOPIC_CONTENT["tvm"];

  return (
    <TopicDashboard
      title="Time Value of Money"
      tag="Unit 1 · Compounding Mechanics"
      color="teal"
      onBack={onBack}
      questions={content.questions}
      theoryContent={
        <DepthExplanation
          analogy={content.theory.analogy}
          visual={content.theory.visual}
          beginner={content.theory.beginner}
          intermediate={content.theory.intermediate}
          advanced={content.theory.advanced}
          color="teal"
        />
      }
      mathContent={content.math}
      labContent={
        <motion.div variants={fadeUp} className="space-y-6 mt-2">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold font-mono text-zinc-100">TVM Interactive Simulator</h2>
              <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                {(["fv", "annuity"] as const).map((m) => (
                  <button key={m} onClick={() => setMode(m)}
                    className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-md transition-colors ${mode === m ? `${c.bgLight} ${c.text} font-bold` : "text-zinc-500 hover:text-zinc-300"}`}>
                    {m === "fv" ? "Future Value" : "Annuity FV"}
                  </button>
                ))}
              </div>
            </div>

            <motion.div variants={{ visible: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="visible" className="space-y-4">
              <SliderInput label={mode === "fv" ? "Present Value (₹)" : "Annual Payment (₹)"} min={1000} max={100000} step={1000} value={pv} onChange={setPv} accent="teal" prefix="₹" hint="The initial lump sum or periodic payment" />
              <SliderInput label="Annual Interest Rate (%)" min={1} max={30} step={0.5} value={rate} onChange={setRate} accent="teal" suffix="%" hint="The rate of return per year" />
              <SliderInput label="Number of Years" min={1} max={30} step={1} value={years} onChange={setYears} accent="teal" suffix=" yrs" hint="Investment horizon" />
            </motion.div>

            <div className="grid grid-cols-3 gap-3">
              <StatCard label={mode === "fv" ? "Present Value" : "Annual PMT"} value={`₹${pv.toLocaleString("en-IN")}`} accent="zinc" />
              <StatCard label="Future Value" value={`₹${finalValue.toLocaleString("en-IN")}`} accent="teal" glow />
              <StatCard label="Total Gain" value={`₹${gain.toLocaleString("en-IN")}`} accent="emerald" glow={gain > 0} sub={`+${(((finalValue - (mode === "fv" ? pv : pv * years)) / (mode === "fv" ? pv : pv * years)) * 100).toFixed(1)}% growth`} />
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="year" tick={{ fill: "#52525b", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fill: "#52525b", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} width={50} />
                  <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 12, fontFamily: "monospace", fontSize: 12 }} formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Value"]} labelStyle={{ color: "#a1a1aa" }} />
                  <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#14b8a6", stroke: "#09090b", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={`${c.bgLight} ${c.border} border rounded-xl p-4`}>
              <p className={`text-xs font-mono font-bold ${c.text} mb-1`}>Formula Applied</p>
              <p className="text-sm font-mono text-zinc-300">
                {mode === "fv"
                  ? `FV = ${pv.toLocaleString()} × (1 + ${(rate / 100).toFixed(2)})^${years} = ₹${finalValue.toLocaleString("en-IN")}`
                  : `FVA = ${pv.toLocaleString()} × [(1+${(rate / 100).toFixed(2)})^${years} − 1] / ${(rate / 100).toFixed(2)} = ₹${finalValue.toLocaleString("en-IN")}`}
              </p>
            </div>
          </div>
        </motion.div>
      }
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CAPITAL BUDGETING INTERACTIVE LAB
// ═══════════════════════════════════════════════════════════════════════════

function CapitalBudgetingLab({ onBack }: { onBack: () => void }) {
  const [outlay, setOutlay] = useState(100000);
  const [cashInflow, setCashInflow] = useState(25000);
  const [discountRate, setDiscountRate] = useState(10);
  const YEARS = 8;

  const { npv, pi, payback, barData } = useMemo(() => {
    let cumulative = -outlay;
    let paybackYr: number | null = null;
    const bd = [{ year: "Y0", cumNPV: -outlay, annualPV: 0 }];
    let totalPV = 0;
    for (let i = 1; i <= YEARS; i++) {
      const pv = cashInflow / Math.pow(1 + discountRate / 100, i);
      totalPV += pv;
      cumulative += pv;
      if (paybackYr === null && cumulative >= 0) paybackYr = i;
      bd.push({ year: `Y${i}`, cumNPV: Math.round(cumulative), annualPV: Math.round(pv) });
    }
    const npvVal = Math.round(totalPV - outlay);
    const piVal = totalPV / outlay;
    return { npv: npvVal, pi: piVal, payback: paybackYr ?? ">8", barData: bd };
  }, [outlay, cashInflow, discountRate]);

  const content = TOPIC_CONTENT["cap-budget-tech"];
  const isAccept = npv > 0;
  const c = getAccent("emerald");

  return (
    <TopicDashboard
      title="Evaluation Techniques"
      tag="Unit 2 · NPV, IRR & Payback"
      color="emerald"
      onBack={onBack}
      questions={content.questions}
      theoryContent={
        <DepthExplanation
          analogy={content.theory.analogy}
          visual={content.theory.visual}
          beginner={content.theory.beginner}
          intermediate={content.theory.intermediate}
          advanced={content.theory.advanced}
          color="emerald"
        />
      }
      mathContent={content.math}
      labContent={
        <motion.div variants={fadeUp} className="space-y-6 mt-2">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
            <div className="border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold font-mono text-zinc-100">Capital Budgeting Decision Engine</h2>
              <p className="text-xs text-zinc-500 mt-1 font-mono">Adjust parameters — NPV, PI, and Payback update in real-time</p>
            </div>

            <motion.div variants={{ visible: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="visible" className="space-y-4">
              <SliderInput label="Initial Outlay (₹)" min={10000} max={500000} step={5000} value={outlay} onChange={setOutlay} accent="emerald" prefix="₹" hint="Cost of the project on Day 0" />
              <SliderInput label="Annual Cash Inflow (₹)" min={5000} max={150000} step={2500} value={cashInflow} onChange={setCashInflow} accent="emerald" prefix="₹" hint="Expected cash earned each year" />
              <SliderInput label="Discount Rate (%)" min={1} max={25} step={0.5} value={discountRate} onChange={setDiscountRate} accent="emerald" suffix="%" hint="Your required rate of return (WACC)" />
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="NPV" value={`₹${Math.abs(npv).toLocaleString("en-IN")}${npv < 0 ? " ▼" : " ▲"}`} accent={isAccept ? "emerald" : "rose"} glow sub={isAccept ? "Accept — adds value" : "Reject — destroys value"} />
              <StatCard label="Profitability Index" value={pi.toFixed(3)} accent={pi >= 1 ? "emerald" : "rose"} glow={pi >= 1} sub={pi >= 1 ? "PI ≥ 1 → Accept" : "PI < 1 → Reject"} />
              <StatCard label="Payback Period" value={`${payback} yrs`} accent="orange" sub="Simple (No TVM)" />
              <StatCard label="Decision" value={isAccept ? "ACCEPT ✓" : "REJECT ✗"} accent={isAccept ? "emerald" : "rose"} glow />
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={barData.slice(1)} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="year" tick={{ fill: "#52525b", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fill: "#52525b", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} width={52} />
                  <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 12, fontFamily: "monospace", fontSize: 12 }} formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, ""]} labelStyle={{ color: "#a1a1aa" }} />
                  <ReferenceLine y={0} stroke="#52525b" strokeDasharray="4 4" />
                  <Bar dataKey="cumNPV" name="Cumulative NPV" radius={[4, 4, 0, 0]}>
                    {barData.slice(1).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cumNPV >= 0 ? "#10b981" : "#f43f5e"} opacity={0.8} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className={`${c.bgLight} ${c.border} border rounded-xl p-3`}>
                <p className={`${c.text} font-bold mb-1`}>NPV Rule</p>
                <p className="text-zinc-400">NPV {">"} 0 → Accept. The project generates more than the cost of capital.</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/25 rounded-xl p-3">
                <p className="text-orange-400 font-bold mb-1">PI Rule</p>
                <p className="text-zinc-400">PI {">"} 1 → Accept. Each ₹1 invested returns more than ₹1 in PV terms.</p>
              </div>
              <div className="bg-sky-500/10 border border-sky-500/25 rounded-xl p-3">
                <p className="text-sky-400 font-bold mb-1">Payback Rule</p>
                <p className="text-zinc-400">Simple payback ignores TVM. Use NPV for real decisions.</p>
              </div>
            </div>
          </div>
        </motion.div>
      }
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERIC INFO LAB (for all non-interactive topics)
// ═══════════════════════════════════════════════════════════════════════════

function GenericInfoLab({ id, onBack }: { id: string; onBack: () => void }) {
  const topic = TOPICS.find(t => t.id === id);
  const content = TOPIC_CONTENT[id as keyof typeof TOPIC_CONTENT];
  if (!topic || !content) return null;

  return (
    <TopicDashboard
      title={topic.title}
      tag={`Unit ${topic.unit} · ${topic.subtitle}`}
      color={topic.accent}
      onBack={onBack}
      questions={content.questions}
      mathContent={content.math ?? null}
      theoryContent={
        <DepthExplanation
          analogy={content.theory.analogy}
          visual={content.theory.visual}
          beginner={content.theory.beginner}
          intermediate={content.theory.intermediate}
          advanced={content.theory.advanced}
          color={topic.accent}
        />
      }
      labContent={null}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TOPIC DASHBOARD UI WRAPPER
// ═══════════════════════════════════════════════════════════════════════════

function TopicDashboard({ title, tag, color, onBack, theoryContent, labContent, mathContent, questions }: any) {
  const [activeTab, setActiveTab] = useState<TabId>("theory");
  const c = getAccent(color);

  const tabs = [
    { id: "theory", label: "Concept & Theory", available: !!theoryContent },
    { id: "math", label: "Numerical Examples", available: !!mathContent },
    { id: "lab", label: "Interactive Lab", available: !!labContent },
    { id: "questions", label: "Exam Prep", available: !!questions && questions.length > 0 },
  ].filter(t => t.available);

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative z-10 pb-20">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col mb-8 gap-6">
        <div className="flex items-center gap-4">
          <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.96 }} onClick={onBack}
            className="px-3 py-1.5 text-xs font-mono text-zinc-500 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:text-zinc-300 transition-colors flex items-center gap-1.5 bg-zinc-950">
            <ArrowLeft className="w-3 h-3" /> Hub
          </motion.button>
          <div>
            <p className={`text-[10px] font-mono ${c.text} uppercase tracking-widest`}>{tag}</p>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100 mt-1">{title}</h1>
          </div>
        </div>

        {/* ELEGANT MAC-OS/VERCEL STYLE TABS */}
        {tabs.length > 1 && (
          <div className="flex gap-8 border-b border-zinc-800/60 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`relative pb-3 text-sm font-mono tracking-wide transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? c.text : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabIndicatorFM"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-current rounded-t-full"
                    style={{ boxShadow: `0 -2px 12px currentColor` }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "theory" && (<motion.div key="theory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>{theoryContent}</motion.div>)}
          {activeTab === "math" && (<motion.div key="math" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>{mathContent}</motion.div>)}
          {activeTab === "lab" && (<motion.div key="lab" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>{labContent}</motion.div>)}
          {activeTab === "questions" && (<motion.div key="questions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}><QuestionsTab questions={questions} color={color} /></motion.div>)}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TOPIC DEFINITIONS & CONTENT
// ═══════════════════════════════════════════════════════════════════════════

type TopicId = "intro-fm" | "goals-fm" | "risk-return" | "agency-problem" | "emerging-roles" | "tvm" | "cap-budget-process" | "cap-budget-tech" | "cap-structure";

interface Topic { id: TopicId; unit: number; title: string; subtitle: string; icon: React.ReactNode; accent: string; description: string; difficulty: string; }

const TOPICS: Topic[] = [
  // UNIT 1
  { id: "intro-fm", unit: 1, title: "Meaning & Scope of FM", subtitle: "The Core Function", icon: <Briefcase className="w-5 h-5" />, accent: "indigo", description: "Procurement, allocation, and utilization of financial resources.", difficulty: "Beginner" },
  { id: "goals-fm", unit: 1, title: "Goals of Financial Management", subtitle: "Profit vs Wealth", icon: <Target className="w-5 h-5" />, accent: "fuchsia", description: "Why the traditional goal of Profit Maximization fails against Wealth Maximization.", difficulty: "Beginner" },
  { id: "risk-return", unit: 1, title: "Risk-Return Trade-off", subtitle: "The Golden Rule", icon: <Scale className="w-5 h-5" />, accent: "violet", description: "The direct relationship between taking financial risks and earning higher returns.", difficulty: "Intermediate" },
  { id: "agency-problem", unit: 1, title: "The Agency Problem", subtitle: "Principals vs Agents", icon: <Users className="w-5 h-5" />, accent: "rose", description: "Conflicts of interest between company owners and professional managers.", difficulty: "Intermediate" },
  { id: "emerging-roles", unit: 1, title: "Emerging Roles in India", subtitle: "The Modern Manager", icon: <BookOpen className="w-5 h-5" />, accent: "sky", description: "How globalization and technology expanded the manager's role from bookkeeping to strategy.", difficulty: "Beginner" },
  { id: "tvm", unit: 1, title: "Time Value of Money (TVM)", subtitle: "Compounding Mechanics", icon: <Clock className="w-5 h-5" />, accent: "teal", description: "Calculating Future Value, Present Value, Annuities, and Perpetuities.", difficulty: "Advanced" },
  
  // UNIT 2
  { id: "cap-budget-process", unit: 2, title: "Capital Budgeting Process", subtitle: "Long-Term Planning", icon: <Layers className="w-5 h-5" />, accent: "orange", description: "The 7-step process of planning and selecting irreversible, large-scale investments.", difficulty: "Intermediate" },
  { id: "cap-budget-tech", unit: 2, title: "Evaluation Techniques", subtitle: "NPV, IRR & Payback", icon: <BarChart className="w-5 h-5" />, accent: "emerald", description: "Mathematical evaluation of projects using Traditional and DCF methods.", difficulty: "Advanced" },
  { id: "cap-structure", unit: 2, title: "Capital Structure", subtitle: "Debt vs Equity", icon: <Building2 className="w-5 h-5" />, accent: "indigo", description: "Determining the optimal mix of borrowed funds and owner's equity to minimize costs.", difficulty: "Intermediate" }
];

const TOPIC_CONTENT: any = {
  "intro-fm": {
    theory: {
      analogy: "Think of a business as the human body. The funds (capital) are the blood, and the Financial Manager is the heart. Their job is to constantly pump the right amount of blood to the right organs at exactly the right time to keep the body healthy and growing.",
      visual: <AnalogyVisuals.IntroHeart color="indigo" />,
      beginner: <p>Financial management deals with the procurement, allocation, and utilization of financial resources in a way that maximizes the value of the firm while ensuring financial stability. Every organization requires funds to carry out its activities effectively.</p>,
      intermediate: <p>It involves crucial decision-making regarding the raising of funds, allocation of financial resources, investment of funds, managing profits, and controlling financial risks. It is an integral, decision-oriented, and continuous process.</p>,
      advanced: <p>The scope of financial management covers four major decisions: <strong>Investment Decisions</strong> (capital budgeting and project evaluation), <strong>Financing Decisions</strong> (determining the best sources like equity vs. debt), <strong>Dividend Decisions</strong> (retained earnings vs payouts), and <strong>Working Capital Management</strong> (managing short-term liquidity).</p>
    },
    questions: [
      { q: "What is the definition of Financial Management according to Howard and Upton?", a: "They defined it as 'the application of the planning and control functions to the finance function.'" },
      { q: "What are the four major decisions that define the scope of Financial Management?", a: "1. Investment Decisions, 2. Financing Decisions, 3. Dividend Decisions, and 4. Working Capital Management." },
      { q: "Why is Financial Management considered a 'Continuous Process'?", a: "Because it requires ongoing planning, monitoring, and controlling of financial resources, unlike a one-time setup activity." },
      { q: "What role does Working Capital Management play?", a: "It deals with managing short-term assets and liabilities to ensure the firm has enough liquidity for day-to-day operational requirements." }
    ]
  },
  "goals-fm": {
    theory: {
      analogy: "Profit Maximization is like running a sprint—you push as hard as you can right now to cross the finish line first, even if you injure yourself. Wealth Maximization is a marathon—you pace yourself, manage your risks, and ensure you are healthy enough to keep running and growing for years to come.",
      visual: <AnalogyVisuals.GoalsMarathon color="fuchsia" />,
      beginner: <p>Traditionally, the main goal of a business was <strong>Profit Maximization</strong>—achieving the highest possible net profit. However, modern financial theory emphasizes <strong>Wealth Maximization</strong> as the primary objective, which means increasing the overall market value of shareholders' wealth.</p>,
      intermediate: <p>Profit maximization is flawed because it is ambiguous (Gross? Net? Operating profit?), ignores the <strong>Time Value of Money</strong> (when the profits are received), and ignores the <strong>Risk</strong> involved. It also encourages a dangerous short-term focus.</p>,
      advanced: <p>Wealth maximization is a scientific approach utilizing Discounted Cash Flow (DCF) techniques like Net Present Value (NPV). By evaluating both risk and expected returns over the long term, it directly aligns management decisions with the ultimate aim of the shareholders: increasing the market price of their shares.</p>
    },
    questions: [
      { q: "Why does Profit Maximization fail as the primary goal of a modern firm?", a: "It ignores the time value of money, it ignores the risk associated with generating those profits, and it encourages short-term thinking over long-term sustainability." },
      { q: "How is 'Wealth' measured in the context of Wealth Maximization?", a: "Shareholders' wealth is measured by the market price of the company's equity shares." },
      { q: "How does the 'Time Value of Money' flaw affect Profit Maximization?", a: "Profit maximization treats ₹100 earned today as equal to ₹100 earned five years from now, completely ignoring that money today is more valuable because it can be invested." },
      { q: "Why is 'Ambiguity' listed as a limitation of Profit Maximization?", a: "The term 'profit' is vague. It could mean Gross Profit, Operating Profit, Net Profit, or Earnings Per Share. A manager could boost one metric while harming another." }
    ]
  },
  "risk-return": {
    theory: {
      analogy: "Think of investments like amusement park rides. A government bond is the Merry-Go-Round: very safe, predictable, but slow and not very exciting (low return). The stock market is the Rollercoaster: terrifying drops and thrilling peaks (high risk), but ultimately a much more exhilarating ride (high return).",
      visual: <AnalogyVisuals.RiskRollercoaster color="violet" />,
      beginner: <p>The risk-return trade-off states a very simple rule: higher potential returns are associated with higher levels of risk, while lower-risk investments generally offer lower returns. Investors must accept risk to achieve growth.</p>,
      intermediate: <p>In finance, <strong>Risk</strong> refers to the possibility that the actual return on an investment will differ from the expected return. Investors have different preferences: <em>Risk-Averse</em> investors prefer low-risk investments (like fixed deposits), <em>Risk-Neutral</em> investors look only at expected returns, and <em>Risk-Seeking</em> investors pursue high risks for high rewards.</p>,
      advanced: <p>Financial managers must quantify and manage multiple risk vectors: <strong>Market Risk</strong> (fluctuations caused by economy/politics), <strong>Credit Risk</strong> (borrower failing to repay), <strong>Liquidity Risk</strong> (inability to sell quickly without loss), and <strong>Interest Rate Risk</strong> (bond values dropping when rates rise).</p>
    },
    math: (
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6 mt-6">
        <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Numerical Example: The Trade-off</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-sm text-zinc-400 mb-2">Government Bonds</p>
            <p className="text-xl font-bold font-mono text-emerald-400">6% Return</p>
            <p className="text-xs text-zinc-500 mt-1">Low Risk</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-sm text-zinc-400 mb-2">Stock Market</p>
            <p className="text-xl font-bold font-mono text-rose-400">12% Return</p>
            <p className="text-xs text-zinc-500 mt-1">High Risk</p>
          </div>
        </div>
      </div>
    ),
    questions: [
      { q: "What is Liquidity Risk?", a: "It occurs when investors are unable to sell an asset quickly without a significant loss in value (e.g., real estate compared to publicly traded stocks)." },
      { q: "How do Risk-Averse investors differ from Risk-Seeking investors?", a: "Risk-averse investors prefer low-risk investments even if returns are lower (like Govt Bonds). Risk-seeking investors are willing to take higher risks in pursuit of higher returns (like Stocks or Crypto)." },
      { q: "What is the fundamental definition of 'Risk' in finance?", a: "The possibility that the actual return on an investment will differ from the expected return." },
      { q: "What is Credit Risk?", a: "The possibility that a borrower may fail to repay the loan or the required interest payments." }
    ]
  },
  "agency-problem": {
    theory: {
      analogy: "Imagine hiring a real estate agent to sell your house. You (the Principal) want the highest possible price. The Agent wants a quick sale so they can collect their commission and move to the next client. Because they know the market better than you (Information Asymmetry), they might convince you to accept a lower offer. This conflict of interest is the Agency Problem.",
      visual: <AnalogyVisuals.AgencyArrows color="rose" />,
      beginner: <p>The <strong>Agency Problem</strong> refers to the conflict of interest between the owners of a company (the Principals/Shareholders) and the professional managers hired to operate the company (the Agents).</p>,
      intermediate: <p>This conflict arises due to the separation of ownership and control, combined with <strong>Information Asymmetry</strong> (managers possess more information about daily operations than shareholders). Managers might pursue personal goals like higher salaries, job security, or luxury offices instead of maximizing shareholder wealth.</p>,
      advanced: <p>This misalignment creates <strong>Agency Costs</strong>. These include: 1. <em>Monitoring Costs</em> (paying for audits and board oversight), 2. <em>Bonding Costs</em> (creating performance-based contracts), and 3. <em>Residual Loss</em> (the actual wealth lost because managers make suboptimal decisions). Companies reduce these problems using performance-based compensation (stock options) and strong corporate governance.</p>
    },
    questions: [
      { q: "What are the three components of Agency Costs?", a: "1. Monitoring Costs (e.g., auditing fees), 2. Bonding Costs (e.g., performance contracts), and 3. Residual Loss (wealth lost to bad decisions)." },
      { q: "Name two methods used to reduce Agency Problems in a corporation.", a: "1. Performance-based compensation (like stock options) to align interests, and 2. Strong oversight by the Board of Directors / Corporate Governance." },
      { q: "What is 'Information Asymmetry' in the context of the Agency Problem?", a: "It is the imbalance of knowledge where managers usually possess more accurate, up-to-date information about the company's operations than the shareholders, which can lead to misuse of that information." },
      { q: "Can Agency Problems exist between Shareholders and Creditors?", a: "Yes. Shareholders may prefer taking on highly risky projects because they get all the upside, but creditors dislike it because if the project fails, the creditors face a higher risk of default." }
    ]
  },
  "emerging-roles": {
    theory: {
      analogy: "Historically, the Financial Manager was a 'Historian'—looking backward to record what was spent. Today, they are the 'Navigator'—looking forward through the windshield, using high-tech radar (data analytics) to steer the company through global storms.",
      visual: <AnalogyVisuals.NavigatorRadar color="sky" />,
      beginner: <p>Traditionally, financial managers were mainly responsible for managing funds, preparing financial reports, and maintaining liquidity. Today, due to globalization and technology, their roles have expanded into strategic decision-making.</p>,
      intermediate: <p>In India, economic liberalization (1991) opened markets to global competition. Modern managers now handle <strong>Strategic Financial Planning</strong>, complex <strong>Risk Management</strong> (using hedging and derivatives), and <strong>Global Financial Management</strong> (foreign exchange and cross-border investments).</p>,
      advanced: <p>They are now deeply involved in <strong>Technology and Financial Innovation</strong>, utilizing ERP systems, AI, and data analytics to forecast trends. Furthermore, they are responsible for <strong>Sustainability and Ethical Finance</strong>, managing ESG (Environmental, Social, Governance) reporting to ensure long-term corporate compliance.</p>
    },
    questions: [
      { q: "How did Economic Liberalization in India affect the role of the Financial Manager?", a: "It opened the economy to global competition, requiring managers to handle foreign exchange, international financing, and cross-border investments." },
      { q: "What is the role of the modern Financial Manager regarding Sustainability?", a: "They are involved in Environmental, Social, and Governance (ESG) reporting and creating sustainable investment strategies for long-term business viability." },
      { q: "Why is 'Technological Competence' now a mandatory skill for Financial Managers?", a: "Because modern finance relies heavily on Financial Analytics Software, ERP systems, and AI to improve efficiency and forecasting accuracy." },
      { q: "What does 'Strategic Financial Planning' involve?", a: "Collaborating with top management to identify growth opportunities, allocate resources efficiently, and plan long-term investments." }
    ]
  },
  "tvm": {
    theory: {
      analogy: "A seed planted today will grow into a fruit-bearing tree in five years. A seed kept in a drawer for five years is still just a seed. Money works the exact same way. Money today can be 'planted' (invested) to grow into more money. Therefore, ₹1,000 today is intrinsically more valuable than the promise of ₹1,000 in the future.",
      visual: <AnalogyVisuals.TVMSeed color="teal" />,
      beginner: <p>The <strong>Time Value of Money (TVM)</strong> is the fundamental concept that money available today is worth more than the same amount received in the future. This is due to investment opportunities (earning interest), inflation (loss of purchasing power), and risk (uncertainty of the future).</p>,
      intermediate: <p>We calculate this using <strong>Future Value (FV)</strong>, which determines what an investment today will grow into, and <strong>Present Value (PV)</strong>, which discounts a future sum back to its worth today. TVM is the backbone of all loan calculations, EMIs, and retirement planning.</p>,
      advanced: <p>An <strong>Annuity</strong> is a series of equal payments made at regular intervals. An <em>Ordinary Annuity</em> pays at the end of the period (like a loan EMI), while an <em>Annuity Due</em> pays at the beginning (like rent). A <strong>Perpetuity</strong> is a type of annuity where payments continue forever without end (PV = PMT / r).</p>
    },
    math: (
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6 mt-6">
        <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Academic Numerical Examples</h3>
        <div className="space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <p className="text-sm font-bold text-teal-400 mb-2">Example 1: Future Value (FV)</p>
            <p className="text-sm text-zinc-300">If ₹10,000 is invested for 3 years at 10% interest:</p>
            <p className="text-sm font-mono text-zinc-400 mt-2">FV = 10,000 × (1 + 0.10)³</p>
            <p className="text-sm font-mono text-zinc-400">FV = 10,000 × 1.331 = <span className="text-emerald-400 font-bold">₹13,310</span></p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <p className="text-sm font-bold text-fuchsia-400 mb-2">Example 2: Present Value (PV)</p>
            <p className="text-sm text-zinc-300">A person will receive ₹15,000 after 3 years (Discount rate = 10%):</p>
            <p className="text-sm font-mono text-zinc-400 mt-2">PV = 15,000 / (1 + 0.10)³</p>
            <p className="text-sm font-mono text-zinc-400">PV = 15,000 / 1.331 = <span className="text-emerald-400 font-bold">₹11,270</span></p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <p className="text-sm font-bold text-violet-400 mb-2">Example 3: Future Value of Annuity</p>
            <p className="text-sm text-zinc-300">A person saves ₹5,000 every year for 5 years at 10% interest:</p>
            <p className="text-sm font-mono text-zinc-400 mt-2">FVA = 5,000 × [(1.10)⁵ - 1] / 0.10</p>
            <p className="text-sm font-mono text-zinc-400">FVA = 5,000 × 6.105 = <span className="text-emerald-400 font-bold">₹30,525</span></p>
          </div>
        </div>
      </div>
    ),
    questions: [
      { q: "What are the three main reasons for the Time Value of Money?", a: "1. Investment Opportunities (earning interest), 2. Inflation (decreasing purchasing power), and 3. Risk and Uncertainty." },
      { q: "What is the difference between an Ordinary Annuity and an Annuity Due?", a: "In an Ordinary Annuity, payments are made at the end of each period (e.g., loan EMIs). In an Annuity Due, payments are made at the beginning of each period (e.g., rent)." },
      { q: "What is a Perpetuity and what is its formula?", a: "A Perpetuity is an infinite series of equal payments that continues forever. The formula is PV = PMT / r (where PMT is the annual payment and r is the interest rate)." },
      { q: "If you receive ₹1,000 forever at a 10% discount rate, what is its present value?", a: "Using the Perpetuity formula: PV = 1,000 / 0.10 = ₹10,000." }
    ]
  },
  "cap-budget-process": {
    theory: {
      analogy: "Capital Budgeting is like buying a house. It requires a massive amount of funds, it will impact your life for decades, and once you sign the papers, it is nearly impossible to reverse the decision without taking a massive financial loss.",
      visual: <AnalogyVisuals.CapBudgetHouse color="orange" />,
      beginner: <p><strong>Capital Budgeting</strong> refers to the process of planning, evaluating, and selecting long-term investment projects (like purchasing machinery or building a factory). Because these decisions involve large financial commitments and long-term consequences, mistakes can destroy a company.</p>,
      intermediate: <p>Projects can be classified differently. <strong>Independent Projects</strong> do not affect each other (you can accept all profitable ones). <strong>Mutually Exclusive Projects</strong> mean accepting one automatically eliminates the other (e.g., choosing between two different machine brands for the same factory floor).</p>,
      advanced: <p>The Capital Budgeting Process follows 7 strict steps: 1. Identification of Opportunities, 2. Screening, 3. <strong>Estimation of Cash Flows</strong> (Initial, Operating, and Terminal), 4. Evaluation of Proposals (using NPV/IRR), 5. Selection, 6. Implementation, and 7. <strong>Post-Audit Review</strong> (comparing actual performance against initial expectations).</p>
    },
    questions: [
      { q: "What are the three types of cash flows estimated during the Capital Budgeting process?", a: "1. Initial Investment (outflows for setup), 2. Operating Cash Flows (revenues/expenses during life), and 3. Terminal Cash Flow (salvage value at the end)." },
      { q: "What is the difference between Independent and Mutually Exclusive projects?", a: "Independent projects do not affect each other (all profitable ones can be accepted). In Mutually Exclusive projects, accepting one automatically rejects the others." },
      { q: "What is a 'Replacement Project'?", a: "A project that involves replacing old or obsolete machinery with modern equipment to improve efficiency or reduce costs." },
      { q: "What is the purpose of the 'Post-Audit' step?", a: "It evaluates the actual performance of the project against the initial estimates to identify deviations and improve future investment decisions." }
    ]
  },
  "cap-budget-tech": {
    theory: {
      analogy: "Evaluating projects using 'Payback Period' is like hiring an employee just because they can start tomorrow. Evaluating using 'NPV' is like hiring the employee who will generate the most total value for the company over the next 10 years, even if they take a month to start.",
      visual: <AnalogyVisuals.NPVScales color="emerald" />,
      beginner: <p>Once cash flows are estimated, firms use Evaluation Techniques to decide if a project is viable. Traditional methods include the <strong>Payback Period</strong> (how fast you get your initial money back) and <strong>ARR</strong>. However, these methods are flawed because they completely ignore the Time Value of Money.</p>,
      intermediate: <p>Modern evaluation relies on Discounted Cash Flow (DCF) techniques. <strong>Net Present Value (NPV)</strong> is the gold standard: it subtracts the initial investment from the present value of all future cash inflows. The rule is simple: Accept the project if NPV {">"} 0.</p>,
      advanced: <p><strong>Internal Rate of Return (IRR)</strong> is the exact discount rate that makes the NPV equal to zero. You accept the project if the IRR is greater than your required rate of return. While IRR is popular because percentages are easy to understand, NPV is always the mathematically superior method because IRR assumes cash flows are reinvested at the IRR itself, which is often unrealistic.</p>
    },
    math: (
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6 mt-6">
        <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Academic Numerical Examples</h3>
        <div className="space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <p className="text-sm font-bold text-rose-400 mb-2">Example 1: Payback Period</p>
            <p className="text-sm text-zinc-300">Initial Investment = ₹50,000. Annual Cash Inflow = ₹10,000.</p>
            <p className="text-sm font-mono text-zinc-400 mt-2">Payback = 50,000 / 10,000 = <span className="text-emerald-400 font-bold">5 Years</span></p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <p className="text-sm font-bold text-sky-400 mb-2">Example 2: Accounting Rate of Return (ARR)</p>
            <p className="text-sm text-zinc-300">Average Annual Profit = ₹8,000. Average Investment = ₹40,000.</p>
            <p className="text-sm font-mono text-zinc-400 mt-2">ARR = (8,000 / 40,000) × 100 = <span className="text-emerald-400 font-bold">20%</span></p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <p className="text-sm font-bold text-fuchsia-400 mb-2">Example 3: Profitability Index (PI)</p>
            <p className="text-sm text-zinc-300">PV of Cash Inflows = ₹120,000. Initial Investment = ₹100,000.</p>
            <p className="text-sm font-mono text-zinc-400 mt-2">PI = 120,000 / 100,000 = <span className="text-emerald-400 font-bold">1.2</span> (Accept since PI {">"} 1)</p>
          </div>
        </div>
      </div>
    ),
    questions: [
      { q: "What are the two major limitations of the Payback Period method?", a: "1. It completely ignores the Time Value of Money. 2. It ignores any cash flows that occur after the payback period is reached." },
      { q: "What is the accept/reject criteria for Net Present Value (NPV)?", a: "Accept the project if NPV > 0. Reject if NPV < 0. Be indifferent if NPV = 0." },
      { q: "What is the primary limitation of the Accounting Rate of Return (ARR)?", a: "It uses accounting profit instead of actual cash flows, and it completely ignores the time value of money." },
      { q: "How is the Internal Rate of Return (IRR) related to NPV?", a: "IRR is defined as the exact discount rate at which the Net Present Value of a project becomes exactly zero." }
    ]
  },
  "cap-structure": {
    theory: {
      analogy: "Building a company's capital structure is like making a smoothie. Debt is like milk: it's cheap and increases volume, but if you use too much, it spoils and ruins the whole drink (bankruptcy). Equity is like fresh fruit: it's sweet and safe, but very expensive. The goal is to find the perfect blend.",
      visual: <AnalogyVisuals.SmoothieMix color="indigo" />,
      beginner: <p><strong>Capital Structure</strong> refers to the specific mix of Debt (borrowed money like debentures and bank loans) and Equity (owner's money like shares and retained earnings) used by a firm to finance its long-term assets and operations.</p>,
      intermediate: <p>Debt is generally a cheaper source of finance than equity for two reasons: lenders take less risk than shareholders, and crucially, <strong>Interest payments on debt are tax-deductible</strong>. However, using excessive debt increases the firm's <em>Financial Risk</em>, meaning they might struggle to meet fixed interest obligations if profits drop.</p>,
      advanced: <p>The ultimate goal of the financial manager is to find the <strong>Optimal Capital Structure</strong>. This is the exact ideal combination of debt and equity that minimizes the firm's overall Weighted Average Cost of Capital (WACC) and maximizes the market value of the firm, perfectly balancing tax benefits with the risk of bankruptcy.</p>
    },
    questions: [
      { q: "Why is Debt generally considered a cheaper source of finance than Equity?", a: "Because interest payments on debt are tax-deductible (creating a tax shield), which reduces the effective cost of borrowing. Also, debt holders take less risk than equity holders." },
      { q: "What are the main characteristics of an Optimal Capital Structure?", a: "1. Minimum Weighted Average Cost of Capital (WACC), 2. Maximum market value of the firm, and 3. A balanced level of financial risk." },
      { q: "What is the difference between Equity Share Capital and Preference Share Capital?", a: "Equity shares represent true ownership with voting rights but no fixed dividend. Preference shares generally have no voting rights, but have a fixed dividend rate and get preference during liquidation." },
      { q: "How does 'Company Size' factor into Capital Structure decisions?", a: "Large companies have better access to capital markets and can raise funds easily through debt or equity. Small firms often have to rely more on internal financing or bank loans." }
    ]
  }
};

const UNIT_1_QUESTIONS = [
  { q: "What is the primary objective of modern financial management?", options: ["Profit Maximization", "Wealth Maximization", "Sales Maximization", "Cost Minimization"], correct: 1, explanation: "Wealth maximization focuses on increasing the market value of the firm's shares, accounting for both the time value of money and risk, unlike traditional profit maximization." },
  { q: "Which of the following is a limitation of Profit Maximization?", options: ["It ignores the Time Value of Money", "It is difficult to calculate", "It focuses too much on the long term", "It reduces agency costs"], correct: 0, explanation: "Profit maximization treats profits earned today as equal to profits earned years from now, completely ignoring the time value of money and risk." },
  { q: "The conflict of interest between shareholders and managers is known as:", options: ["The Liquidity Problem", "The Agency Problem", "The Trade-off Problem", "The Asymmetry Problem"], correct: 1, explanation: "The Agency Problem arises when the agents (managers) act in their own self-interest rather than maximizing the wealth of the principals (shareholders)." }
];

const UNIT_2_QUESTIONS = [
  { q: "What is the primary flaw of the Payback Period method?", options: ["It is too hard to calculate", "It ignores the time value of money", "It requires a discount rate", "It only works for independent projects"], correct: 1, explanation: "The Payback method simply counts the years to recover the investment, completely ignoring TVM and cash flows that occur after the payback year." },
  { q: "Which capital budgeting technique uses accounting profits instead of cash flows?", options: ["Net Present Value (NPV)", "Internal Rate of Return (IRR)", "Accounting Rate of Return (ARR)", "Profitability Index (PI)"], correct: 2, explanation: "ARR divides average accounting profit by average investment. All other modern methods use actual Cash Flows." },
  { q: "Accept a project if its Net Present Value (NPV) is:", options: ["Equal to zero", "Less than zero", "Greater than zero", "Equal to the IRR"], correct: 2, explanation: "An NPV > 0 means the project generates more cash than it costs (in present value terms), directly increasing shareholder wealth." }
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default function FinancialManagementHub() {
  const [activeTopic, setActiveTopic] = useState<TopicId | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<1 | 2 | null>(null);
  const [completed, setCompleted] = useState<Set<TopicId>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const markDone = (id: TopicId) => setCompleted((prev) => new Set(prev).add(id));
  const handleBack = (id: TopicId) => { markDone(id); setActiveTopic(null); };

  const filteredTopics = TOPICS.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()) || t.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unit1Topics = filteredTopics.filter(t => t.unit === 1);
  const unit2Topics = filteredTopics.filter(t => t.unit === 2);

  if (activeQuiz) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 py-8 px-5 relative overflow-hidden" style={{ fontFamily: "var(--font-mono, 'JetBrains Mono'), 'Fira Mono', monospace" }}>
        <ElegantBackground />
        <UnitQuiz unit={activeQuiz} questions={activeQuiz === 1 ? UNIT_1_QUESTIONS : UNIT_2_QUESTIONS} onBack={() => setActiveQuiz(null)} />
      </div>
    );
  }

  if (activeTopic) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 py-8 px-5 relative overflow-hidden" style={{ fontFamily: "var(--font-mono, 'JetBrains Mono'), 'Fira Mono', monospace" }}>
        <ElegantBackground />
        <AnimatePresence mode="wait">
          {activeTopic === "tvm" ? (
            <TimeValueMoneyLab key="tvm" onBack={() => handleBack("tvm")} />
          ) : activeTopic === "cap-budget-tech" ? (
            <CapitalBudgetingLab key="cb" onBack={() => handleBack("cap-budget-tech")} />
          ) : (
            <GenericInfoLab key={activeTopic} id={activeTopic} onBack={() => handleBack(activeTopic)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden" style={{ fontFamily: "var(--font-mono, 'JetBrains Mono'), 'Fira Mono', monospace" }}>
      <ElegantBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3"><div className="h-[1px] w-8 bg-indigo-500/40" /><span className="text-[10px] font-mono text-indigo-500/70 uppercase tracking-widest">Corporate Finance</span></div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">Financial Management.</h1>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div animate={{ width: `${(completed.size / TOPICS.length) * 100}%` }} transition={{ type: "spring", stiffness: 200, damping: 25 }} className="h-full bg-indigo-500 rounded-full" />
            </div>
            <span className="text-[10px] font-mono text-zinc-600">{completed.size}/{TOPICS.length} explored</span>
          </div>
          <div className="relative max-w-md mt-6 shadow-2xl shadow-indigo-900/10">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input type="text" placeholder="Search concepts (e.g., Risk, Budgeting)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 font-mono focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-600" />
          </div>
        </motion.div>

        {/* UNIT 1 */}
        {unit1Topics.length > 0 && (
          <div className="mb-12 relative z-10">
            <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2 flex justify-between items-center">
              <span>Unit 1: Fundamentals of Financial Management</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <AnimatePresence>
                {unit1Topics.map((topic, i) => {
                  const c = getAccent(topic.accent);
                  return (
                    <motion.div custom={i} variants={fadeUp} initial="hidden" animate="visible" key={topic.id}>
                      <motion.div
                        role="button"
                        whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} onClick={() => setActiveTopic(topic.id as TopicId)}
                        className={`group w-full text-left relative rounded-2xl border overflow-hidden transition-all duration-300 ${c.border} bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-md ${c.glow} cursor-pointer`}
                      >
                        <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${c.via} to-transparent`} />
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${c.border} ${c.bgGhost} ${c.text} shadow-inner shadow-white/5`}>{topic.icon}</div>
                            <div className="flex items-center gap-2">
                              {completed.has(topic.id) && (<span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/8 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Done</span>)}
                              <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${c.border} ${c.bgGhost} ${c.text}`}>{topic.difficulty}</span>
                            </div>
                          </div>
                          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{topic.subtitle}</p>
                          <h3 className="text-lg font-bold font-mono text-zinc-100 mb-2">{topic.title}</h3>
                          <p className="text-sm text-zinc-500 leading-relaxed mb-4">{topic.description}</p>
                          <div className={`inline-flex items-center gap-2 text-sm font-mono font-semibold ${c.text} group-hover:gap-3 transition-all`}>
                            <span>Explore</span><ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            <motion.div role="button" variants={fadeUp} initial="hidden" animate="visible" onClick={() => setActiveQuiz(1)} className="mt-5 w-full flex items-center justify-between p-6 bg-gradient-to-r from-indigo-600/10 to-transparent border border-indigo-500/30 rounded-2xl hover:bg-indigo-600/20 transition-all group cursor-pointer shadow-[inset_0_1px_0_0_rgba(99,102,241,0.1)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner shadow-white/10">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold font-mono text-indigo-400">Unit 1 Final Exam</h3>
                  <p className="text-sm text-zinc-400">25 Questions • Theory & Concepts</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-indigo-400 transform group-hover:translate-x-2 transition-transform" />
            </motion.div>
          </div>
        )}

        {/* UNIT 2 */}
        {unit2Topics.length > 0 && (
          <div className="mb-12 relative z-10">
            <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2 flex justify-between items-center">
              <span>Unit 2: Investment & Financing Decisions</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <AnimatePresence>
                {unit2Topics.map((topic, i) => {
                  const c = getAccent(topic.accent);
                  return (
                    <motion.div custom={i} variants={fadeUp} initial="hidden" animate="visible" key={topic.id}>
                      <motion.div
                        role="button"
                        whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} onClick={() => setActiveTopic(topic.id as TopicId)}
                        className={`group w-full text-left relative rounded-2xl border overflow-hidden transition-all duration-300 ${c.border} bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-md ${c.glow} cursor-pointer`}
                      >
                        <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${c.via} to-transparent`} />
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${c.border} ${c.bgGhost} ${c.text} shadow-inner shadow-white/5`}>{topic.icon}</div>
                            <div className="flex items-center gap-2">
                              {completed.has(topic.id) && (<span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/8 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Done</span>)}
                              <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${c.border} ${c.bgGhost} ${c.text}`}>{topic.difficulty}</span>
                            </div>
                          </div>
                          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{topic.subtitle}</p>
                          <h3 className="text-lg font-bold font-mono text-zinc-100 mb-2">{topic.title}</h3>
                          <p className="text-sm text-zinc-500 leading-relaxed mb-4">{topic.description}</p>
                          <div className={`inline-flex items-center gap-2 text-sm font-mono font-semibold ${c.text} group-hover:gap-3 transition-all`}>
                            <span>Explore</span><ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            <motion.div role="button" variants={fadeUp} initial="hidden" animate="visible" onClick={() => setActiveQuiz(2)} className="mt-5 w-full flex items-center justify-between p-6 bg-gradient-to-r from-fuchsia-600/10 to-transparent border border-fuchsia-500/30 rounded-2xl hover:bg-fuchsia-600/20 transition-all group cursor-pointer shadow-[inset_0_1px_0_0_rgba(217,70,239,0.1)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 shadow-inner shadow-white/10">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold font-mono text-fuchsia-400">Unit 2 Final Exam</h3>
                  <p className="text-sm text-zinc-400">25 Questions • Capital Budgeting & Structure</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-fuchsia-400 transform group-hover:translate-x-2 transition-transform" />
            </motion.div>
          </div>
        )}

        {filteredTopics.length === 0 && (<div className="text-center py-12 text-zinc-600 font-mono text-sm relative z-10">No topics found matching "{searchQuery}".</div>)}
        <p className="text-center text-[10px] text-zinc-700 mt-12 font-mono relative z-10">Fintastic Lab · Financial Management · fintasticlab.in</p>
      </div>
    </div>
  );
}
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposedChart, ScatterChart, Scatter, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";
import {
  ArrowLeft, ArrowRight, PieChart, TrendingUp, Shield, Zap,
  CheckCircle2, Search, Activity, Target, BookOpen, Crosshair,
  Layers, AlertTriangle, History, Brain, FileText, Award
} from "lucide-react";
import FloatingFormulaBackground from "@/components/FloatingFormulaBackground";

// ═══════════════════════════════════════════════════════════════════════════
// PURE FINANCE CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

const EQ_RETURN = 15;
const EQ_STD = 20;
const DEBT_RETURN = 6;
const DEBT_STD = 5;
const RF_RATE = 4;
const MKT_RETURN = 12;

function calcPortfolioReturn(w1: number): number { return w1 * EQ_RETURN + (1 - w1) * DEBT_RETURN; }
function calcPortfolioRisk(w1: number, rho: number): number {
  const w2 = 1 - w1;
  return Math.sqrt(Math.max(0, w1 * w1 * EQ_STD * EQ_STD + w2 * w2 * DEBT_STD * DEBT_STD + 2 * w1 * w2 * EQ_STD * DEBT_STD * rho));
}
function calcSharpe(ret: number, risk: number): number { return risk <= 0 ? 0 : (ret - RF_RATE) / risk; }
function generateFrontier(rho: number, n: number = 50) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const w = i / n;
    return { risk: calcPortfolioRisk(w, rho), ret: calcPortfolioReturn(w) };
  });
}
function findTangencyW(rho: number): number {
  let best = 0, bestS = -Infinity;
  for (let i = 0; i <= 200; i++) {
    const w = i / 200;
    const s = calcSharpe(calcPortfolioReturn(w), calcPortfolioRisk(w, rho));
    if (s > bestS) { bestS = s; best = w; }
  }
  return best;
}
function generateCAL(rho: number) {
  const tw = findTangencyW(rho);
  const tRet = calcPortfolioReturn(tw);
  const tRisk = calcPortfolioRisk(tw, rho);
  const slope = tRisk > 0 ? (tRet - RF_RATE) / tRisk : 0;
  return Array.from({ length: 50 }, (_, i) => {
    const r = (i / 49) * 26;
    return { risk: r, ret: RF_RATE + slope * r };
  });
}
function capmExpectedReturn(beta: number): number { return RF_RATE + beta * (MKT_RETURN - RF_RATE); }
function generateSML() {
  return Array.from({ length: 30 }, (_, i) => {
    const b = (i / 29) * 2.5;
    return { beta: parseFloat(b.toFixed(2)), ret: capmExpectedReturn(b) };
  });
}

function generateCloudPortfolios(numAssets = 3, numSimulations = 2000) {
  const rets = [14, 8, 5];
  const vols = [22, 12, 4];
  const corrs = [ [1, 0.4, -0.2], [0.4, 1, 0.1], [-0.2, 0.1, 1] ];

  const portfolios = [];
  for (let i = 0; i < numSimulations; i++) {
    let w = Array.from({ length: numAssets }, () => Math.random());
    const sum = w.reduce((a, b) => a + b, 0);
    w = w.map(val => val / sum);

    const ret = w[0] * rets[0] + w[1] * rets[1] + w[2] * rets[2];
    let varP = 0;
    for (let j = 0; j < numAssets; j++) {
      for (let k = 0; k < numAssets; k++) { varP += w[j] * w[k] * vols[j] * vols[k] * corrs[j][k]; }
    }
    portfolios.push({ risk: Math.sqrt(varP), ret: ret });
  }
  return portfolios;
}

function extractParetoFrontier(cloud: { risk: number, ret: number }[]) {
  const sorted = [...cloud].sort((a, b) => a.risk - b.risk);
  const frontier = [];
  let maxRet = -Infinity;
  for (const p of sorted) {
    if (p.ret >= maxRet + 0.02) {
      frontier.push(p);
      maxRet = p.ret;
    }
  }
  return frontier;
}

// ═══════════════════════════════════════════════════════════════════════════
// FORMULAS & THEMES
// ═══════════════════════════════════════════════════════════════════════════

const PM_FORMULAS = [
  "E(Rₚ) = w₁R₁ + w₂R₂",
  "σ²ₚ = w₁²σ₁² + w₂²σ₂² + 2w₁w₂Cov",
  "SR = (Rₚ - R_f) / σₚ",
  "IR = R_A / σ_A",
  "R_A = Rₚ - R_B",
  "IR = IC × √BR",
  "E(R_A) = TC × IC × √BR × σ_A",
  "σ_A* = (IR / SR_B) × σ_B",
  "E(R_P) = R_F + β₁(λ₁) + β₂(λ₂)",
  "VaR = [μ_P - (z × σ_P)] × V",
  "Treynor = (R_p - R_f) / β_p",
  "α = R_p - [R_f + β_p(R_m - R_f)]",
  "M² = (SR_p - SR_m)σ_m + R_m",
  "U = E(R) - ½Aσ²",
  "w^T Σ w",
];

const PM_BALLOON_COLORS = [
  { bg: "bg-amber-900/50", text: "text-amber-300", glow: "rgba(245,158,11,0)" },
  { bg: "bg-rose-900/50", text: "text-rose-300", glow: "rgba(244,63,94,0)" },
  { bg: "bg-orange-950/50", text: "text-orange-300", glow: "rgba(249,115,22,0)" },
  { bg: "bg-zinc-800/50", text: "text-zinc-300", glow: "rgba(161,161,170,0)" }
];

// ═══════════════════════════════════════════════════════════════════════════
// MOTION VARIANTS & SHARED UI
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

type DepthLevel = "beginner" | "intermediate" | "advanced";

interface DepthExplanationProps {
  beginner: React.ReactNode;
  intermediate: React.ReactNode;
  advanced: React.ReactNode;
}

function DepthExplanation({ beginner, intermediate, advanced }: DepthExplanationProps) {
  const [depth, setDepth] = useState<DepthLevel>("beginner");

  return (
    <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-5 relative z-10 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <h2 className="text-lg font-bold font-mono text-zinc-100">Core Concept</h2>
        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          {(["beginner", "intermediate", "advanced"] as DepthLevel[]).map((level) => (
            <button key={level} onClick={() => setDepth(level)}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-md transition-colors ${
                depth === level ? "bg-amber-500/10 text-amber-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
              }`}>
              {level}
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
  );
}

function SliderInput({ label, hint, min, max, step, value, onChange, accent = "amber", suffix = "%" }: any) {
  const vCol = accent === "cyan" ? "text-cyan-400" : accent === "emerald" ? "text-emerald-400" : accent === "rose" ? "text-rose-400" : "text-amber-400";
  const acc = accent === "cyan" ? "accent-cyan-500" : accent === "emerald" ? "accent-emerald-500" : accent === "rose" ? "accent-rose-500" : "accent-amber-500";
  return (
    <motion.div variants={slideRight} className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <label className="text-xs font-mono text-zinc-400">{label}</label>
        <span className={`text-sm font-bold font-mono ${vCol}`}>{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer ${acc}`} />
      {hint && <p className="text-[10px] text-zinc-600 mt-0.5">{hint}</p>}
    </motion.div>
  );
}

function StatCard({ label, value, sub, accent = "zinc", glow = false }: any) {
  const colors: Record<string, string> = { amber: "text-amber-400", cyan: "text-cyan-400", emerald: "text-emerald-400", rose: "text-rose-400", zinc: "text-zinc-200" };
  return (
    <motion.div layout variants={fadeUp}
      className={`bg-zinc-900/60 border rounded-xl p-3 transition-all duration-500 ${glow ? "border-amber-500/50 shadow-[0_0_20px_2px_rgba(245,158,11,0.18)]" : "border-zinc-800"}`}>
      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
      <motion.p key={value} initial={{ opacity: 0.5, y: -3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
        className={`text-lg font-bold font-mono ${colors[accent] ?? colors.zinc}`}>{value}</motion.p>
      {sub && <p className="text-[10px] text-zinc-600 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const pt = payload[0].payload;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono z-50">
      {pt.beta !== undefined && <p className="text-zinc-400">Beta: {pt.beta}</p>}
      {pt.risk !== undefined && <p className="text-zinc-400">Risk: {pt.risk.toFixed(1)}%</p>}
      {pt.ret !== undefined && <p className="text-amber-400">Return: {pt.ret.toFixed(1)}%</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TOPIC DASHBOARD (Tabbed Interface)
// ═══════════════════════════════════════════════════════════════════════════

type TabId = "theory" | "lab" | "math";

interface TopicDashboardProps {
  title: string;
  tag: string;
  onBack: () => void;
  theoryContent: React.ReactNode;
  labContent?: React.ReactNode;
  mathContent?: React.ReactNode;
  defaultTab?: TabId;
}

function TopicDashboard({ title, tag, onBack, theoryContent, labContent, mathContent, defaultTab = "theory" }: TopicDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  const tabs = [
    { id: "theory", label: "📖 Core Concept", available: !!theoryContent },
    { id: "lab", label: "🕹️ Interactive Lab", available: !!labContent },
    { id: "math", label: "🧮 Math & Formulae", available: !!mathContent },
  ].filter(t => t.available);

  const currentTab = tabs.find(t => t.id === activeTab) ? activeTab : "theory";

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative z-10">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.96 }} onClick={onBack}
            className="px-3 py-1.5 text-xs font-mono text-zinc-500 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:text-zinc-300 transition-colors flex items-center gap-1.5 bg-zinc-950">
            <ArrowLeft className="w-3 h-3" /> Hub
          </motion.button>
          <div>
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{tag}</p>
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-zinc-100">{title}</h1>
          </div>
        </div>

        {tabs.length > 1 && (
          <div className="flex bg-zinc-900/80 backdrop-blur-md p-1 rounded-xl border border-zinc-800 self-start md:self-auto overflow-x-auto max-w-full">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as TabId)}
                className={`relative px-4 py-2 text-xs font-mono rounded-lg transition-colors whitespace-nowrap ${
                  currentTab === tab.id ? "text-amber-400" : "text-zinc-500 hover:text-zinc-300"
                }`}>
                {currentTab === tab.id && (<motion.div layoutId="activeTab" className="absolute inset-0 bg-amber-500/10 border border-amber-500/20 rounded-lg" transition={{ type: "spring", stiffness: 400, damping: 30 }} />)}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      <div className="relative min-h-[400px] mt-6">
        <AnimatePresence mode="wait">
          {currentTab === "theory" && (<motion.div key="theory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>{theoryContent}</motion.div>)}
          {currentTab === "lab" && (<motion.div key="lab" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>{labContent}</motion.div>)}
          {currentTab === "math" && (<motion.div key="math" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>{mathContent}</motion.div>)}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TOPIC DEFINITIONS & CONTENT (FULL 14 TOPICS)
// ═══════════════════════════════════════════════════════════════════════════

type TopicId =
  | "portfolio-basics"
  | "efficient-frontier"
  | "sharpe-cal"
  | "capm"
  | "active-passive"
  | "information-ratio"
  | "fundamental-law"
  | "optimal-active"
  | "multifactor-models"
  | "value-at-risk"
  | "backtesting"
  | "performance-evaluation"
  | "behavioral-finance"
  | "ips-construction";

interface Topic { id: TopicId; title: string; subtitle: string; icon: React.ReactNode; accent: string; description: string; difficulty: string; }

const TOPICS: Topic[] = [
  { id: "portfolio-basics", title: "What is a Portfolio?", subtitle: "The Starting Point", icon: <PieChart className="w-5 h-5" />, accent: "amber", description: "Before diversification and formulas — understand what a portfolio actually IS and why mixing assets changes everything.", difficulty: "Beginner" },
  { id: "efficient-frontier", title: "The Efficient Frontier", subtitle: "Risk vs Return", icon: <TrendingUp className="w-5 h-5" />, accent: "cyan", description: "Build the frontier from scratch — plot two assets, mix them, watch correlation bend the line. The core of Markowitz.", difficulty: "Intermediate" },
  { id: "sharpe-cal", title: "Sharpe Ratio & CAL", subtitle: "Grading Your Portfolio", icon: <Zap className="w-5 h-5" />, accent: "amber", description: "Introduce the risk-free asset, draw the Capital Allocation Line, and find the maximum return per unit of risk.", difficulty: "Intermediate" },
  { id: "performance-evaluation", title: "Grading Ratios", subtitle: "Beyond Sharpe", icon: <Award className="w-5 h-5" />, accent: "amber", description: "Compare Treynor Ratio, M-Squared, and Jensen's Alpha to evaluate manager performance using systematic risk.", difficulty: "Intermediate" },
  { id: "capm", title: "CAPM", subtitle: "The Market's Price Tag", icon: <Shield className="w-5 h-5" />, accent: "emerald", description: "How does the market price risk? What's Beta? See the Security Market Line and learn why systematic risk matters.", difficulty: "Advanced" },
  { id: "behavioral-finance", title: "Behavioral Finance", subtitle: "Human Psychology", icon: <Brain className="w-5 h-5" />, accent: "rose", description: "Explore how cognitive errors and emotional biases like Loss Aversion and Overconfidence destroy rational investing.", difficulty: "Beginner" },
  { id: "multifactor-models", title: "Multifactor Models", subtitle: "Beyond CAPM", icon: <Layers className="w-5 h-5" />, accent: "cyan", description: "Explore Arbitrage Pricing Theory (APT) and how Macroeconomic, Fundamental, and Statistical models explain systematic risk.", difficulty: "Advanced" },
  { id: "active-passive", title: "Active vs Passive", subtitle: "The Great Debate", icon: <Activity className="w-5 h-5" />, accent: "cyan", description: "Should you try to beat the market or just buy the whole thing? Understand Alpha, indexing, and Tracking Error.", difficulty: "Beginner" },
  { id: "information-ratio", title: "Information Ratio", subtitle: "Grading Active Managers", icon: <Target className="w-5 h-5" />, accent: "amber", description: "The Sharpe Ratio measures total risk. The Information Ratio measures active risk. Learn how to grade a stock picker.", difficulty: "Intermediate" },
  { id: "fundamental-law", title: "Fundamental Law", subtitle: "The Math of Skill", icon: <BookOpen className="w-5 h-5" />, accent: "emerald", description: "Skill + Opportunities = Success. Grinold's Fundamental Law explains exactly what it takes to consistently beat the market.", difficulty: "Advanced" },
  { id: "optimal-active", title: "Optimal Active Risk", subtitle: "Portfolio Constraints", icon: <Crosshair className="w-5 h-5" />, accent: "rose", description: "How aggressive should an active manager be? Calculate exactly how much active risk maximizes your total portfolio return.", difficulty: "Advanced" },
  { id: "value-at-risk", title: "Value at Risk (VaR)", subtitle: "Measuring Downside", icon: <AlertTriangle className="w-5 h-5" />, accent: "rose", description: "Quantify the minimum expected loss over a specific period. Learn the Parametric, Historical, and Monte Carlo estimation methods.", difficulty: "Intermediate" },
  { id: "backtesting", title: "Backtesting & Simulation", subtitle: "Historical Testing", icon: <History className="w-5 h-5" />, accent: "amber", description: "Simulate strategy performance using historical data and identify major pitfalls like Look-Ahead and Survivorship bias.", difficulty: "Beginner" },
  { id: "ips-construction", title: "The IPS Builder", subtitle: "Client Constraints", icon: <FileText className="w-5 h-5" />, accent: "cyan", description: "Learn the RRTTLLU framework used to build an Investment Policy Statement for institutional and retail clients.", difficulty: "Beginner" },
];

const TOPIC_CONTENT: Partial<Record<TopicId, { theory: DepthExplanationProps; math?: React.ReactNode }>> = {
  "active-passive": {
    theory: {
      beginner: <p><strong>Active management</strong> seeks to add value by outperforming a passively managed benchmark portfolio. An appropriate benchmark should be representative, replicable at low cost, and have weights known beforehand. <strong>Passive investing</strong> accepts the benchmark return without deviating.</p>,
      intermediate: <p>Value added is measured by <strong>Active Return (R_A)</strong>. Active Return can be decomposed into <strong>Asset Allocation Return</strong> (deviations in asset class weights) and <strong>Security Selection Return</strong> (deviations of individual stock weights within a class). Overweighted securities have positive active weights, which across the portfolio must sum to zero.</p>,
      advanced: <p>The standard deviation of active returns is called <strong>Active Risk</strong> or <strong>Tracking Error (σ_A)</strong>. Active Risk is composed of <strong>Active Factor Risk</strong> (deviations in portfolio factor sensitivities vs the benchmark) and <strong>Active Specific Risk</strong> (deviations in individual asset weightings, controlling for factors). Thus, Active Risk² = Active Factor Risk + Active Specific Risk.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6 relative z-10 backdrop-blur-sm">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Active Return</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-lg font-mono text-zinc-200">R_A = <span className="text-amber-400">R_P</span> - <span className="text-cyan-400">R_B</span> = Σ (Δwᵢ × Rᵢ)</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm font-mono">
          <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-amber-400 block mb-1">R_P</span> Portfolio Return</div>
          <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-cyan-400 block mb-1">R_B</span> Benchmark Return</div>
          <div className="col-span-2 p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-emerald-400 block mb-1">Δwᵢ (Active Weight)</span> Weight in Portfolio minus Weight in Benchmark</div>
        </div>
      </motion.div>
    )
  },
  "information-ratio": {
    theory: {
      beginner: <p>The <strong>Information Ratio (IR)</strong> measures the reward per unit of active risk. It asks how much extra return a manager generated for every unit of risk taken by deviating from the index. A higher IR indicates a more efficient manager.</p>,
      intermediate: <p>IR differs from the <strong>Sharpe Ratio (SR)</strong>. SR measures excess return relative to the risk-free rate per unit of total risk. Adding cash to a portfolio halves both return and standard deviation, leaving SR unaffected, but it lowers active return while keeping active risk roughly the same, thus <strong>decreasing the IR</strong>.</p>,
      advanced: <p>There is a crucial distinction between <strong>Ex-Post IR</strong> (realized historical performance) and <strong>Ex-Ante IR</strong> (expected future performance). A <em>closet index fund</em> tracks the benchmark closely, yielding a Sharpe similar to the benchmark but very little active risk, often resulting in a negative ex-post IR after management fees.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Information Ratio</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-lg font-mono text-zinc-200">IR = <span className="text-amber-400">E(R_A)</span> / <span className="text-cyan-400">σ_A</span></p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm font-mono">
          <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-amber-400 block mb-1">E(R_A)</span> Expected Active Return</div>
          <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-cyan-400 block mb-1">σ_A</span> Tracking Error (Active Risk)</div>
        </div>
      </motion.div>
    )
  },
  "performance-evaluation": {
    theory: {
      beginner: <p>The Sharpe Ratio is famous, but it uses <strong>Total Risk</strong> (Standard Deviation). If a portfolio is already well-diversified, we only care about <strong>Systematic Risk</strong> (Beta). The <strong>Treynor Ratio</strong> and <strong>Jensen's Alpha</strong> grade managers based only on the market risk they took.</p>,
      intermediate: <p><strong>M-Squared (M²)</strong> is a brilliant metric that fixes a major problem with the Sharpe Ratio: Sharpe is just a raw number (like 0.8) that is hard to interpret. M² converts the Sharpe Ratio back into a percentage return by artificially leveraging or de-leveraging the portfolio so its volatility perfectly matches the market.</p>,
      advanced: <p><strong>Jensen's Alpha</strong> is the percentage of portfolio return that cannot be explained by CAPM. It is the intercept of the regression of excess portfolio returns against excess market returns. A positive, statistically significant Jensen's Alpha indicates true manager skill (after accounting for Beta).</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Treynor Ratio {"&"} Jensen's Alpha</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center space-y-4">
            <p className="text-lg font-mono text-zinc-200">Treynor = (<span className="text-amber-400">R_p</span> - <span className="text-emerald-400">R_f</span>) / <span className="text-cyan-400">β_p</span></p>
            <div className="w-full h-px bg-zinc-800"></div>
            <p className="text-lg font-mono text-zinc-200">Alpha (α) = <span className="text-amber-400">R_p</span> - [ <span className="text-emerald-400">R_f</span> + <span className="text-cyan-400">β_p</span>(R_m - R_f) ]</p>
          </div>
        </div>
        <div className="space-y-2 mt-6">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">M-Squared (M²)</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-lg font-mono text-zinc-200">M² = (<span className="text-amber-400">Sharpe_p</span> - <span className="text-cyan-400">Sharpe_m</span>) × <span className="text-emerald-400">σ_m</span></p>
          </div>
          <p className="text-xs text-zinc-500 text-center mt-2">Returns the risk-adjusted outperformance in percentage terms.</p>
        </div>
      </motion.div>
    )
  },
  "ips-construction": {
    theory: {
      beginner: <p>An <strong>Investment Policy Statement (IPS)</strong> is a written document that clearly sets out a client's return objectives and risk tolerance over their investment time horizon. It acts as the governing roadmap between the client and the portfolio manager.</p>,
      intermediate: <p>The core of an IPS is the constraint framework, easily remembered by the acronym <strong>RRTTLLU</strong>: Risk, Return, Time horizon, Taxes, Liquidity, Legal, and Unique circumstances. For example, a young worker has high liquidity from income (can take risk), while a retiree has high liquidity needs for living expenses (lower risk).</p>,
      advanced: <p>When establishing the "Risk" component, a manager must distinguish between <strong>Ability</strong> to take risk (objective financial capacity: wealth, age, income stability) and <strong>Willingness</strong> to take risk (subjective psychological comfort). If ability and willingness clash, the manager must always construct the portfolio based on the more conservative of the two.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">The RRTTLLU Framework</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4 font-mono text-sm">
            <div className="flex justify-between border-b border-zinc-800/50 pb-2"><span className="text-emerald-400 font-bold">Risk</span> <span className="text-zinc-400">Ability vs Willingness</span></div>
            <div className="flex justify-between border-b border-zinc-800/50 pb-2"><span className="text-emerald-400 font-bold">Return</span> <span className="text-zinc-400">Absolute vs Relative targets</span></div>
            <div className="flex justify-between border-b border-zinc-800/50 pb-2"><span className="text-amber-400 font-bold">Time Horizon</span> <span className="text-zinc-400">Single vs Multi-stage phases</span></div>
            <div className="flex justify-between border-b border-zinc-800/50 pb-2"><span className="text-rose-400 font-bold">Taxes</span> <span className="text-zinc-400">Taxable vs Tax-exempt</span></div>
            <div className="flex justify-between border-b border-zinc-800/50 pb-2"><span className="text-cyan-400 font-bold">Liquidity</span> <span className="text-zinc-400">Expected cash inflows/outflows</span></div>
            <div className="flex justify-between border-b border-zinc-800/50 pb-2"><span className="text-zinc-200 font-bold">Legal</span> <span className="text-zinc-400">Trust laws, ESG regulations</span></div>
            <div className="flex justify-between"><span className="text-purple-400 font-bold">Unique</span> <span className="text-zinc-400">Values, concentrated stock</span></div>
          </div>
        </div>
      </motion.div>
    )
  },
  "fundamental-law": {
    theory: {
      beginner: <p><strong>Grinold's Fundamental Law of Active Management</strong> separates expected value added into the manager's skill and the number of opportunities they have to apply that skill. A successful manager needs both forecasting accuracy and many independent bets.</p>,
      intermediate: <p>The unconstrained law states: <strong>IR = IC × √BR</strong>.<br /><br />• <strong>IC (Information Coefficient):</strong> Measures manager skill as the risk-weighted correlation between forecasted and actual active returns.<br />• <strong>BR (Breadth):</strong> The number of truly independent active bets taken per year.</p>,
      advanced: <p>In reality, short-selling restrictions or sector limits prevent managers from acting fully on their forecasts. This is captured by the <strong>Transfer Coefficient (TC)</strong>, which is the correlation between actual active weights and optimal active weights (TC ≤ 1). A long-only fund will lose significant skill purely to these constraints.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">The Constrained Fundamental Law</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-lg font-mono text-zinc-200">E(R_A) = <span className="text-rose-400">TC</span> × <span className="text-amber-400">IC</span> × <span className="text-emerald-400">√BR</span> × <span className="text-cyan-400">σ_A</span></p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm font-mono">
          <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-amber-400 block mb-1">IC (Skill)</span> Correlation of forecast vs actual</div>
          <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-emerald-400 block mb-1">BR (Breadth)</span> Independent bets per year</div>
        </div>
      </motion.div>
    )
  },
  "optimal-active": {
    theory: {
      beginner: <p><strong>Optimal Active Risk</strong> determines how much of an investor's wealth should be allocated to an active manager versus a passive benchmark to maximize the total portfolio's risk-adjusted returns.</p>,
      intermediate: <p>The optimal amount of active risk depends positively on the manager's skill (IR) and negatively on the benchmark's quality (Sharpe Ratio). If the benchmark is performing incredibly well (high SR), you mathematically should allocate less to the active manager.</p>,
      advanced: <p>When blending an active strategy with a passive index, the optimal active risk targets the exact point where the marginal contribution to active return equals the marginal penalty of active risk, optimizing the total portfolio Sharpe ratio to its absolute maximum limit.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Optimal Active Risk</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-lg font-mono text-zinc-200">σ_A* = (<span className="text-amber-400">IR</span> / <span className="text-cyan-400">SR_B</span>) × <span className="text-emerald-400">σ_B</span></p>
          </div>
        </div>
      </motion.div>
    )
  },
  "multifactor-models": {
    theory: {
      beginner: <p>Unlike the CAPM, which assumes returns are explained by a single market factor, <strong>Arbitrage Pricing Theory (APT)</strong> and multifactor models assume asset returns are driven by multiple systematic risk factors. APT does not require the market portfolio to be one of the factors.</p>,
      intermediate: <p>An APT equation adds up the asset's sensitivity (Beta) to various risk factors, multiplied by the risk premium for that specific factor. Unsystematic risk is assumed to be fully diversified away, meaning returns are purely a sum of factor exposures.</p>,
      advanced: <p>There are three main types of models: <br />1. <strong>Macroeconomic:</strong> Factors are <em>surprises</em> (realized minus expected) in GDP, inflation, etc.<br />2. <strong>Fundamental:</strong> Factors are rates of return on firm-specific attributes (P/E, Size). Sensitivities are standardized Z-scores.<br />3. <strong>Statistical:</strong> Uses Principal Component Analysis to find mystery factors explaining variance.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Arbitrage Pricing Theory (APT)</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-sm sm:text-lg font-mono text-zinc-200">E(R_P) = R_F + <span className="text-amber-400">β₁</span>(<span className="text-cyan-400">λ₁</span>) + ... + <span className="text-amber-400">βₖ</span>(<span className="text-cyan-400">λₖ</span>)</p>
          </div>
        </div>
      </motion.div>
    )
  },
  "value-at-risk": {
    theory: {
      beginner: <p><strong>Value at Risk (VaR)</strong> estimates the minimum loss that will occur with a given probability over a specified period. For example, a 5% monthly VaR of $1 million means there is a 5% probability that the portfolio will lose <em>at least</em> $1 million in any given month.</p>,
      intermediate: <p>There are three VaR estimation methods:<br />1. <strong>Parametric:</strong> Uses means, variances, and covariances, usually assuming a normal distribution.<br />2. <strong>Historical Simulation:</strong> Uses actual past daily changes to find the 5% worst historical loss.<br />3. <strong>Monte Carlo:</strong> Draws random risk factor changes from assumed distributions thousands of times.</p>,
      advanced: <p>VaR focuses only on a single threshold point. Extensions include:<br />• <strong>CVaR (Expected Shortfall):</strong> The expected average loss <em>given</em> that the loss exceeds the VaR threshold.<br />• <strong>Incremental VaR (IVaR):</strong> The change in VaR from altering a single position's weight.<br />• <strong>Relative VaR:</strong> The VaR of the difference between portfolio and benchmark returns.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Parametric VaR</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-lg font-mono text-zinc-200">VaR = [ <span className="text-amber-400">μ_P</span> - (<span className="text-rose-400">z</span> × <span className="text-cyan-400">σ_P</span>) ] × <span className="text-emerald-400">Portfolio Value</span></p>
          </div>
        </div>
        <p className="text-xs text-zinc-500 text-center">z = 1.65 for 5% VaR (95% Confidence). z = 2.33 for 1% VaR (99% Confidence).</p>
      </motion.div>
    )
  },
  "backtesting": {
    theory: {
      beginner: <p><strong>Backtesting</strong> uses historical data to simulate the performance of an investment strategy prior to actual investment. The goal is to assess risk and return trade-offs by mimicking how the strategy would have behaved in reality.</p>,
      intermediate: <p>The process involves Strategy Design, Historical Simulation, and Analysis. Modern backtesting relies on a <strong>rolling-window</strong> (walk-forward) approach, where trade signals are periodically re-calibrated and the portfolio rebalanced to strictly mimic real-world deployment without looking into the future.</p>,
      advanced: <p>Major pitfalls in backtesting include:<br />• <strong>Survivorship Bias:</strong> Using datasets that only include companies still existing today, artificially inflating past returns.<br />• <strong>Look-Ahead Bias:</strong> Using financial data that was not actually published or available on the simulated trade date.<br />• <strong>Data Snooping:</strong> Testing thousands of rules until one works by pure statistical luck, leading to poor real-world performance.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Evaluation Metrics</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center space-y-4">
            <p className="text-lg font-mono text-zinc-200">Hit Rate = <span className="text-emerald-400">Winning Trades</span> / <span className="text-zinc-400">Total Trades</span></p>
            <div className="w-full h-px bg-zinc-800"></div>
            <p className="text-sm sm:text-lg font-mono text-zinc-200">Max Drawdown = (<span className="text-rose-400">Trough Value</span> - <span className="text-amber-400">Peak Value</span>) / <span className="text-amber-400">Peak Value</span></p>
          </div>
        </div>
      </motion.div>
    )
  },
  "behavioral-finance": {
    theory: {
      beginner: <p><strong>Behavioral Finance</strong> challenges the traditional assumption that investors are fully rational. It integrates psychology and economics to explain why people make suboptimal financial decisions driven by cognitive biases and emotions.</p>,
      intermediate: <p>Key biases include: <strong>Loss Aversion</strong> (losses feel twice as painful as equivalent gains), <strong>Overconfidence</strong> (overestimating your own ability to pick stocks), <strong>Anchoring</strong> (relying too heavily on the first piece of information seen), and <strong>Herding</strong> (blindly following the crowd).</p>,
      advanced: <p><strong>Kahneman and Tversky's Prospect Theory</strong> replaced the classical Utility Theory model. It describes a value function that is concave for gains (risk-averse) and convex for losses (risk-seeking), with a reference-point dependent on current wealth. This explains why investors hold losing stocks too long (hoping to break-even) and sell winners too early (locking in gains).</p>
    }
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE LABS
// ═══════════════════════════════════════════════════════════════════════════

function BehavioralFinanceLab() {
  const [step, setStep] = useState(0);
  const [choice1, setChoice1] = useState<"A" | "B" | null>(null);
  const [choice2, setChoice2] = useState<"A" | "B" | null>(null);

  const prospectData = [
    { loss: -1000, utility: -2.25 }, { loss: -500, utility: -1.5 }, { loss: 0, utility: 0 },
    { loss: 500, utility: 0.8 }, { loss: 1000, utility: 1.1 }
  ];

  return (
    <motion.div variants={fadeUp} className="max-w-3xl mx-auto bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-sm">
      <div className="flex justify-between items-center border-b border-zinc-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-zinc-100">The Prospect Theory Test</h2>
          <p className="text-xs text-zinc-500 font-mono mt-1">Kahneman {"&"} Tversky (1979)</p>
        </div>
        <div className="text-xs font-mono text-amber-500/80 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Stage {step + 1} / 3
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 text-center space-y-2">
              <span className="text-3xl block">💰</span>
              <p className="text-zinc-300 font-mono">You have been given <span className="text-emerald-400 font-bold">$1,000</span>.</p>
              <p className="text-sm text-zinc-500">You must now choose one of the following options:</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <button onClick={() => { setChoice1("A"); setStep(1); }} className="group relative p-6 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-amber-500/50 transition-colors text-left overflow-hidden">
                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors" />
                <span className="text-amber-400 font-bold font-mono block mb-2">Option A</span>
                <p className="text-sm text-zinc-300">A <strong>100% chance</strong> to gain an additional $500.</p>
              </button>
              <button onClick={() => { setChoice1("B"); setStep(1); }} className="group relative p-6 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-cyan-500/50 transition-colors text-left overflow-hidden">
                <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors" />
                <span className="text-cyan-400 font-bold font-mono block mb-2">Option B</span>
                <p className="text-sm text-zinc-300">A <strong>50% chance</strong> to gain $1,000 and a <strong>50% chance</strong> to gain $0.</p>
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-5 text-center space-y-2">
              <span className="text-3xl block">💸</span>
              <p className="text-zinc-300 font-mono">You have been given <span className="text-emerald-400 font-bold">$2,000</span>.</p>
              <p className="text-sm text-zinc-500">You must now choose one of the following options:</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <button onClick={() => { setChoice2("A"); setStep(2); }} className="group relative p-6 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-amber-500/50 transition-colors text-left overflow-hidden">
                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors" />
                <span className="text-amber-400 font-bold font-mono block mb-2">Option A</span>
                <p className="text-sm text-zinc-300">A <strong>100% chance</strong> to lose $500.</p>
              </button>
              <button onClick={() => { setChoice2("B"); setStep(2); }} className="group relative p-6 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-cyan-500/50 transition-colors text-left overflow-hidden">
                <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors" />
                <span className="text-cyan-400 font-bold font-mono block mb-2">Option B</span>
                <p className="text-sm text-zinc-300">A <strong>50% chance</strong> to lose $1,000 and a <strong>50% chance</strong> to lose $0.</p>
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="text-center space-y-2 mb-6">
              <h3 className="text-2xl font-bold font-mono text-zinc-100">The Diagnosis</h3>
              <p className="text-sm text-zinc-400">Mathematical Reality vs. Human Psychology</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">The Math</p>
                <p className="text-sm text-zinc-300">In both scenarios, the Expected Value of Option A and Option B is mathematically identical (<span className="text-emerald-400 font-bold">$1,500</span> total wealth).</p>
                <p className="text-sm text-zinc-300">Traditional finance dictates that a rational investor should have picked the exact same option (either A/A or B/B) both times.</p>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 space-y-4">
                <p className="text-[10px] font-mono text-amber-500/70 uppercase tracking-widest border-b border-amber-500/20 pb-2">Your Choices</p>
                <p className="text-sm text-zinc-300">If you chose <span className="text-amber-400 font-bold">A</span> in the first game and <span className="text-cyan-400 font-bold">B</span> in the second, you exhibit <strong>Loss Aversion</strong>.</p>
                <p className="text-xs text-zinc-400">Like 80% of humans, you are <em>risk-averse</em> when facing gains (locking in the $500), but <em>risk-seeking</em> when facing losses (gambling to avoid losing anything).</p>
              </div>
            </div>

            <div className="h-[250px] w-full mt-6">
              <p className="text-center text-xs font-mono text-zinc-500 mb-2">The Prospect Theory Value Curve</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prospectData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <ReferenceLine y={0} stroke="#52525b" />
                  <ReferenceLine x={0} stroke="#52525b" />
                  <XAxis dataKey="loss" type="number" domain={[-1000, 1000]} hide />
                  <YAxis domain={[-3, 3]} hide />
                  <Line type="monotone" dataKey="utility" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: "#f59e0b" }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-between text-[10px] font-mono text-zinc-600 px-4 mt-1">
                <span>Losses hurt more ↓</span>
                <span>Gains feel good ↑</span>
              </div>
            </div>

            <button onClick={() => { setStep(0); setChoice1(null); setChoice2(null); }} className="w-full py-3 mt-4 text-xs font-mono text-zinc-400 bg-zinc-950 border border-zinc-800 rounded-xl hover:text-zinc-200 transition-colors">
              Restart Simulation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PortfolioBasicsLab({ onBack }: { onBack: () => void }) {
  const [w, setW] = useState(50);
  const w1 = w / 100;
  const ret = calcPortfolioReturn(w1);
  const risk = calcPortfolioRisk(w1, 0.3);

  const theory = (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
      <h2 className="text-lg font-bold font-mono text-zinc-100">A portfolio is just a basket.</h2>
      <p className="text-sm text-zinc-400 leading-relaxed">
        Imagine you have ₹1,00,000 to invest. You could put it all in stocks (risky but exciting) or all in fixed deposits (safe but boring). Or — you could split it. That split IS your portfolio. The moment you own more than one asset, you have a portfolio.
      </p>
      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-4 flex items-start gap-3">
        <span className="text-xl mt-0.5">💡</span>
        <p className="text-xs text-zinc-500 leading-relaxed">
          <span className="text-amber-400 font-bold">Key insight:</span> The portfolio's risk is NOT the average of the individual risks. It can actually be LOWER than either asset alone — if the assets don't move in lockstep.
        </p>
      </div>
    </div>
  );

  const math = (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Expected Return</h3>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
          <p className="text-lg font-mono text-zinc-200">E(Rₚ) = <span className="text-amber-400">w₁R₁</span> + <span className="text-cyan-400">w₂R₂</span></p>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Portfolio Risk (Variance)</h3>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-lg font-mono text-zinc-200">σ²ₚ = <span className="text-amber-400">w₁²σ₁²</span> + <span className="text-cyan-400">w₂²σ₂²</span> + 2(w₁)(w₂)(σ₁)(σ₂)<span className="text-emerald-400">ρ₁₂</span></p>
        </div>
        <p className="text-xs text-zinc-500 text-center mt-2">Where ρ₁₂ is the correlation coefficient between the two assets.</p>
      </div>
    </div>
  );

  const lab = (
    <div className="grid sm:grid-cols-2 gap-5">
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Your ₹1,00,000 Split</p>
        <SliderInput label="Equity %" hint={`Debt: ${100 - w}%`} min={0} max={100} step={5} value={w} onChange={setW} accent="amber" />
        <div className="flex h-10 rounded-lg overflow-hidden border border-zinc-800">
          <motion.div animate={{ width: `${w}%` }} transition={{ type: "spring", stiffness: 200, damping: 25 }} className="bg-amber-500/20 border-r border-amber-500/30 flex items-center justify-center">
            {w >= 20 && <span className="text-[10px] font-mono text-amber-400 font-bold">Equity {w}%</span>}
          </motion.div>
          <motion.div animate={{ width: `${100 - w}%` }} transition={{ type: "spring", stiffness: 200, damping: 25 }} className="bg-cyan-500/10 flex items-center justify-center">
            {100 - w >= 20 && <span className="text-[10px] font-mono text-cyan-400 font-bold">Debt {100 - w}%</span>}
          </motion.div>
        </div>
      </div>
      <div className="space-y-3">
        <StatCard label="Portfolio Return" value={`${ret.toFixed(1)}%`} accent="amber" sub="weighted average" />
        <StatCard label="Portfolio Risk" value={`${risk.toFixed(1)}%`} accent={risk > 15 ? "rose" : "emerald"} sub="NOT a simple average" />
      </div>
    </div>
  );

  return <TopicDashboard title="What is a Portfolio?" tag="Concept" onBack={onBack} defaultTab="lab" theoryContent={theory} mathContent={math} labContent={lab} />;
}

function SharpeCALLab({ onBack }: { onBack: () => void }) {
  const [w, setW] = useState(50);
  const [rho, setRho] = useState(0.3);
  const w1 = w / 100;
  const ret = calcPortfolioReturn(w1);
  const risk = calcPortfolioRisk(w1, rho);
  const sharpe = calcSharpe(ret, risk);
  const frontier = useMemo(() => generateFrontier(rho), [rho]);
  const cal = useMemo(() => generateCAL(rho), [rho]);
  const tw = useMemo(() => findTangencyW(rho), [rho]);
  const tSharpe = calcSharpe(calcPortfolioReturn(tw), calcPortfolioRisk(tw, rho));
  const isOptimal = Math.abs(w1 - tw) < 0.025;
  const userDot = [{ risk, ret }];
  const rfDot = [{ risk: 0.15, ret: RF_RATE }];
  const tangencyDot = [{ risk: calcPortfolioRisk(tw, rho), ret: calcPortfolioReturn(tw) }];

  const theory = (
    <DepthExplanation
      beginner={<p>Two portfolios can have the same return — but one takes way more risk. The <span className="text-amber-400 font-bold">Sharpe Ratio</span> tells you how much EXTRA return you get per unit of risk, above the risk-free rate.</p>}
      intermediate={<p>The <strong>Capital Allocation Line (CAL)</strong> represents portfolios formed by mixing a risk-free asset with a risky portfolio. The Sharpe ratio is exactly the mathematical slope of the CAL. You want the steepest line possible.</p>}
      advanced={<p>While Sharpe is industry standard, it mathematically penalizes upside volatility just as much as downside volatility. For asymmetric return distributions (like hedge funds or options strategies), the <strong>Sortino ratio</strong> (using only downside deviation) is often heavily preferred by institutional allocators.</p>}
    />
  );

  const math = (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">The Formula</h3>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
          <p className="text-lg font-mono text-zinc-200">Sharpe Ratio = <span className="text-amber-400">(Rₚ - R_f)</span> / <span className="text-cyan-400">σₚ</span></p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm font-mono">
        <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-amber-400 block mb-1">Rₚ</span> Portfolio Expected Return</div>
        <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-zinc-400 block mb-1">R_f</span> Risk-Free Rate</div>
        <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-cyan-400 block mb-1">σₚ</span> Portfolio Standard Deviation</div>
      </div>
    </div>
  );

  const lab = (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Find the Tangency Portfolio</p>
        <SliderInput label="Equity Weight" hint={`Debt: ${100 - w}%`} min={0} max={100} step={1} value={w} onChange={setW} accent="amber" />
        <SliderInput label="Correlation (ρ)" hint="Changes the frontier shape" min={-1} max={1} step={0.1} value={rho} onChange={setRho} accent="cyan" suffix="" />
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-800">
          <StatCard label="Sharpe Ratio" value={sharpe.toFixed(3)} accent={isOptimal ? "amber" : "cyan"} glow={isOptimal} sub={isOptimal ? "✦ Optimal!" : "Keep sliding"} />
          <StatCard label="Max Sharpe" value={tSharpe.toFixed(3)} accent="zinc" sub={`at ${(tw * 100).toFixed(0)}% equity`} />
        </div>
      </div>

      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Efficient Frontier + CAL</p>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
            <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
            <XAxis type="number" dataKey="risk" domain={[0, 24]} tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }} tickFormatter={(v: number) => `${v}%`} />
            <YAxis type="number" dataKey="ret" domain={[2, 20]} tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }} tickFormatter={(v: number) => `${v}%`} width={42} />
            <Tooltip content={<ChartTooltip />} />
            <Scatter name="Frontier" data={frontier} fill="#52525b" r={1.5} line={{ stroke: "#71717a", strokeWidth: 1.5 }} lineType="fitting" />
            <Scatter name="CAL" data={cal} fill="none" r={0} line={{ stroke: "#f59e0b", strokeWidth: 2 }} lineType="fitting" />
            <Scatter name="Risk-Free" data={rfDot} fill="#34d399" r={9} />
            <Scatter name="Tangency" data={tangencyDot} fill="none" r={0} shape={(p: any) => (<g><circle cx={p.cx} cy={p.cy} r={10} fill="#f59e0b" opacity={0.12} /><circle cx={p.cx} cy={p.cy} r={6} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 2" /><circle cx={p.cx} cy={p.cy} r={2.5} fill="#f59e0b" /></g>)} />
            <Scatter name="You" data={userDot} fill="#fbbf24" r={6} shape={(p: any) => (<g><circle cx={p.cx} cy={p.cy} r={8} fill="#fbbf24" opacity={0.2} /><circle cx={p.cx} cy={p.cy} r={5} fill="#fbbf24" stroke="#fef3c7" strokeWidth={1.5} /></g>)} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return <TopicDashboard title="Sharpe Ratio & CAL" tag="Advanced Concept" onBack={onBack} defaultTab="lab" theoryContent={theory} mathContent={math} labContent={lab} />;
}

function CAPMLab({ onBack }: { onBack: () => void }) {
  const [beta, setBeta] = useState(1.0);
  const expectedReturn = capmExpectedReturn(beta);
  const sml = useMemo(() => generateSML(), []);
  const userDot = [{ beta, ret: expectedReturn }];
  const marketDot = [{ beta: 1, ret: MKT_RETURN }];
  const rfDot = [{ beta: 0, ret: RF_RATE }];

  const theory = (
    <DepthExplanation
      beginner={<p>If a stock swings twice as much as the market, it should earn more — because you're taking more risk. <span className="text-emerald-400 font-bold">Beta (β)</span> measures that swing. β=1 means it moves WITH the market. β=2 means it swings twice as hard.</p>}
      intermediate={<p>The CAPM separates risk into two buckets: <strong>Systematic</strong> (Market-wide risk) and <strong>Unsystematic</strong> (Company-specific risk). Because you can diversify away specific risk for free by holding many stocks, the market will ONLY compensate you for holding Systematic risk (Beta).</p>}
      advanced={<p>CAPM is elegant but relies on strict theoretical assumptions: homogeneous investor expectations, frictionless markets, and single-period horizons. In reality, <strong>Roll's Critique</strong> argues the true "Market Portfolio" is unobservable, making true Beta impossible to calculate perfectly.</p>}
    />
  );

  const math = (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">The CAPM Formula</h3>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-lg font-mono text-zinc-200">E(Rᵢ) = <span className="text-emerald-400">R_f</span> + <span className="text-amber-400">βᵢ</span> × <span className="text-cyan-400">[E(R_m) - R_f]</span></p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm font-mono">
        <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-emerald-400 block mb-1">R_f</span> Risk-Free Rate</div>
        <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-amber-400 block mb-1">βᵢ</span> Asset Beta (Systematic Risk)</div>
        <div className="col-span-2 p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-cyan-400 block mb-1">[E(R_m) - R_f]</span> Market Risk Premium</div>
      </div>
    </div>
  );

  const lab = (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Adjust Beta</p>
        <SliderInput label="Beta (β)" min={0} max={2.5} step={0.1} value={beta} onChange={setBeta} accent="emerald" suffix="" />
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-800">
          <StatCard label="Expected Return" value={`${expectedReturn.toFixed(1)}%`} accent="emerald" />
          <StatCard label="Risk Premium" value={`${(beta * (MKT_RETURN - RF_RATE)).toFixed(1)}%`} accent="amber" />
        </div>
      </div>

      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Security Market Line (SML)</p>
        <ResponsiveContainer width="100%" height={200}>
          <ScatterChart margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
            <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
            <XAxis type="number" dataKey="beta" domain={[0, 2.5]} tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }} />
            <YAxis type="number" dataKey="ret" domain={[0, 25]} tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }} tickFormatter={(v: number) => `${v}%`} width={42} />
            <Tooltip content={<ChartTooltip />} />
            <Scatter name="SML" data={sml} fill="none" r={0} line={{ stroke: "#34d399", strokeWidth: 2 }} lineType="fitting" />
            <Scatter name="Rf" data={rfDot} fill="#34d399" r={8} />
            <Scatter name="Market" data={marketDot} fill="#22d3ee" r={8} />
            <Scatter name="Your β" data={userDot} fill="#fbbf24" r={7} shape={(p: any) => (<g><circle cx={p.cx} cy={p.cy} r={9} fill="#fbbf24" opacity={0.2} /><circle cx={p.cx} cy={p.cy} r={5} fill="#fbbf24" stroke="#fef3c7" strokeWidth={1.5} /></g>)} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return <TopicDashboard title="CAPM — The Market's Price Tag" tag="Advanced" onBack={onBack} defaultTab="lab" theoryContent={theory} mathContent={math} labContent={lab} />;
}

function EfficientFrontierLab({ onBack }: { onBack: () => void }) {
  const cloud = useMemo(() => generateCloudPortfolios(3, 2000), []);
  const frontier = useMemo(() => extractParetoFrontier(cloud), [cloud]);

  const theory = (
    <DepthExplanation
      beginner={<p>Markowitz proved you must look at how assets move <em>together</em>. Mixing assets creates portfolios with lower risk than any individual asset.</p>}
      intermediate={<p>The random cloud of portfolios has a top-left edge: the <strong>Efficient Frontier</strong>. Anything inside the cloud is mathematically inferior.</p>}
      advanced={<p>The frontier solves a quadratic programming problem. However, it is highly sensitive to input errors, resulting in extreme "corner" portfolios.</p>}
    />
  );

  const lab = (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
      <div className="flex justify-between items-end mb-2">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Markowitz Frontier (Tech, Value, Bonds)</p>
        <div className="text-xs font-mono text-cyan-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          2,000 Simulations
        </div>
      </div>
      <ResponsiveContainer width="100%" height={450}>
        <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
          <XAxis type="number" dataKey="risk" domain={[0, 25]} name="Risk" tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }} tickFormatter={(v) => `${v}%`} />
          <YAxis type="number" dataKey="ret" domain={[0, 16]} name="Return" tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }} tickFormatter={(v) => `${v}%`} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltip />} />
          <Scatter name="Portfolios" data={cloud} fill="#52525b" opacity={0.3} r={2.5} />
          <Line name="Frontier Edge" data={frontier} dataKey="ret" type="monotone" stroke="#06b6d4" strokeWidth={4} dot={false} strokeLinecap="round" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );

  return <TopicDashboard title="The Efficient Frontier" tag="Intermediate" onBack={onBack} defaultTab="lab" theoryContent={theory} labContent={lab} />;
}

function GenericInfoLab({ id, onBack }: { id: TopicId, onBack: () => void }) {
  const topic = TOPICS.find(t => t.id === id);
  const content = TOPIC_CONTENT[id];

  if (!topic) return null;

  const theoryContent = content?.theory
    ? <DepthExplanation {...content.theory} />
    : <p className="text-zinc-400 p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">Theory content currently being drafted...</p>;

  if (id === "behavioral-finance") {
    return <TopicDashboard title={topic.title} tag={topic.difficulty} onBack={onBack} defaultTab="lab" theoryContent={theoryContent} labContent={<BehavioralFinanceLab />} />;
  }

  return <TopicDashboard title={topic.title} tag={topic.difficulty} onBack={onBack} defaultTab="theory" theoryContent={theoryContent} mathContent={content?.math} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// TOPIC CARD
// ═══════════════════════════════════════════════════════════════════════════

function TopicCard({ topic, completed, index, onClick }: { topic: Topic; completed: boolean; index: number; onClick: () => void }) {
  const accentMap: Record<string, { border: string; bg: string; text: string }> = {
    amber: { border: "border-amber-500/25", bg: "bg-amber-500/5", text: "text-amber-400" },
    cyan: { border: "border-cyan-500/25", bg: "bg-cyan-500/5", text: "text-cyan-400" },
    emerald: { border: "border-emerald-500/25", bg: "bg-emerald-500/5", text: "text-emerald-400" },
    rose: { border: "border-rose-500/25", bg: "bg-rose-500/5", text: "text-rose-400" },
  };
  const a = accentMap[topic.accent] ?? accentMap.amber;

  return (
    <motion.div custom={index} variants={fadeUp} initial="hidden" animate="visible" className="relative z-10">
      <motion.button
        whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} onClick={onClick}
        className={`group w-full text-left relative rounded-2xl border overflow-hidden transition-all duration-300 ${a.border} bg-zinc-900/60 backdrop-blur-md hover:shadow-[0_0_32px_-8px_rgba(245,158,11,0.12)] cursor-pointer`}
      >
        <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${topic.accent === "cyan" ? "via-cyan-500/40" : topic.accent === "emerald" ? "via-emerald-500/40" : topic.accent === "rose" ? "via-rose-500/40" : "via-amber-500/40"} to-transparent`} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${a.bg} border ${a.border} ${a.text}`}>{topic.icon}</div>
            <div className="flex items-center gap-2">
              {completed && (<span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/8 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Done</span>)}
              <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${a.border} ${a.bg} ${a.text}`}>{topic.difficulty}</span>
            </div>
          </div>
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{topic.subtitle}</p>
          <h3 className="text-lg font-bold font-mono text-zinc-100 mb-2">{topic.title}</h3>
          <p className="text-sm text-zinc-500 leading-relaxed mb-4">{topic.description}</p>
          <div className={`inline-flex items-center gap-2 text-sm font-mono font-semibold ${a.text} group-hover:gap-3 transition-all`}>
            <span>Explore</span><ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default function PortfolioHub() {
  const [activeTopic, setActiveTopic] = useState<TopicId | null>(null);
  const [completed, setCompleted] = useState<Set<TopicId>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const markDone = (id: TopicId) => setCompleted((prev) => new Set(prev).add(id));
  const handleBack = (id: TopicId) => { markDone(id); setActiveTopic(null); };

  const filteredTopics = TOPICS.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()) || t.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pureInfoTopics = [
    "active-passive", "information-ratio", "fundamental-law", "optimal-active",
    "multifactor-models", "value-at-risk", "backtesting",
    "performance-evaluation", "ips-construction", "behavioral-finance"
  ];

  if (activeTopic) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 py-8 px-5 relative overflow-hidden" style={{ fontFamily: "var(--font-mono, 'JetBrains Mono'), 'Fira Mono', monospace" }}>
        <FloatingFormulaBackground formulas={PM_FORMULAS} balloonColors={PM_BALLOON_COLORS} density={12} />

        <AnimatePresence mode="wait">
          {activeTopic === "portfolio-basics" && <PortfolioBasicsLab key="pb" onBack={() => handleBack("portfolio-basics")} />}
          {activeTopic === "sharpe-cal" && <SharpeCALLab key="sc" onBack={() => handleBack("sharpe-cal")} />}
          {activeTopic === "capm" && <CAPMLab key="capm" onBack={() => handleBack("capm")} />}
          {activeTopic === "efficient-frontier" && <EfficientFrontierLab key="ef" onBack={() => handleBack("efficient-frontier")} />}

          {pureInfoTopics.includes(activeTopic) && (
            <GenericInfoLab key={activeTopic} id={activeTopic} onBack={() => handleBack(activeTopic)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden" style={{ fontFamily: "var(--font-mono, 'JetBrains Mono'), 'Fira Mono', monospace" }}>
      <FloatingFormulaBackground formulas={PM_FORMULAS} balloonColors={PM_BALLOON_COLORS} density={12} />

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3"><div className="h-[1px] w-8 bg-amber-500/40" /><span className="text-[10px] font-mono text-amber-500/70 uppercase tracking-widest">Portfolio Management</span></div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">Pick a concept. Any concept.</h1>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div animate={{ width: `${(completed.size / TOPICS.length) * 100}%` }} transition={{ type: "spring", stiffness: 200, damping: 25 }} className="h-full bg-amber-500 rounded-full" />
            </div>
            <span className="text-[10px] font-mono text-zinc-600">{completed.size}/{TOPICS.length} explored</span>
          </div>
          <div className="relative max-w-md mt-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input type="text" placeholder="Search concepts (e.g., Active, Sharpe)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 font-mono focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-600" />
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 relative z-10">
          <AnimatePresence>
            {filteredTopics.map((topic, i) => (
              <TopicCard key={topic.id} topic={topic} completed={completed.has(topic.id)} index={i} onClick={() => setActiveTopic(topic.id)} />
            ))}
          </AnimatePresence>
        </div>

        {filteredTopics.length === 0 && (<div className="text-center py-12 text-zinc-600 font-mono text-sm relative z-10">No topics found matching "{searchQuery}".</div>)}
        <p className="text-center text-[10px] text-zinc-700 mt-12 font-mono relative z-10">Fintastic Lab · Portfolio Management · fintasticlab.in</p>
      </div>
    </div>
  );
}

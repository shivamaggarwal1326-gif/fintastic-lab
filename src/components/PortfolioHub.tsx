"use client";

import React, { useState, useMemo, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposedChart, ScatterChart, Scatter, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";
import {
  ArrowLeft, ArrowRight, PieChart, TrendingUp, Shield, Zap,
  CheckCircle2, Search, Activity, Target, BookOpen, Crosshair,
  Layers, AlertTriangle, History, Brain, FileText, Award, HelpCircle,
  Lightbulb, BookMarked, X, ChevronLeft
} from "lucide-react";

import { GLOSSARY_TERMS } from './GLOSSARY_TERMS';

const GlossaryContext = createContext<(term: string) => void>(() => {});

function Term({ id, children, colorClass = "text-amber-400" }: { id: string, children: React.ReactNode, colorClass?: string }) {
  const openGlossary = useContext(GlossaryContext);
  return (
    <span
      onClick={(e) => { e.stopPropagation(); openGlossary(id); }}
      className={`cursor-pointer border-b border-dashed border-current hover:bg-zinc-800/50 rounded px-0.5 transition-colors ${colorClass}`}
      title="Click for definition"
    >
      {children}
    </span>
  );
}

function ElegantBackground() {
  const elements = useMemo(() => {
    const symbols = ["α", "β", "SR", "IR", "WACC", "CAPM", "σ²", "E(R)", "ρ", "M²", "VaR", "15%"];
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] opacity-30 mix-blend-screen" />
      {elements.map((el) => (
        <motion.div key={el.id} className="absolute font-mono font-bold select-none text-zinc-500/10" initial={{ x: `${el.x}vw`, y: "110vh", scale: el.scale }} animate={{ y: "-10vh", rotate: [0, 15, -15, 0] }} transition={{ y: { duration: el.duration, repeat: Infinity, ease: "linear", delay: el.delay }, rotate: { duration: el.duration * 0.8, repeat: Infinity, ease: "easeInOut" } }} style={{ fontSize: `${el.scale * 3.5}rem`, filter: `blur(${el.scale > 0.8 ? 0 : 3}px)` }}>{el.text}</motion.div>
      ))}
    </div>
  );
}

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
    if (p.ret >= maxRet + 0.02) { frontier.push(p); maxRet = p.ret; }
  }
  return frontier;
}

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
  analogy?: string | React.ReactNode;
}

function DepthExplanation({ beginner, intermediate, advanced, analogy }: DepthExplanationProps) {
  const [depth, setDepth] = useState<DepthLevel>("beginner");

  return (
    <div className="space-y-6">
      {analogy && (
        <motion.div variants={fadeUp} className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-5 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-amber-400 mb-1">Concept Analogy</h3>
            <div className="text-sm text-zinc-300 leading-relaxed">{analogy}</div>
          </div>
        </motion.div>
      )}

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
    </div>
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

function QuestionsTab({ questions }: { questions: { q: string; a: string }[] }) {
  return (
    <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <HelpCircle className="w-6 h-6 text-amber-400" />
        <h2 className="text-lg font-bold font-mono text-zinc-100">Exam Prep {"&"} Practice</h2>
      </div>
      <div className="space-y-4">
        {questions.map((item, idx) => (
          <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
            <p className="text-sm font-bold text-zinc-200 mb-3">Q: {item.q}</p>
            <div className="pl-4 border-l-2 border-amber-500/50">
              <p className="text-sm text-zinc-400 leading-relaxed"><strong>Ans:</strong> {item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

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
  const content = TOPIC_CONTENT["portfolio-basics"];

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

  return <TopicDashboard title="What is a Portfolio?" tag="Concept" onBack={onBack} defaultTab="lab" theoryContent={content ? <DepthExplanation {...content.theory} /> : null} questions={content?.questions} mathContent={content?.math} labContent={lab} />;
}

function SharpeCALLab({ onBack }: { onBack: () => void }) {
  const [w, setW] = useState(50);
  const [rho, setRho] = useState(0.3);
  const w1 = w / 100;
  const ret = calcPortfolioReturn(w1);
  const risk = calcPortfolioRisk(w1, rho);
  const sharpe = calcSharpe(ret, risk);
  const content = TOPIC_CONTENT["sharpe-cal"];

  const frontier = useMemo(() => generateFrontier(rho), [rho]);
  const cal = useMemo(() => generateCAL(rho), [rho]);
  const tw = useMemo(() => findTangencyW(rho), [rho]);
  const tSharpe = calcSharpe(calcPortfolioReturn(tw), calcPortfolioRisk(tw, rho));
  const isOptimal = Math.abs(w1 - tw) < 0.025;

  const userDot = [{ risk, ret }];
  const rfDot = [{ risk: 0.15, ret: RF_RATE }];
  const tangencyDot = [{ risk: calcPortfolioRisk(tw, rho), ret: calcPortfolioReturn(tw) }];

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

  return <TopicDashboard title="Sharpe Ratio & CAL" tag="Advanced Concept" onBack={onBack} defaultTab="lab" theoryContent={content ? <DepthExplanation {...content.theory} /> : null} questions={content?.questions} mathContent={content?.math} labContent={lab} />;
}

function CAPMLab({ onBack }: { onBack: () => void }) {
  const [beta, setBeta] = useState(1.0);
  const expectedReturn = capmExpectedReturn(beta);
  const content = TOPIC_CONTENT["capm"];

  const sml = useMemo(() => generateSML(), []);
  const userDot = [{ beta, ret: expectedReturn }];
  const marketDot = [{ beta: 1, ret: MKT_RETURN }];
  const rfDot = [{ beta: 0, ret: RF_RATE }];

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

  return <TopicDashboard title="CAPM — The Market's Price Tag" tag="Advanced" onBack={onBack} defaultTab="lab" theoryContent={content ? <DepthExplanation {...content.theory} /> : null} questions={content?.questions} mathContent={content?.math} labContent={lab} />;
}

function EfficientFrontierLab({ onBack }: { onBack: () => void }) {
  const cloud = useMemo(() => generateCloudPortfolios(3, 2000), []);
  const frontier = useMemo(() => extractParetoFrontier(cloud), [cloud]);
  const content = TOPIC_CONTENT["efficient-frontier"];

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

  return <TopicDashboard title="The Efficient Frontier" tag="Intermediate" onBack={onBack} defaultTab="lab" theoryContent={content ? <DepthExplanation {...content.theory} /> : null} questions={content?.questions} mathContent={content?.math} labContent={lab} />;
}

type TabId = "theory" | "lab" | "math" | "questions";

interface TopicDashboardProps {
  title: string;
  tag: string;
  onBack: () => void;
  theoryContent: React.ReactNode;
  labContent?: React.ReactNode;
  mathContent?: React.ReactNode;
  questions?: { q: string; a: string }[];
  defaultTab?: TabId;
}

function TopicDashboard({ title, tag, onBack, theoryContent, labContent, mathContent, questions, defaultTab = "theory" }: TopicDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  const tabs = [
    { id: "theory", label: "Core Concept", available: !!theoryContent },
    { id: "lab", label: "Interactive Lab", available: !!labContent },
    { id: "math", label: "Math & Formulae", available: !!mathContent },
    { id: "questions", label: "Exam Prep", available: !!questions && questions.length > 0 },
  ].filter(t => t.available);

  const currentTab = tabs.find(t => t.id === activeTab) ? activeTab : "theory";

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative z-10 pb-20">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col mb-8 gap-6">
        <div className="flex items-center gap-4">
          <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.96 }} onClick={onBack}
            className="px-3 py-1.5 text-xs font-mono text-zinc-500 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:text-zinc-300 transition-colors flex items-center gap-1.5 bg-zinc-950">
            <ArrowLeft className="w-3 h-3" /> Hub
          </motion.button>
          <div>
            <p className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">{tag}</p>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100 mt-1">{title}</h1>
          </div>
        </div>

        {tabs.length > 1 && (
          <div className="flex gap-8 border-b border-zinc-800/60 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as TabId)}
                className={`relative pb-3 text-sm font-mono tracking-wide transition-colors whitespace-nowrap ${
                  currentTab === tab.id ? "text-amber-400" : "text-zinc-500 hover:text-zinc-300"
                }`}>
                {tab.label}
                {currentTab === tab.id && (
                  <motion.div layoutId="activeTabPM" className="absolute bottom-0 left-0 right-0 h-[2px] bg-current rounded-t-full shadow-[0_-2px_12px_rgba(245,158,11,0.8)]" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
                )}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {currentTab === "theory" && (<motion.div key="theory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>{theoryContent}</motion.div>)}
          {currentTab === "lab" && (<motion.div key="lab" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>{labContent}</motion.div>)}
          {currentTab === "math" && (<motion.div key="math" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>{mathContent}</motion.div>)}
          {currentTab === "questions" && questions && (<motion.div key="questions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}><QuestionsTab questions={questions} /></motion.div>)}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TOPIC DEFINITIONS (14 TOPICS)
// ═══════════════════════════════════════════════════════════════════════════

type TopicId =
  | "portfolio-basics"
  | "efficient-frontier"
  | "sharpe-cal"
  | "capm"
  | "active-passive"
  | "information-ratio"
  | "performance-evaluation"
  | "ips-construction"
  | "fundamental-law"
  | "optimal-active"
  | "multifactor-models"
  | "value-at-risk"
  | "backtesting"
  | "behavioral-finance";

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

const TOPIC_CONTENT: Partial<Record<TopicId, { theory: DepthExplanationProps; math?: React.ReactNode; questions?: { q: string; a: string }[] }>> = {
  "portfolio-basics": {
    theory: {
      analogy: "A single stock is like riding a unicycle—hit one rock and you crash. A portfolio is like a four-wheeled off-road vehicle. One tire can blow out (a stock crashes), but the other three keep you moving forward. That's the magic of diversification.",
      beginner: (
        <p>Imagine you have ₹1,00,000 to invest. You could put it all in stocks (risky but exciting) or all in fixed deposits (safe but boring). Or — you could split it. That split IS your portfolio. The moment you own more than one asset, you have a portfolio.</p>
      ),
      intermediate: (
        <p>The primary reason to hold a portfolio instead of a single asset is <strong>Diversification</strong>. Diversification reduces risk without necessarily reducing <Term id="expected_return" colorClass="text-zinc-100">expected return</Term>. This works because different assets react differently to the same economic events.</p>
      ),
      advanced: (
        <p>Modern Portfolio Theory (MPT), pioneered by Harry Markowitz, mathematically proved that the total variance (risk) of a portfolio is <em>not</em> just the weighted average of the individual variances. It is critically dependent on the <Term id="covariance" colorClass="text-zinc-100"><strong>Covariance</strong></Term> (or <Term id="correlation" colorClass="text-zinc-100">correlation</Term>) between the assets. Holding assets with a correlation of less than +1.0 always yields a diversification benefit.</p>
      ),
    },
    questions: [
      { q: "What is the primary benefit of holding a portfolio rather than a single asset?", a: "Diversification. It allows an investor to reduce their total risk exposure without necessarily having to sacrifice expected return." },
      { q: "At what correlation coefficient is there NO diversification benefit?", a: "A correlation coefficient of exactly +1.0. If assets move perfectly in lockstep, combining them does not reduce total risk." },
    ],
  },
  "efficient-frontier": {
    theory: {
      analogy: "Imagine an all-you-can-eat buffet. The Efficient Frontier is the plate of food that gives you the absolute maximum protein (Return) for the exact number of calories (Risk) you are willing to consume. Anything below the line is just junk food.",
      beginner: (
        <p>Markowitz proved you must look at how assets move <em>together</em>. Mixing assets creates portfolios with lower risk than any individual asset. If you plot every possible combination of assets on a graph of Risk vs Return, you get a cloud of portfolios.</p>
      ),
      intermediate: (
        <p>The random cloud of portfolios has a top-left edge: the <strong>Efficient Frontier</strong>. Portfolios on this curved line offer the highest possible <Term id="expected_return" colorClass="text-zinc-100">expected return</Term> for a given level of risk. Any portfolio inside the cloud is mathematically inferior and inefficient.</p>
      ),
      advanced: (
        <p>The frontier is calculated by solving a quadratic programming optimization problem. However, the classical mean-variance framework is highly sensitive to input estimation errors. Small changes in expected returns or <Term id="covariance" colorClass="text-zinc-100">covariances</Term> result in vastly different "optimal" weights, often leading to extreme "corner" portfolios heavily concentrated in a few assets.</p>
      ),
    },
    questions: [
      { q: "What does the Efficient Frontier represent?", a: "The set of optimal portfolios that offer the highest expected return for a defined level of risk, or the lowest risk for a given level of expected return." },
      { q: "Why is a portfolio that plots 'inside' or 'below' the Efficient Frontier considered inefficient?", a: "Because an investor could move vertically straight up to the frontier to get a higher return for the same exact risk, or move horizontally left to get less risk for the same return." },
    ],
  },
  "sharpe-cal": {
    theory: {
      analogy: "The Sharpe Ratio is the 'Horsepower per Dollar' of investing. You don't just care how fast the car goes (Return); you care how much you had to pay for it (Risk). The Capital Allocation Line (CAL) is the dealership lot showing you every possible upgrade.",
      beginner: (
        <p>Two portfolios can have the same return — but one might take way more risk to get there. The <Term id="sharpe_ratio" colorClass="text-zinc-100"><strong>Sharpe Ratio</strong></Term> tells you how much EXTRA return you get per unit of risk, above what you'd get from a completely safe bank account (the <Term id="risk_free_rate" colorClass="text-zinc-100">risk-free rate</Term>).</p>
      ),
      intermediate: (
        <p>The <strong>Capital Allocation Line (CAL)</strong> represents portfolios formed by mixing a <Term id="risk_free_rate" colorClass="text-zinc-100">risk-free asset</Term> (like T-Bills) with a risky portfolio. The <Term id="sharpe_ratio" colorClass="text-zinc-100">Sharpe ratio</Term> is exactly the mathematical slope of the CAL. You want the steepest line possible, which originates from the tangency point on the Efficient Frontier.</p>
      ),
      advanced: (
        <p>While <Term id="sharpe_ratio" colorClass="text-zinc-100">Sharpe</Term> is the industry standard, it mathematically penalizes upside volatility just as much as downside volatility (because it uses <Term id="standard_deviation" colorClass="text-zinc-100">standard deviation</Term>). For asymmetric return distributions (like hedge funds or options strategies), the <strong>Sortino ratio</strong> (which uses only downside semi-variance) is heavily preferred by institutional allocators.</p>
      ),
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">The Formula</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-lg font-mono text-zinc-200">
              Sharpe Ratio = (<Term id="expected_return" colorClass="text-amber-400">Rₚ</Term> - <Term id="risk_free_rate" colorClass="text-cyan-400">R_f</Term>) / <Term id="standard_deviation" colorClass="text-emerald-400">σₚ</Term>
            </p>
          </div>
        </div>
        <p className="text-xs text-zinc-500 text-center">Click highlighted terms for definitions.</p>
      </motion.div>
    ),
    questions: [
      { q: "What does the slope of the Capital Allocation Line (CAL) represent?", a: "The slope of the CAL is the Sharpe Ratio of the risky portfolio being combined with the risk-free asset." },
      { q: "What is the primary limitation of the Sharpe Ratio?", a: "It uses total standard deviation as the measure of risk, meaning it penalizes extreme positive returns (upside volatility) just as much as extreme negative returns." },
    ],
  },
  "capm": {
    theory: {
      analogy: "CAPM is like gravity in finance. Just as gravity dictates how fast an apple falls, the Market (Beta) dictates how your stock should perform. If a stock defies gravity and goes up faster than it should, that's Alpha. But CAPM says Alpha is an illusion over the long run.",
      beginner: (
        <p>If a stock swings twice as much as the market, it should earn more — because you're taking more risk. <Term id="factor_sensitivity" colorClass="text-emerald-400"><span className="text-emerald-400 font-bold">Beta (β)</span></Term> measures that swing. β=1 means it moves WITH the market. β=2 means it swings twice as hard.</p>
      ),
      intermediate: (
        <p>The CAPM separates risk into two buckets: <strong>Systematic</strong> (Market-wide risk) and <strong>Unsystematic</strong> (Company-specific risk). Because you can diversify away specific risk for free by holding many stocks, the market will ONLY compensate you for holding Systematic risk (<Term id="factor_sensitivity" colorClass="text-zinc-100">Beta</Term>).</p>
      ),
      advanced: (
        <p>CAPM graphically relies on the <strong>Security Market Line (SML)</strong>. While the Capital Market Line (CML) plots total risk (<Term id="standard_deviation" colorClass="text-zinc-100">Standard Deviation</Term>) for efficient portfolios, the SML plots systematic risk (<Term id="factor_sensitivity" colorClass="text-zinc-100">Beta</Term>) for individual assets. Roll's Critique argues that the true "Market Portfolio" required by CAPM is unobservable, making true Beta impossible to calculate perfectly.</p>
      ),
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">The CAPM Formula</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-sm sm:text-lg font-mono text-zinc-200">
              <Term id="expected_return" colorClass="text-zinc-200">E(Rᵢ)</Term> = <Term id="risk_free_rate" colorClass="text-emerald-400">R_f</Term> + <Term id="factor_sensitivity" colorClass="text-amber-400">βᵢ</Term> × [<Term id="equity_risk_premium" colorClass="text-cyan-400">E(R_m) - R_f</Term>]
            </p>
          </div>
        </div>
      </motion.div>
    ),
    questions: [
      { q: "What is the difference between Systematic and Unsystematic risk?", a: "Systematic risk is market-wide and cannot be diversified away (e.g., recessions, interest rates). Unsystematic risk is company-specific (e.g., a CEO resigning) and can be eliminated through diversification." },
      { q: "According to CAPM, are investors compensated for bearing Unsystematic Risk?", a: "No. Because unsystematic risk can be eliminated simply by diversifying a portfolio, the market does not offer a risk premium for holding it." },
    ],
  },
  "active-passive": {
    theory: {
      analogy: "Passive investing is like getting on a train—you go exactly where the track goes, no faster, no slower. Active investing is like driving a sports car—you can weave through traffic and get there faster (Alpha), but you risk crashing or getting lost (Tracking Error).",
      beginner: (
        <p><strong>Active management</strong> seeks to add value by outperforming a passively managed benchmark portfolio. An appropriate benchmark should be representative, replicable at low cost, and have weights known beforehand. <strong>Passive investing</strong> accepts the benchmark return without deviating.</p>
      ),
      intermediate: (
        <p>Value added is measured by <Term id="active_return" colorClass="text-zinc-100"><strong>Active Return (R_A)</strong></Term>. Active Return can be decomposed into <strong>Asset Allocation Return</strong> (deviations in asset class weights) and <strong>Security Selection Return</strong> (deviations of individual stock weights within a class). Overweighted securities have positive <Term id="active_weight" colorClass="text-zinc-100">active weights</Term>, which across the portfolio must sum to zero.</p>
      ),
      advanced: (
        <p>The standard deviation of active returns is called <Term id="active_risk" colorClass="text-zinc-100"><strong>Active Risk</strong></Term> or <Term id="active_risk" colorClass="text-zinc-100"><strong>Tracking Error (σ_A)</strong></Term>. Active Risk is composed of <strong>Active Factor Risk</strong> (deviations in portfolio factor sensitivities vs the benchmark) and <strong>Active Specific Risk</strong> (deviations in individual asset weightings, controlling for factors). Thus, Active Risk² = Active Factor Risk + Active Specific Risk.</p>
      ),
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6 relative z-10 backdrop-blur-sm">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Active Return</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-lg font-mono text-zinc-200">
              <Term id="active_return" colorClass="text-zinc-200">R_A</Term> = <Term id="expected_return" colorClass="text-amber-400">R_P</Term> - <Term id="expected_return" colorClass="text-cyan-400">R_B</Term> = Σ (<Term id="active_weight" colorClass="text-emerald-400">Δwᵢ</Term> × Rᵢ)
            </p>
          </div>
        </div>
      </motion.div>
    ),
    questions: [
      { q: "What is Tracking Error?", a: "Tracking error (or Active Risk) is the standard deviation of the differences between the portfolio's returns and the benchmark's returns over time." },
      { q: "What must the sum of all Active Weights in a portfolio equal?", a: "Zero. For every asset you overweight compared to the benchmark (positive active weight), you must underweight another asset (negative active weight)." },
    ],
  },
  "information-ratio": {
    theory: {
      analogy: "If Sharpe Ratio is asking 'How fast can you run?', Information Ratio is asking 'How much faster are you than the guy next to you, given how much energy you exerted to pass him?' It isolates the manager's active skill from the market's free ride.",
      beginner: (
        <p>The <Term id="information_ratio" colorClass="text-zinc-100"><strong>Information Ratio (IR)</strong></Term> measures the reward per unit of <Term id="active_risk" colorClass="text-zinc-100">active risk</Term>. It asks how much extra return a manager generated for every unit of risk taken by deviating from the index. A higher IR indicates a more efficient manager.</p>
      ),
      intermediate: (
        <p><Term id="information_ratio" colorClass="text-zinc-100">IR</Term> differs from the <Term id="sharpe_ratio" colorClass="text-zinc-100"><strong>Sharpe Ratio (SR)</strong></Term>. SR measures excess return relative to the <Term id="risk_free_rate" colorClass="text-zinc-100">risk-free rate</Term> per unit of total risk. Adding cash to a portfolio halves both return and standard deviation, leaving SR unaffected, but it lowers active return while keeping <Term id="active_risk" colorClass="text-zinc-100">active risk</Term> roughly the same, thus <strong>decreasing the IR</strong>.</p>
      ),
      advanced: (
        <p>There is a crucial distinction between <strong>Ex-Post IR</strong> (realized historical performance) and <strong>Ex-Ante IR</strong> (expected future performance). A <Term id="closet_index_fund" colorClass="text-zinc-100"><em>closet index fund</em></Term> tracks the benchmark closely, yielding a Sharpe similar to the benchmark but very little active risk, often resulting in a negative ex-post IR after management fees.</p>
      ),
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Information Ratio</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-lg font-mono text-zinc-200">
              <Term id="information_ratio" colorClass="text-zinc-200">IR</Term> = <Term id="active_return" colorClass="text-amber-400">E(R_A)</Term> / <Term id="active_risk" colorClass="text-cyan-400">σ_A</Term>
            </p>
          </div>
        </div>
      </motion.div>
    ),
    questions: [
      { q: "What is the key difference between the denominator of the Sharpe Ratio and the Information Ratio?", a: "The Sharpe Ratio uses total risk (standard deviation of the portfolio). The Information Ratio uses active risk (tracking error, which is the standard deviation of the difference between portfolio and benchmark returns)." },
      { q: "Can a portfolio have a positive Sharpe Ratio but a negative Information Ratio?", a: "Yes. If the portfolio generates positive returns above the risk-free rate (positive Sharpe) but underperforms its specific benchmark (negative active return), the Information Ratio will be negative." },
    ],
  },
  "performance-evaluation": {
    theory: {
      analogy: "Imagine two farmers. Farmer A grows 10 tons of crops, Farmer B grows 8 tons. A looks better. But if you realize Farmer A had perfect rain (High Beta/Market help) and Farmer B had a severe drought but used advanced irrigation (High Alpha/Skill), B is actually the better farmer. Treynor and Jensen's Alpha adjust for the 'weather'.",
      beginner: (
        <p>The <Term id="sharpe_ratio" colorClass="text-zinc-100">Sharpe Ratio</Term> is famous, but it uses <strong>Total Risk</strong> (<Term id="standard_deviation" colorClass="text-zinc-100">Standard Deviation</Term>). If a portfolio is already well-diversified, we only care about <strong>Systematic Risk</strong> (<Term id="factor_sensitivity" colorClass="text-zinc-100">Beta</Term>). The <Term id="treynor_ratio" colorClass="text-zinc-100"><strong>Treynor Ratio</strong></Term> and <Term id="jensens_alpha" colorClass="text-zinc-100"><strong>Jensen's Alpha</strong></Term> grade managers based only on the market risk they took.</p>
      ),
      intermediate: (
        <p><Term id="m_squared" colorClass="text-zinc-100"><strong>M-Squared (M²)</strong></Term> is a brilliant metric that fixes a major problem with the <Term id="sharpe_ratio" colorClass="text-zinc-100">Sharpe Ratio</Term>: Sharpe is just a raw number (like 0.8) that is hard to interpret. M² converts the Sharpe Ratio back into a percentage return by artificially leveraging or de-leveraging the portfolio so its volatility perfectly matches the market.</p>
      ),
      advanced: (
        <p><Term id="jensens_alpha" colorClass="text-zinc-100"><strong>Jensen's Alpha</strong></Term> is the percentage of portfolio return that cannot be explained by CAPM. It is the intercept of the regression of excess portfolio returns against excess market returns. A positive, statistically significant Jensen's Alpha indicates true manager skill (after accounting for <Term id="factor_sensitivity" colorClass="text-zinc-100">Beta</Term>).</p>
      ),
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Treynor Ratio {"&"} Jensen's Alpha</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center space-y-4">
            <p className="text-lg font-mono text-zinc-200">
              <Term id="treynor_ratio" colorClass="text-zinc-200">Treynor</Term> = (<Term id="expected_return" colorClass="text-amber-400">R_p</Term> - <Term id="risk_free_rate" colorClass="text-emerald-400">R_f</Term>) / <Term id="factor_sensitivity" colorClass="text-cyan-400">β_p</Term>
            </p>
            <div className="w-full h-px bg-zinc-800"></div>
            <p className="text-lg font-mono text-zinc-200">
              <Term id="jensens_alpha" colorClass="text-zinc-200">Alpha (α)</Term> = <Term id="expected_return" colorClass="text-amber-400">R_p</Term> - [ <Term id="risk_free_rate" colorClass="text-emerald-400">R_f</Term> + <Term id="factor_sensitivity" colorClass="text-cyan-400">β_p</Term>(<Term id="equity_risk_premium" colorClass="text-zinc-200">R_m - R_f</Term>) ]
            </p>
          </div>
        </div>
        <div className="space-y-2 mt-6">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">M-Squared (M²)</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-lg font-mono text-zinc-200">
              <Term id="m_squared" colorClass="text-zinc-200">M²</Term> = (<Term id="sharpe_ratio" colorClass="text-amber-400">Sharpe_p</Term> - <Term id="sharpe_ratio" colorClass="text-cyan-400">Sharpe_m</Term>) × <Term id="standard_deviation" colorClass="text-emerald-400">σ_m</Term>
            </p>
          </div>
        </div>
      </motion.div>
    ),
    questions: [
      { q: "What does Jensen's Alpha represent?", a: "It represents the excess return of a portfolio over what was expected by the Capital Asset Pricing Model (CAPM), given the portfolio's Beta." },
      { q: "If a portfolio is not fully diversified, which ratio is better to use: Sharpe or Treynor?", a: "Sharpe Ratio. The Treynor ratio only accounts for systematic risk (Beta) and assumes unsystematic risk has been diversified away. The Sharpe ratio uses total risk (Standard Deviation)." },
    ],
  },
  "ips-construction": {
    theory: {
      analogy: "An IPS is a financial constitution. You wouldn't build a skyscraper without a blueprint detailing the exact weight limits and materials. An IPS documents exactly how much risk you can handle before the 'building' collapses.",
      beginner: (
        <p>An <Term id="ips" colorClass="text-zinc-100"><strong>Investment Policy Statement (IPS)</strong></Term> is a written document that clearly sets out a client's return objectives and risk tolerance over their investment time horizon. It acts as the governing roadmap between the client and the portfolio manager.</p>
      ),
      intermediate: (
        <p>The core of an <Term id="ips" colorClass="text-zinc-100">IPS</Term> is the constraint framework, easily remembered by the acronym <strong>RRTTLLU</strong>: Risk, Return, Time horizon, Taxes, Liquidity, Legal, and Unique circumstances. For example, a young worker has high liquidity from income (can take risk), while a retiree has high liquidity needs for living expenses (lower risk).</p>
      ),
      advanced: (
        <p>When establishing the "Risk" component, a manager must distinguish between <Term id="ability_vs_willingness" colorClass="text-zinc-100"><strong>Ability</strong></Term> to take risk (objective financial capacity: wealth, age, income stability) and <Term id="ability_vs_willingness" colorClass="text-zinc-100"><strong>Willingness</strong></Term> to take risk (subjective psychological comfort). If ability and willingness clash, the manager must always construct the portfolio based on the more conservative of the two.</p>
      ),
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
    ),
    questions: [
      { q: "What does the acronym RRTTLLU stand for?", a: "Risk, Return, Time horizon, Taxes, Liquidity, Legal/Regulatory, and Unique circumstances." },
      { q: "If a wealthy, young client (high ability) is terrified of losing money (low willingness), how should the manager structure the portfolio?", a: "Based on the lower of the two. The portfolio must be structured conservatively to match the client's low willingness to take risk." },
    ],
  },
  "fundamental-law": {
    theory: {
      analogy: "Grinold's Law is like running a casino. To make money, you need a slight edge over the players (Information Coefficient or 'Skill'), AND you need them to play thousands of hands a night (Breadth). High skill with only one bet is just gambling; low skill with many bets is a guaranteed loss.",
      beginner: (
        <p><Term id="fundamental_law" colorClass="text-zinc-100"><strong>Grinold's Fundamental Law of Active Management</strong></Term> separates expected value added into the manager's skill and the number of opportunities they have to apply that skill. A successful manager needs both forecasting accuracy and many independent bets.</p>
      ),
      intermediate: (
        <p>The unconstrained law states: <strong><Term id="information_ratio" colorClass="text-zinc-100">IR</Term> = <Term id="information_coefficient" colorClass="text-zinc-100">IC</Term> × √<Term id="breadth" colorClass="text-zinc-100">BR</Term></strong>.<br /><br />• <Term id="information_coefficient" colorClass="text-zinc-100"><strong>IC (Information Coefficient):</strong></Term> Measures manager skill as the risk-weighted correlation between forecasted and actual active returns.<br />• <Term id="breadth" colorClass="text-zinc-100"><strong>BR (Breadth):</strong></Term> The number of truly independent active bets taken per year.</p>
      ),
      advanced: (
        <p>The exact translation of the <Term id="information_coefficient" colorClass="text-zinc-100">Information Coefficient</Term> is calculated as: <strong>IC = 2 × (Probability of Correct Call) - 1</strong>. In reality, short-selling restrictions or sector limits prevent managers from acting fully on their forecasts. This is captured by the <Term id="transfer_coefficient" colorClass="text-zinc-100"><strong>Transfer Coefficient (TC)</strong></Term>, which is the correlation between actual active weights and optimal active weights (TC ≤ 1). A long-only fund will lose significant skill purely to these constraints.</p>
      ),
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">The Constrained Fundamental Law</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-lg font-mono text-zinc-200">
              <Term id="active_return" colorClass="text-zinc-200">E(R_A)</Term> = <Term id="transfer_coefficient" colorClass="text-rose-400">TC</Term> × <Term id="information_coefficient" colorClass="text-amber-400">IC</Term> × √<Term id="breadth" colorClass="text-emerald-400">BR</Term> × <Term id="active_risk" colorClass="text-cyan-400">σ_A</Term>
            </p>
          </div>
        </div>
      </motion.div>
    ),
    questions: [
      { q: "What does the Transfer Coefficient (TC) measure?", a: "It measures how efficiently a manager can translate their insights (optimal weights) into actual portfolio positions, heavily reduced by constraints like 'long-only' rules." },
      { q: "If a manager is correct on 60% of their trades, what is their Information Coefficient (IC)?", a: "Using the formula IC = 2 * (0.60) - 1. The IC is 0.20." },
    ],
  },
  "optimal-active": {
    theory: {
      analogy: "Mixing passive and active management is like making a cocktail. The passive index is your base (water/soda). The active manager is the pure alcohol. The Optimal Active Risk formula tells you the exact mathematical ratio to pour to get the perfect buzz without a hangover.",
      beginner: (
        <p><Term id="optimal_active_risk" colorClass="text-zinc-100"><strong>Optimal Active Risk</strong></Term> determines how much of an investor's wealth should be allocated to an active manager versus a passive benchmark to maximize the total portfolio's risk-adjusted returns.</p>
      ),
      intermediate: (
        <p>The optimal amount of <Term id="active_risk" colorClass="text-zinc-100">active risk</Term> depends positively on the manager's skill (<Term id="information_ratio" colorClass="text-zinc-100">IR</Term>) and negatively on the benchmark's quality (<Term id="sharpe_ratio" colorClass="text-zinc-100">Sharpe Ratio</Term>). If the benchmark is performing incredibly well (high SR), you mathematically should allocate less to the active manager.</p>
      ),
      advanced: (
        <p>When blending an active strategy with a passive index, the <Term id="optimal_active_risk" colorClass="text-zinc-100">optimal active risk</Term> targets the exact point where the marginal contribution to <Term id="active_return" colorClass="text-zinc-100">active return</Term> equals the marginal penalty of <Term id="active_risk" colorClass="text-zinc-100">active risk</Term>, optimizing the total portfolio <Term id="sharpe_ratio" colorClass="text-zinc-100">Sharpe ratio</Term> to its absolute maximum limit.</p>
      ),
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Optimal Active Risk</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-lg font-mono text-zinc-200">
              <Term id="optimal_active_risk" colorClass="text-zinc-200">σ_A*</Term> = (<Term id="information_ratio" colorClass="text-amber-400">IR</Term> / <Term id="sharpe_ratio" colorClass="text-cyan-400">SR_B</Term>) × <Term id="standard_deviation" colorClass="text-emerald-400">σ_B</Term>
            </p>
          </div>
        </div>
      </motion.div>
    ),
    questions: [
      { q: "How does the benchmark's Sharpe Ratio affect the allocation to active risk?", a: "It has an inverse relationship. A higher benchmark Sharpe Ratio means the passive option is very attractive, resulting in a lower optimal allocation to the active manager." },
      { q: "What is the goal of finding the Optimal Active Risk?", a: "To combine the active and passive portfolios in exact proportions that yield the maximum possible total Sharpe Ratio for the combined overall portfolio." },
    ],
  },
  "multifactor-models": {
    theory: {
      analogy: "CAPM says the only thing that dictates your health is your age (the Market factor). APT and Multifactor models realize health is driven by age, blood pressure, cholesterol, and sleep (Size, Value, Momentum, Quality). It's a high-definition MRI instead of a basic thermometer.",
      beginner: (
        <p>Unlike the CAPM, which assumes returns are explained by a single market factor, <Term id="arbitrage_pricing_theory" colorClass="text-zinc-100"><strong>Arbitrage Pricing Theory (APT)</strong></Term> and multifactor models assume asset returns are driven by multiple systematic <Term id="risk_premium" colorClass="text-zinc-100">risk factors</Term>. APT does not require the market portfolio to be one of the factors.</p>
      ),
      intermediate: (
        <p>An APT equation adds up the asset's <Term id="factor_sensitivity" colorClass="text-zinc-100">sensitivity (Beta)</Term> to various risk factors, multiplied by the <Term id="risk_premium" colorClass="text-zinc-100">risk premium</Term> for that specific factor. Unsystematic risk is assumed to be fully diversified away, meaning returns are purely a sum of factor exposures.</p>
      ),
      advanced: (
        <p>The most famous implementation is the <Term id="fama_french" colorClass="text-zinc-100">Fama-French 3-Factor Model</Term> (Market, <Term id="smb_factor" colorClass="text-zinc-100">Size/SMB</Term>, and <Term id="hml_factor" colorClass="text-zinc-100">Value/HML</Term>). The Carhart 4-Factor Model adds Momentum (WML).<br /><br />There are three main types of models:<br />1. <Term id="macroeconomic_factor_model" colorClass="text-zinc-100"><strong>Macroeconomic:</strong></Term> Factors are <em>surprises</em> (realized minus expected) in GDP, inflation.<br />2. <Term id="fundamental_factor_model" colorClass="text-zinc-100"><strong>Fundamental:</strong></Term> Factors are firm attributes (P/E).<br />3. <strong>Statistical:</strong> Uses Principal Component Analysis to find mystery factors.</p>
      ),
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Arbitrage Pricing Theory (APT)</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-sm sm:text-lg font-mono text-zinc-200">
              <Term id="expected_return" colorClass="text-zinc-200">E(R_P)</Term> = <Term id="risk_free_rate" colorClass="text-zinc-200">R_F</Term> + <Term id="factor_sensitivity" colorClass="text-amber-400">β₁</Term>(<Term id="risk_premium" colorClass="text-cyan-400">λ₁</Term>) + ... + <Term id="factor_sensitivity" colorClass="text-amber-400">βₖ</Term>(<Term id="risk_premium" colorClass="text-cyan-400">λₖ</Term>)
            </p>
          </div>
        </div>
      </motion.div>
    ),
    questions: [
      { q: "What does the SMB factor represent in the Fama-French model?", a: "Small Minus Big. It represents the historical risk premium that small-cap stocks earn over large-cap stocks." },
      { q: "What are the three main classifications of multifactor models?", a: "1. Macroeconomic factor models, 2. Fundamental factor models, and 3. Statistical factor models." },
    ],
  },
  "value-at-risk": {
    theory: {
      analogy: "VaR is the flood warning system for your money. It doesn't tell you exactly how many drops of rain will fall; it simply says: 'There is a 5% chance the water will rise higher than 10 feet this month. Prepare the sandbags.'",
      beginner: (
        <p><Term id="value_at_risk" colorClass="text-zinc-100"><strong>Value at Risk (VaR)</strong></Term> estimates the minimum loss that will occur with a given probability over a specified period. For example, a 5% monthly VaR of $1 million means there is a 5% probability that the portfolio will lose <em>at least</em> $1 million in any given month.</p>
      ),
      intermediate: (
        <p>There are three <Term id="value_at_risk" colorClass="text-zinc-100">VaR</Term> estimation methods:<br />1. <strong>Parametric:</strong> Uses means, variances, and <Term id="covariance" colorClass="text-zinc-100">covariances</Term>, usually assuming a normal distribution.<br />2. <strong>Historical Simulation:</strong> Uses actual past daily changes to find the 5% worst historical loss.<br />3. <strong>Monte Carlo:</strong> Draws random risk factor changes from assumed distributions thousands of times.</p>
      ),
      advanced: (
        <p><Term id="value_at_risk" colorClass="text-zinc-100">VaR</Term> focuses only on a single threshold point, which is a major flaw—it doesn't tell you how bad the loss gets <em>after</em> you cross the 5% threshold. Extensions include:<br />• <Term id="conditional_var" colorClass="text-zinc-100"><strong>CVaR (Expected Shortfall):</strong></Term> The expected average loss <em>given</em> that the loss has exceeded the VaR threshold. Mathematically, it is the integral of the tail distribution.<br />• <Term id="incremental_var" colorClass="text-zinc-100"><strong>Incremental VaR (IVaR):</strong></Term> The change in VaR from altering a single position's weight.</p>
      ),
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Parametric VaR</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-lg font-mono text-zinc-200">
              <Term id="value_at_risk" colorClass="text-zinc-200">VaR</Term> = [ <Term id="expected_return" colorClass="text-amber-400">μ_P</Term> - (<span className="text-rose-400">z</span> × <Term id="standard_deviation" colorClass="text-cyan-400">σ_P</Term>) ] × <span className="text-emerald-400">Portfolio Value</span>
            </p>
          </div>
        </div>
        <p className="text-xs text-zinc-500 text-center">z = 1.65 for 5% VaR (95% Confidence). z = 2.33 for 1% VaR (99% Confidence).</p>
      </motion.div>
    ),
    questions: [
      { q: "What is the primary limitation of Value at Risk (VaR)?", a: "It only provides a threshold (minimum loss) but gives absolutely no information about the magnitude of losses that can occur in the extreme tail beyond that threshold." },
      { q: "What is Conditional VaR (CVaR) or Expected Shortfall?", a: "It is the average expected loss of the portfolio during the worst-case scenarios, specifically the scenarios where the VaR threshold has been breached." },
    ],
  },
  "backtesting": {
    theory: {
      analogy: "Backtesting is like a military simulation using history books. It's useful to see if your strategy would have survived the 2008 financial crisis. But beware of Look-Ahead bias—you can't use tomorrow's newspaper to win yesterday's battle.",
      beginner: (
        <p><strong>Backtesting</strong> uses historical data to simulate the performance of an investment strategy prior to actual investment. The goal is to assess risk and return trade-offs by mimicking how the strategy would have behaved in reality.</p>
      ),
      intermediate: (
        <p>The process involves Strategy Design, Historical Simulation, and Analysis. Modern backtesting relies on a <strong>rolling-window</strong> (walk-forward) approach, where trade signals are periodically re-calibrated and the portfolio rebalanced to strictly mimic real-world deployment without looking into the future.</p>
      ),
      advanced: (
        <p>Major pitfalls in backtesting include:<br />• <Term id="survivorship_bias" colorClass="text-zinc-100"><strong>Survivorship Bias:</strong></Term> Using datasets that only include companies still existing today, artificially inflating past returns.<br />• <Term id="look_ahead_bias" colorClass="text-zinc-100"><strong>Look-Ahead Bias:</strong></Term> Using financial data (like Q1 earnings) on a simulated date before that data was actually published to the public.<br />• <Term id="data_snooping" colorClass="text-zinc-100"><strong>Data Snooping (Overfitting):</strong></Term> Testing thousands of rules until one works by pure statistical luck, leading to disastrous real-world performance.</p>
      ),
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Evaluation Metrics</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center space-y-4">
            <p className="text-lg font-mono text-zinc-200">
              <Term id="hit_rate" colorClass="text-zinc-200">Hit Rate</Term> = <span className="text-emerald-400">Winning Trades</span> / <span className="text-zinc-400">Total Trades</span>
            </p>
            <div className="w-full h-px bg-zinc-800"></div>
            <p className="text-sm sm:text-lg font-mono text-zinc-200">
              <Term id="max_drawdown" colorClass="text-zinc-200">Max Drawdown</Term> = ( <span className="text-rose-400">Trough Value</span> - <span className="text-amber-400">Peak Value</span> ) / <span className="text-amber-400">Peak Value</span>
            </p>
          </div>
        </div>
      </motion.div>
    ),
    questions: [
      { q: "What is Survivorship Bias in backtesting?", a: "It occurs when a historical dataset only includes companies that exist today, ignoring companies that went bankrupt or delisted, causing the backtest to artificially show higher returns." },
      { q: "What is Look-Ahead Bias?", a: "It occurs when the simulation uses information or data points (like earnings reports or macroeconomic data) before they were actually made public to investors in reality." },
    ],
  },
  "behavioral-finance": {
    theory: {
      analogy: "Traditional finance assumes investors are like computers—perfectly rational, emotionless calculators. Behavioral finance recognizes that investors are human. We take mental shortcuts, panic when we see red numbers, and get overconfident when we get lucky.",
      beginner: (
        <div className="space-y-3">
          <p><strong>Behavioral Finance</strong> challenges the traditional assumption that investors are fully rational. It integrates psychology and economics to explain why people make suboptimal financial decisions driven by cognitive biases and emotions.</p>
        </div>
      ),
      intermediate: (
        <div className="space-y-4">
          <p><strong>Cognitive Errors</strong> are "faulty wiring." They are mental shortcuts (heuristics) or memory errors. Because they stem from faulty reasoning rather than deep emotion, they can often be corrected with better information and education.</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
              <span className="text-cyan-400 font-bold block mb-1">Anchoring Bias</span>
              <p className="text-xs text-zinc-400">Overreliance on the first piece of information seen (like a 52-week high) and basing all future valuation on that "anchor" rather than new fundamentals.</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
              <span className="text-emerald-400 font-bold block mb-1">Confirmation Bias</span>
              <p className="text-xs text-zinc-400">Only seeking out, interpreting, and recalling information that confirms your pre-existing beliefs.</p>
            </div>
          </div>
        </div>
      ),
      advanced: (
        <div className="space-y-4">
          <p><strong>Emotional Biases</strong> are "faulty feelings." They stem from impulse, intuition, and fear. They are much harder to correct and usually must be <em>accommodated</em> by the portfolio manager rather than completely fixed.</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
              <span className="text-rose-400 font-bold block mb-1">Loss Aversion</span>
              <p className="text-xs text-zinc-400">The psychological pain of losing $100 is roughly twice as intense as the joy of making $100.</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
              <span className="text-amber-400 font-bold block mb-1">Disposition Effect</span>
              <p className="text-xs text-zinc-400">Investors sell winning stocks too early to lock in the "joy," but hold losing stocks indefinitely to avoid the "pain" of admitting defeat.</p>
            </div>
          </div>
        </div>
      )
    },
    questions: [
      { q: "What is the difference between a Cognitive Error and an Emotional Bias?", a: "Cognitive errors are faulty reasoning or memory blind-spots that can be corrected with education. Emotional biases stem from deep-seated feelings and impulses, making them much harder to change." }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// GLOSSARY DRAWER MODAL
// ═══════════════════════════════════════════════════════════════════════════

function GlossaryDrawer({ activeTerm, onClose, onSelect }: { activeTerm: string, onClose: () => void, onSelect: (t: string) => void }) {
  const [search, setSearch] = useState("");
  const isAll = activeTerm === "ALL";
  const termData = isAll ? null : GLOSSARY_TERMS[activeTerm];

  const filteredList = Object.entries(GLOSSARY_TERMS).filter(([key, data]) => 
    data.title.toLowerCase().includes(search.toLowerCase()) || data.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full relative z-10 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/50 shrink-0 bg-zinc-900/20">
          <div className="flex items-center gap-3">
            {!isAll && (
              <button onClick={() => onSelect("ALL")} className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors">
                <ChevronLeft className="w-4 h-4 text-zinc-400" />
              </button>
            )}
            <h2 className="text-lg font-bold font-mono text-white">{isAll ? "Formula Dictionary" : "Concept Definition"}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {isAll ? (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input type="text" placeholder="Search variables (e.g., Beta, SR)..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-sm font-mono text-zinc-200 focus:outline-none focus:border-amber-500/50" />
              </div>
              <div className="space-y-3">
                {filteredList.map(([key, data]) => (
                  <div key={key} onClick={() => onSelect(key)} className="group p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl cursor-pointer hover:border-amber-500/30 hover:bg-amber-500/5 transition-all">
                    <h4 className="text-sm font-bold font-mono text-amber-400 mb-1">{data.title}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-2">{data.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : termData ? (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold font-mono text-amber-400 mb-4">{termData.title}</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">{termData.definition}</p>
              </div>
              {termData.formula && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Mathematical Formula</h4>
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <code className="text-emerald-400 text-sm">{termData.formula}</code>
                  </div>
                </div>
              )}
              {termData.analogy && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Real-World Analogy</h4>
                  <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                    <p className="text-sm text-zinc-400 leading-relaxed italic">"{termData.analogy}"</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT EXPORT
// ═══════════════════════════════════════════════════════════════════════════

function GenericInfoLab({ id, onBack }: { id: TopicId, onBack: () => void }) {
  const topic = TOPICS.find(t => t.id === id);
  const content = TOPIC_CONTENT[id];

  if (!topic || !content) return null;

  if (id === "behavioral-finance") {
    return (
      <TopicDashboard 
        title={topic.title} 
        tag={topic.difficulty} 
        onBack={onBack} 
        defaultTab="lab" 
        theoryContent={<DepthExplanation {...content.theory} />} 
        labContent={<BehavioralFinanceLab />} 
        questions={content.questions} 
      />
    );
  }

  return (
    <TopicDashboard 
      title={topic.title} 
      tag={topic.difficulty} 
      onBack={onBack} 
      defaultTab="theory" 
      theoryContent={<DepthExplanation {...content.theory} />} 
      mathContent={content.math} 
      questions={content.questions} 
    />
  );
}

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
        className={`group w-full text-left relative rounded-2xl border overflow-hidden transition-all duration-300 ${a.border} bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-md hover:shadow-[0_0_32px_-8px_rgba(245,158,11,0.12)] cursor-pointer`}
      >
        <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${topic.accent === "cyan" ? "via-cyan-500/40" : topic.accent === "emerald" ? "via-emerald-500/40" : topic.accent === "rose" ? "via-rose-500/40" : "via-amber-500/40"} to-transparent`} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-inner shadow-white/5 ${a.bg} border ${a.border} ${a.text}`}>{topic.icon}</div>
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

export default function PortfolioHub() {
  const [activeTopic, setActiveTopic] = useState<TopicId | null>(null);
  const [completed, setCompleted] = useState<Set<TopicId>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<string | null>(null);

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

  return (
    <GlossaryContext.Provider value={setActiveGlossaryTerm}>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden" style={{ fontFamily: "var(--font-mono, 'JetBrains Mono'), 'Fira Mono', monospace" }}>
        
        {/* Active Dashboard */}
        {activeTopic ? (
          <div className="py-8 px-5 relative z-10">
            <ElegantBackground />
            <AnimatePresence mode="wait">
              {activeTopic === "portfolio-basics" && <PortfolioBasicsLab key="pb" onBack={() => handleBack("portfolio-basics")} />}
              {activeTopic === "sharpe-cal" && <SharpeCALLab key="sc" onBack={() => handleBack("sharpe-cal")} />}
              {activeTopic === "capm" && <CAPMLab key="capm" onBack={() => handleBack("capm")} />}
              {activeTopic === "efficient-frontier" && <EfficientFrontierLab key="ef" onBack={() => handleBack("efficient-frontier")} />}
              {pureInfoTopics.includes(activeTopic) && <GenericInfoLab key={activeTopic} id={activeTopic as TopicId} onBack={() => handleBack(activeTopic as TopicId)} />}
            </AnimatePresence>
          </div>
        ) : (
          /* Main Hub */
          <>
            <ElegantBackground />
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
          </>
        )}

        {/* Floating Action Button (FAB) */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveGlossaryTerm("ALL")}
          className="fixed bottom-6 right-6 z-40 bg-amber-500 text-zinc-950 p-4 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center"
          title="Formula Dictionary"
        >
          <BookMarked className="w-6 h-6" />
        </motion.button>

        {/* Global Glossary Drawer */}
        <AnimatePresence>
          {activeGlossaryTerm && (
            <GlossaryDrawer 
              activeTerm={activeGlossaryTerm} 
              onClose={() => setActiveGlossaryTerm(null)} 
              onSelect={setActiveGlossaryTerm} 
            />
          )}
        </AnimatePresence>

      </div>
    </GlossaryContext.Provider>
  );
}
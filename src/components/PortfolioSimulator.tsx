"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Line as RLine,
} from "recharts";

// ─── Types ─────────────────────────────────────────────────────────────────

type AccentColor = "amber" | "cyan";

interface StepDef {
  id: number;
  tag: string;
  tagline: string;
  body: string;
  isReveal?: boolean;
}

interface FrontierPoint {
  risk: number;
  ret: number;
}

interface TooltipPayloadEntry {
  name: string;
  value: number;
  payload: FrontierPoint;
  color: string;
}

// ─── Pure Finance ──────────────────────────────────────────────────────────

const EQ_RETURN = 15;
const EQ_STD = 20;
const DEBT_RETURN = 6;
const DEBT_STD = 5;

function calcPortfolioReturn(w1: number): number {
  return w1 * EQ_RETURN + (1 - w1) * DEBT_RETURN;
}

function calcPortfolioRisk(w1: number, rho: number): number {
  const w2 = 1 - w1;
  const variance =
    w1 * w1 * EQ_STD * EQ_STD +
    w2 * w2 * DEBT_STD * DEBT_STD +
    2 * w1 * w2 * EQ_STD * DEBT_STD * rho;
  return Math.sqrt(Math.max(0, variance));
}

function calcSharpeRatio(ret: number, risk: number, rf: number = 4): number {
  if (risk === 0) return 0;
  return (ret - rf) / risk;
}

function generateFrontier(rho: number, points: number = 50): FrontierPoint[] {
  const data: FrontierPoint[] = [];
  for (let i = 0; i <= points; i++) {
    const w = i / points;
    data.push({ risk: calcPortfolioRisk(w, rho), ret: calcPortfolioReturn(w) });
  }
  return data;
}

function generateStraightLine(points: number = 50): FrontierPoint[] {
  const data: FrontierPoint[] = [];
  for (let i = 0; i <= points; i++) {
    const w = i / points;
    // Straight line = correlation of +1
    data.push({ risk: calcPortfolioRisk(w, 1), ret: calcPortfolioReturn(w) });
  }
  return data;
}

// ─── Motion Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.22 } },
};

const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

const slideRight = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Steps ─────────────────────────────────────────────────────────────────

const STEPS: StepDef[] = [
  {
    id: 0,
    tag: "The Empty Canvas",
    tagline: "This is your playing field.",
    body: "The chart on the right is empty. The X-axis shows Risk — how inconsistent a player is. The Y-axis shows Return — the average score. Every player and every team will land somewhere on this field. Let's start plotting.",
  },
  {
    id: 1,
    tag: "The Hitter",
    tagline: "Meet the Heavy Hitter. 🏏",
    body: "Your first pick: an explosive batsman. Average score: 15 runs per over. But wildly inconsistent — a 20% miss rate. See that amber dot? That's him. High up (great return) but far right (risky).",
  },
  {
    id: 2,
    tag: "The Bowler",
    tagline: "Now meet the Steady Bowler. 🎯",
    body: "Your second pick: a boring-but-reliable all-rounder. Average score: 6 runs. Miss rate: only 5%. See the cyan dot? Bottom-left — safe but unexciting. Now you have two dots. The question is: what happens when you mix them?",
  },
  {
    id: 3,
    tag: "The Straight Line",
    tagline: "Mix them — slide the bar.",
    body: "The dotted line connects the two players. If they always fail together and always succeed together, your team's risk vs return just slides along this straight line. Use the slider to move your team dot. More Hitters = higher and righter.",
  },
  {
    id: 4,
    tag: "The Magic",
    tagline: "Now bend the line. 🪄",
    body: "Here's the secret: what if they DON'T fail together? When Hitters struggle, Bowlers might shine. Drag the Pitch Synergy slider left. Watch the straight line bow outward. Same return — but LESS risk. That bulge? That's diversification. That's the magic.",
  },
  {
    id: 5,
    tag: "Wall Street Reveal",
    tagline: "The cricket talk has real names.",
    body: "",
    isReveal: true,
  },
  {
    id: 6,
    tag: "Mission",
    tagline: "A crash is coming. Protect the portfolio.",
    body: "",
  },
];

// ─── Shared UI ─────────────────────────────────────────────────────────────

interface SliderInputProps {
  label: string; hint?: string; min: number; max: number; step: number;
  value: number; onChange: (v: number) => void; accent?: AccentColor;
  disabled?: boolean; suffix?: string;
}

function SliderInput({ label, hint, min, max, step, value, onChange, accent = "amber", disabled = false, suffix = "%" }: SliderInputProps) {
  const vCol = accent === "cyan" ? "text-cyan-400" : "text-amber-400";
  const acc = accent === "cyan" ? "accent-cyan-500" : "accent-amber-500";
  return (
    <motion.div variants={slideRight} className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <label className={`text-xs font-mono ${disabled ? "text-zinc-600" : "text-zinc-400"}`}>{label}</label>
        <span className={`text-sm font-bold font-mono ${disabled ? "text-zinc-600" : vCol}`}>{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} disabled={disabled}
        onChange={(e) => !disabled && onChange(Number(e.target.value))}
        className={`w-full h-1 bg-zinc-800 rounded-full appearance-none ${disabled ? "opacity-30 cursor-not-allowed" : `cursor-pointer ${acc}`}`} />
      {hint && <p className="text-[10px] text-zinc-600 mt-0.5">{hint}</p>}
    </motion.div>
  );
}

function StatCard({ label, value, sub, accent = "zinc" }: { label: string; value: string; sub?: string; accent?: string }) {
  const colorMap: Record<string, string> = { amber: "text-amber-400", cyan: "text-cyan-400", emerald: "text-emerald-400", rose: "text-rose-400", zinc: "text-zinc-200" };
  return (
    <motion.div layout variants={fadeUp} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3">
      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
      <motion.p key={value} initial={{ opacity: 0.5, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
        className={`text-lg font-bold font-mono ${colorMap[accent] ?? colorMap.zinc}`}>{value}</motion.p>
      {sub && <p className="text-[10px] text-zinc-600 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div key={i} animate={{ backgroundColor: i < step ? "#f59e0b" : i === step ? "#fbbf24" : "#27272a" }}
          transition={{ duration: 0.3 }} className="h-1 rounded-full flex-1" />
      ))}
    </div>
  );
}

function AllocationBar({ equityPct, usePro }: { equityPct: number; usePro: boolean }) {
  const debtPct = 100 - equityPct;
  return (
    <motion.div variants={fadeUp} className="space-y-2">
      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{usePro ? "Asset Allocation" : "Team Composition"}</p>
      <div className="flex h-8 rounded-lg overflow-hidden border border-zinc-800">
        <motion.div animate={{ width: `${equityPct}%` }} transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="bg-amber-500/20 border-r border-amber-500/30 flex items-center justify-center">
          {equityPct >= 15 && <span className="text-[10px] font-mono text-amber-400 font-bold">{usePro ? "Equity" : "Hitters"} {equityPct}%</span>}
        </motion.div>
        <motion.div animate={{ width: `${debtPct}%` }} transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="bg-cyan-500/10 flex items-center justify-center">
          {debtPct >= 15 && <span className="text-[10px] font-mono text-cyan-400 font-bold">{usePro ? "Debt" : "Bowlers"} {debtPct}%</span>}
        </motion.div>
      </div>
    </motion.div>
  );
}

function FrontierTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadEntry[] }) {
  if (!active || !payload?.length) return null;
  const pt = payload[0].payload;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono">
      <p className="text-zinc-400 mb-1">Risk: {pt.risk.toFixed(1)}%</p>
      <p className="text-amber-400">Return: {pt.ret.toFixed(1)}%</p>
    </div>
  );
}

// ─── Wall Street Reveal ────────────────────────────────────────────────────

function WallStreetReveal({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2600),
      setTimeout(() => setPhase(4), 3800),
      setTimeout(() => setPhase(5), 5000),
      setTimeout(() => { setPhase(6); onDone(); }, 6200),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items: { street: string; pro: string; color: string }[] = [
    { street: "Heavy Hitters",  pro: "Equities",                color: "text-amber-400"   },
    { street: "Steady Bowlers", pro: "Debt / Bonds",             color: "text-cyan-400"    },
    { street: "Pitch Synergy",  pro: "Correlation (ρ)",          color: "text-rose-400"    },
    { street: "Inconsistency",  pro: "Standard Deviation (σ)",   color: "text-emerald-400" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 backdrop-blur-sm px-6">
      <div className="max-w-lg w-full space-y-6 text-center">
        <AnimatePresence>
          {phase >= 1 && (
            <motion.p key="headline" variants={fadeUp} initial="hidden" animate="visible"
              className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Meanwhile, on Dalal Street…</motion.p>
          )}
        </AnimatePresence>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.street} className="relative h-12 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {phase < 2 + i ? (
                  <motion.div key="street" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.3 } }} className="absolute">
                    <span className="text-xl font-bold font-mono text-zinc-300">{item.street}</span>
                  </motion.div>
                ) : (
                  <motion.div key="pro" initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }} className="absolute">
                    <span className={`text-xl font-bold font-mono ${item.color}`}>{item.pro}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <AnimatePresence>
          {phase >= 6 && (
            <motion.p key="sub" variants={fadeUp} initial="hidden" animate="visible" className="text-sm text-zinc-500 font-mono">
              Same game. Different commentary box.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Progressive Chart ─────────────────────────────────────────────────────

interface ChartProps {
  step: number;
  equityWeight: number;
  correlation: number;
  missionMode: boolean;
  usePro: boolean;
}

function ProgressiveChart({ step, equityWeight, correlation, missionMode, usePro }: ChartProps) {
  const w1 = equityWeight / 100;
  const equityDot: FrontierPoint[] = [{ risk: EQ_STD, ret: EQ_RETURN }];
  const debtDot: FrontierPoint[] = [{ risk: DEBT_STD, ret: DEBT_RETURN }];
  const straightLine = useMemo(() => generateStraightLine(), []);
  const curvedFrontier = useMemo(() => generateFrontier(correlation), [correlation]);
  const userDot: FrontierPoint[] = [{ risk: calcPortfolioRisk(w1, step >= 4 ? correlation : 1), ret: calcPortfolioReturn(w1) }];

  return (
    <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5">
      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
        {step === 0 ? "Risk vs Return — The Empty Field" : step <= 2 ? "Risk vs Return — Plotting Players" : "Risk vs Return — The Frontier"}
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
          <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
          <XAxis type="number" dataKey="risk" name="Risk" domain={[0, 24]}
            tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }} tickFormatter={(v: number) => `${v}%`}
            label={{ value: usePro ? "Risk (σ)" : "Inconsistency", position: "insideBottom", offset: -2, style: { fill: "#52525b", fontSize: 10, fontFamily: "monospace" } }} />
          <YAxis type="number" dataKey="ret" name="Return" domain={[3, 18]}
            tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }} tickFormatter={(v: number) => `${v}%`} width={42}
            label={{ value: usePro ? "Return E(R)" : "Avg Score", angle: -90, position: "insideLeft", offset: 10, style: { fill: "#52525b", fontSize: 10, fontFamily: "monospace" } }} />
          <Tooltip content={<FrontierTooltip />} />

          {/* Mission reference lines */}
          {missionMode && (
            <>
              <ReferenceLine x={10} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: "Max Risk 10%", fill: "#f43f5e", fontSize: 9, fontFamily: "monospace", position: "insideTopRight" }} />
              <ReferenceLine y={8} stroke="#34d399" strokeDasharray="4 4" label={{ value: "Min Return 8%", fill: "#34d399", fontSize: 9, fontFamily: "monospace", position: "insideTopRight" }} />
            </>
          )}

          {/* Step 3: Straight dotted line (ρ=1) */}
          {step >= 3 && step <= 3 && (
            <Scatter name="No-Synergy Line" data={straightLine} fill="none" r={0}
              line={{ stroke: "#52525b", strokeWidth: 1.5, strokeDasharray: "6 4" }} lineType="fitting" />
          )}

          {/* Step 4+: Curved frontier */}
          {step >= 4 && (
            <>
              {/* Ghost straight line for comparison */}
              <Scatter name="ρ=1 Line" data={straightLine} fill="none" r={0}
                line={{ stroke: "#3f3f46", strokeWidth: 1, strokeDasharray: "4 4" }} lineType="fitting" />
              {/* Actual curved frontier */}
              <Scatter name="Frontier" data={curvedFrontier} fill="#52525b" r={1.5}
                line={{ stroke: "#71717a", strokeWidth: 1.5 }} lineType="fitting" />
            </>
          )}

          {/* Step 1+: Equity dot */}
          {step >= 1 && (
            <Scatter name={usePro ? "Equity" : "Hitter"} data={equityDot} fill="#f59e0b" r={8} shape="circle" />
          )}

          {/* Step 2+: Debt dot */}
          {step >= 2 && (
            <Scatter name={usePro ? "Debt" : "Bowler"} data={debtDot} fill="#22d3ee" r={8} shape="circle" />
          )}

          {/* Step 3+: User's team dot */}
          {step >= 3 && (
            <Scatter name="Your Team" data={userDot} fill="#fbbf24" r={6}
              shape={(props: any) => (
                <g>
                  <circle cx={props.cx} cy={props.cy} r={8} fill="#fbbf24" opacity={0.2} />
                  <circle cx={props.cx} cy={props.cy} r={5} fill="#fbbf24" stroke="#fef3c7" strokeWidth={1.5} />
                </g>
              )}
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function PortfolioSimulator() {
  const [step, setStep] = useState(0);
  const [equityWeight, setEquityWeight] = useState(50);
  const [correlation, setCorrelation] = useState(1);
  const [revealDone, setRevealDone] = useState(false);
  const [showReveal, setShowReveal] = useState(false);

  const [missionEq, setMissionEq] = useState(50);
  const [missionCorr, setMissionCorr] = useState(0.3);

  const isMission = step === 6;
  const w1 = isMission ? missionEq / 100 : equityWeight / 100;
  const rho = isMission ? missionCorr : step >= 4 ? correlation : 1;

  const portReturn = useMemo(() => calcPortfolioReturn(w1), [w1]);
  const portRisk = useMemo(() => calcPortfolioRisk(w1, rho), [w1, rho]);
  const sharpe = useMemo(() => calcSharpeRatio(portReturn, portRisk), [portReturn, portRisk]);

  const usePro = step >= 5 && revealDone;
  const meta = STEPS[step];
  const missionComplete = isMission && portRisk < 10 && portReturn >= 8;

  useEffect(() => {
    if (step === 5 && !revealDone) setShowReveal(true);
  }, [step, revealDone]);

  useEffect(() => {
    if (step === 6) { setMissionEq(50); setMissionCorr(0.3); }
  }, [step]);

  // Reset correlation to +1 on step 3 so line starts straight
  useEffect(() => {
    if (step === 3) setCorrelation(1);
    if (step === 4) setCorrelation(0.5);
  }, [step]);

  const nextLabel =
    step === 0 ? "Meet the first player →"
      : step === 1 ? "Add the second player →"
        : step === 2 ? "Mix them together →"
          : step === 3 ? "Discover the magic →"
            : step === 4 ? "See the Wall Street names →"
              : step === 5 ? (revealDone ? "Take the mission →" : null)
                : null;

  const isLast = step === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100"
      style={{ fontFamily: "var(--font-mono, 'JetBrains Mono'), 'Fira Mono', monospace" }}>

      <AnimatePresence>
        {showReveal && <WallStreetReveal onDone={() => { setRevealDone(true); setShowReveal(false); }} />}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-5 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase">Finance Lab · Portfolio Theory</span>
            <span className="text-[10px] font-mono text-zinc-600">{step + 1} / {STEPS.length}</span>
          </div>
          <ProgressBar step={step} total={STEPS.length} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* ═══ LEFT ═══ */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div key={`title-${step}`} variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="mb-2">
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{meta.tag}</p>
                <h1 className="text-2xl font-bold text-zinc-100 mb-2 leading-tight">{meta.tagline}</h1>
                {meta.body && <p className="text-sm text-zinc-400 leading-relaxed">{meta.body}</p>}
                {meta.isReveal && !revealDone && <p className="text-sm text-zinc-600 italic">Translating the cricket field…</p>}
                {meta.isReveal && revealDone && (
                  <motion.p variants={fadeUp} initial="hidden" animate="visible" className="text-sm text-zinc-400 leading-relaxed">
                    &quot;Heavy Hitters&quot; = <span className="text-amber-400 font-bold">Equities</span>. &quot;Steady Bowlers&quot; = <span className="text-cyan-400 font-bold">Debt</span>. &quot;Pitch Synergy&quot; = <span className="text-rose-400 font-bold">Correlation</span>. &quot;Inconsistency&quot; = <span className="text-emerald-400 font-bold">Standard Deviation</span>. Same math. Real names.
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Step 0–2: Info cards */}
            <AnimatePresence>
              {step <= 2 && (
                <motion.div key="info-cards" variants={stagger} initial="hidden" animate="visible" exit="exit" className="space-y-3">
                  {step >= 1 && (
                    <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl border-2 border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-xl">🏏</div>
                      <div>
                        <p className="text-xs font-bold font-mono text-amber-400">Heavy Hitter</p>
                        <p className="text-[10px] font-mono text-zinc-500">Return: <span className="text-amber-300">15%</span> · Risk: <span className="text-amber-300">20%</span></p>
                      </div>
                    </motion.div>
                  )}
                  {step >= 2 && (
                    <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-cyan-500/20 rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl border-2 border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center text-xl">🎯</div>
                      <div>
                        <p className="text-xs font-bold font-mono text-cyan-400">Steady Bowler</p>
                        <p className="text-[10px] font-mono text-zinc-500">Return: <span className="text-cyan-300">6%</span> · Risk: <span className="text-cyan-300">5%</span></p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3: Weight slider only */}
            <AnimatePresence>
              {step === 3 && (
                <motion.div key="ctrl-3" variants={fadeUp} initial="hidden" animate="visible"
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Team Mix</p>
                  <SliderInput label="Heavy Hitters %" hint={`Steady Bowlers: ${100 - equityWeight}%`}
                    min={0} max={100} step={5} value={equityWeight} onChange={setEquityWeight} accent="amber" />
                  <AllocationBar equityPct={equityWeight} usePro={false} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 4: Weight + Correlation */}
            <AnimatePresence>
              {step === 4 && (
                <motion.div key="ctrl-4" variants={fadeUp} initial="hidden" animate="visible"
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Team Mix + Pitch Conditions</p>
                  <SliderInput label="Heavy Hitters %" hint={`Steady Bowlers: ${100 - equityWeight}%`}
                    min={0} max={100} step={5} value={equityWeight} onChange={setEquityWeight} accent="amber" />
                  <AllocationBar equityPct={equityWeight} usePro={false} />
                  <SliderInput label="Pitch Synergy (Correlation)"
                    hint={correlation <= -0.5 ? "🌈 Mixed pitch — risk melts away" : correlation >= 0.8 ? "⚠️ Turning pitch — everyone fails together" : "Drag left to see the magic"}
                    min={-1} max={1} step={0.1} value={correlation} onChange={setCorrelation} accent="cyan" suffix="" />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-500">-1</span>
                    <div className="flex-1 h-2 rounded-full bg-zinc-800 relative overflow-hidden">
                      <motion.div animate={{ width: `${((correlation + 1) / 2) * 100}%` }} transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        className={`h-full rounded-full ${correlation < 0 ? "bg-gradient-to-r from-emerald-500 to-cyan-500" : "bg-gradient-to-r from-cyan-500 to-rose-500"}`} />
                    </div>
                    <span className="text-[10px] font-mono text-rose-500">+1</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 5 (reveal done): Pro controls */}
            <AnimatePresence>
              {step === 5 && revealDone && (
                <motion.div key="ctrl-pro" variants={fadeUp} initial="hidden" animate="visible"
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Portfolio Parameters</p>
                  <SliderInput label="Equity Weight (w₁)" hint={`Debt: ${100 - equityWeight}%`}
                    min={0} max={100} step={5} value={equityWeight} onChange={setEquityWeight} accent="amber" />
                  <AllocationBar equityPct={equityWeight} usePro />
                  <SliderInput label="Correlation (ρ)" hint="Between equity and debt" min={-1} max={1} step={0.1}
                    value={correlation} onChange={setCorrelation} accent="cyan" suffix="" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mission */}
            <AnimatePresence>
              {isMission && (
                <motion.div key="mission" variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
                  <motion.div layout className={`rounded-2xl border-2 p-5 transition-all duration-500 ${missionComplete ? "border-emerald-400 bg-emerald-400/5 shadow-[0_0_32px_4px_rgba(52,211,153,0.15)]" : "border-amber-500/50 bg-amber-500/5"}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">{missionComplete ? "🎯" : "📡"}</span>
                      <div>
                        <p className={`text-sm font-bold font-mono mb-1.5 ${missionComplete ? "text-emerald-400" : "text-amber-400"}`}>
                          {missionComplete ? "Portfolio secured." : "Mission active"}
                        </p>
                        {missionComplete ? (
                          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-zinc-300 leading-relaxed">
                            Risk under 10%, return above 8%. Diversification and correlation are your shields. Markowitz would approve.
                          </motion.p>
                        ) : (
                          <p className="text-sm text-zinc-400 leading-relaxed">
                            Keep Risk <span className="text-rose-400 font-bold">&lt; 10%</span> and Return <span className="text-emerald-400 font-bold">≥ 8%</span>.
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
                    <SliderInput label="Equity Weight" hint={`Debt: ${100 - missionEq}%`} min={0} max={100} step={5} value={missionEq} onChange={setMissionEq} accent="amber" />
                    <AllocationBar equityPct={missionEq} usePro />
                    <SliderInput label="Correlation (ρ)" hint="Lower = better diversification" min={-1} max={1} step={0.1} value={missionCorr} onChange={setMissionCorr} accent="cyan" suffix="" />
                    <div className="flex items-center gap-2 text-xs font-mono pt-2 border-t border-zinc-800 flex-wrap">
                      <span className="text-zinc-600">Risk:</span>
                      <span className={`font-bold ${portRisk < 10 ? "text-emerald-400" : "text-rose-400"}`}>{portRisk.toFixed(1)}%</span>
                      <span className="text-zinc-700">·</span>
                      <span className="text-zinc-600">Return:</span>
                      <span className={`font-bold ${portReturn >= 8 ? "text-emerald-400" : "text-rose-400"}`}>{portReturn.toFixed(1)}%</span>
                      <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border ${missionComplete ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" : "text-rose-400 border-rose-500/40 bg-rose-500/10"}`}>
                        {missionComplete ? "Target Hit ✓" : "Not Yet"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ═══ RIGHT ═══ */}
          <div className="space-y-4">
            {/* The chart — always visible, builds progressively */}
            <ProgressiveChart step={step} equityWeight={isMission ? missionEq : equityWeight}
              correlation={isMission ? missionCorr : correlation} missionMode={isMission} usePro={usePro} />

            {/* Stats (step 3+) */}
            <AnimatePresence>
              {step >= 3 && (
                <motion.div key="stats" variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3">
                  <StatCard label={usePro ? "E(Rₚ)" : "Avg Score"} value={`${portReturn.toFixed(1)}%`} accent="amber" />
                  <StatCard label={usePro ? "σₚ" : "Inconsistency"} value={`${portRisk.toFixed(1)}%`}
                    accent={portRisk > 15 ? "rose" : portRisk > 10 ? "amber" : "emerald"} />
                  <StatCard label="Sharpe" value={sharpe.toFixed(2)} accent="cyan" />
                  <StatCard label={usePro ? "Eq / Debt" : "Hit / Bowl"} value={`${(w1 * 100).toFixed(0)} / ${((1 - w1) * 100).toFixed(0)}`} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
            className="px-4 py-2 text-xs font-mono text-zinc-500 border border-zinc-800 rounded-xl hover:border-zinc-600 hover:text-zinc-300 transition-colors disabled:opacity-20 disabled:cursor-not-allowed">← back</motion.button>
          <AnimatePresence mode="wait">
            {!isLast ? (
              nextLabel && (
                <motion.button key={`next-${step}`} variants={fadeUp} initial="hidden" animate="visible" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setStep((s) => s + 1)} className="px-6 py-2.5 text-sm font-bold font-mono bg-amber-500 text-zinc-950 rounded-xl hover:bg-amber-400 transition-colors">{nextLabel}</motion.button>
              )
            ) : (
              <motion.button key="restart" variants={fadeUp} initial="hidden" animate="visible" whileTap={{ scale: 0.96 }}
                onClick={() => { setStep(0); setEquityWeight(50); setCorrelation(1); setMissionEq(50); setMissionCorr(0.3); setRevealDone(false); }}
                className="px-5 py-2.5 text-sm font-mono text-zinc-400 border border-zinc-700 rounded-xl hover:border-zinc-500 hover:text-zinc-200 transition-colors">↺ restart</motion.button>
            )}
          </AnimatePresence>
        </div>
        <p className="text-center text-[10px] text-zinc-700 mt-6 font-mono">Finance Lab · Portfolio Theory · ₹25 · financelab.in</p>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend,
} from "recharts";

// ─── Types ─────────────────────────────────────────────────────────────────

type TrustId = "solid" | "shaky" | "jobless" | "ghosting";
type TrustColorKey = "emerald" | "amber" | "rose" | "red";
type AccentColor = "amber" | "cyan";
type BondTypeId = "annual" | "semi" | "quarterly" | "monthly" | "zero";

interface BondType {
  id: BondTypeId;
  label: string;
  freq: number;
  isZeroCoupon: boolean;
}

interface TrustLevel {
  id: TrustId;
  label: string;
  emoji: string;
  ytmBoost: number;
  color: TrustColorKey;
}

interface TrustColorSet {
  text: string;
  border: string;
  bg: string;
}

interface StepDef {
  id: number;
  tag: string;
  tagline: string;
  body: string | null;
  isReveal?: boolean;
}

interface CurvePoint {
  ytm: string;
  price: number;
  par: number;
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

// ─── Pure Finance ──────────────────────────────────────────────────────────

function calcBondPrice(
  faceValue: number,
  couponRate: number,
  ytm: number,
  years: number,
  freq: number = 2,
): number {
  const c = (faceValue * couponRate) / freq;
  const r = ytm / freq;
  const n = years * freq;
  if (r === 0) return c * n + faceValue;
  return (c * (1 - Math.pow(1 + r, -n))) / r + faceValue / Math.pow(1 + r, n);
}

function calcModDuration(
  faceValue: number,
  couponRate: number,
  ytm: number,
  years: number,
  freq: number = 2,
): number {
  const price = calcBondPrice(faceValue, couponRate, ytm, years, freq);
  const c = (faceValue * couponRate) / freq;
  const r = ytm / freq;
  const n = years * freq;
  let mac = 0;
  for (let t = 1; t <= n; t++) {
    const cf = t === n ? c + faceValue : c;
    mac += (t / freq) * (cf / Math.pow(1 + r, t));
  }
  return mac / price / (1 + r);
}

// ─── Motion Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -14, transition: { duration: 0.22 } },
};

const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

const slideRight = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Constants ─────────────────────────────────────────────────────────────

const BOND_TYPES: BondType[] = [
  { id: "annual",    label: "Vanilla (Annual)", freq: 1,  isZeroCoupon: false },
  { id: "semi",      label: "Semi-Annual",      freq: 2,  isZeroCoupon: false },
  { id: "quarterly", label: "Quarterly",         freq: 4,  isZeroCoupon: false },
  { id: "monthly",   label: "Monthly",           freq: 12, isZeroCoupon: false },
  { id: "zero",      label: "Zero-Coupon",       freq: 1,  isZeroCoupon: true  },
];

const TRUST_LEVELS: TrustLevel[] = [
  { id: "solid",    label: "Solid job, IIT grad",  emoji: "😎", ytmBoost: 0,  color: "emerald" },
  { id: "shaky",    label: "Startup, uncertain",   emoji: "😬", ytmBoost: 3,  color: "amber"   },
  { id: "jobless",  label: "Just lost her job",    emoji: "😰", ytmBoost: 7,  color: "rose"    },
  { id: "ghosting", label: "Won't pick up calls",  emoji: "💀", ytmBoost: 12, color: "red"     },
];

const TRUST_COLOR: Record<TrustColorKey, TrustColorSet> = {
  emerald: { text: "text-emerald-400", border: "border-emerald-500/40", bg: "bg-emerald-500/10" },
  amber:   { text: "text-amber-400",   border: "border-amber-500/40",   bg: "bg-amber-500/10"   },
  rose:    { text: "text-rose-400",    border: "border-rose-500/40",    bg: "bg-rose-500/10"    },
  red:     { text: "text-red-400",     border: "border-red-500/40",     bg: "bg-red-500/10"     },
};

const TRUST_DISPLAY_NAME: Record<TrustId, string> = {
  solid: "Solid",
  shaky: "Shaky",
  jobless: "Jobless",
  ghosting: "Ghosting",
};

const STEPS: StepDef[] = [
  {
    id: 0,
    tag: "The Loan",
    tagline: "You're lending ₹1,000 to your friend Tanishka.",
    body: "Your friend Tanishka needs money. You lend her ₹1,000. She promises to return it in 5 years. That ₹1,000 — that's the Face Value. The anchor. The promise.",
  },
  {
    id: 1,
    tag: "The Pizza Promise",
    tagline: "Tanishka sweetens the deal.",
    body: "Tanishka says: 'I'll pay you ₹80 every year — like a pizza dinner every few months — until I pay back the full ₹1,000.' That annual payment as a % of what you lent? That's the Pizza Promise. Move the slider. Watch what you'd earn.",
  },
  {
    id: 2,
    tag: "The Trust Factor",
    tagline: "But what if Tanishka's life gets complicated?",
    body: "Would you lend at the same rate if Tanishka loses her job? No — you'd demand more interest to compensate for the risk. That's the Trust Factor. When trust falls, the market's demanded yield rises — and your bond's price drops to match.",
  },
  {
    id: 3,
    tag: "Wall Street Reveal",
    tagline: "Finance has a different name for everything.",
    body: null,
    isReveal: true,
  },
  {
    id: 4,
    tag: "The Curve",
    tagline: "The inverse relationship, drawn.",
    body: "Every point on this curve is a Tanishka at a different trust level. The lower the trust (higher YTM), the lower the price. The shape — that convex bow — tells you price falls slower than it rises. That's convexity.",
  },
  {
    id: 5,
    tag: "Mission",
    tagline: "The RBI just hiked. Be the market.",
    body: null,
  },
];

// ─── Bond Type Selector ───────────────────────────────────────────────────

interface BondTypeSelectorProps {
  selected: BondTypeId;
  onChange: (id: BondTypeId) => void;
}

function BondTypeSelector({ selected, onChange }: BondTypeSelectorProps) {
  return (
    <motion.div variants={fadeUp} className="space-y-2">
      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
        Bond Type
      </p>
      <div className="flex flex-wrap gap-1.5">
        {BOND_TYPES.map((bt) => {
          const active = selected === bt.id;
          return (
            <motion.button
              key={bt.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(bt.id)}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-lg border transition-all duration-200 ${
                active
                  ? bt.isZeroCoupon
                    ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
                    : "border-amber-500/40 bg-amber-500/10 text-amber-400"
                  : "border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400"
              }`}
            >
              {bt.label}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Seesaw ────────────────────────────────────────────────────────────────

interface SeesawProps {
  ytm: number;
  coupon: number;
  freq: number;
}

function Seesaw({ ytm, coupon, freq }: SeesawProps) {
  const diff = ytm - coupon;
  const tiltDeg = Math.max(-28, Math.min(28, diff * 2.2));
  const pivotX = 200;
  const pivotY = 90;
  const armLen = 140;

  const priceNow = calcBondPrice(1000, coupon / 100, ytm / 100, 5, freq);
  const isDiscount = priceNow < 1000;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 overflow-hidden">
      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
        The Seesaw — price vs yield
      </p>
      <svg width="100%" viewBox="0 0 400 160" style={{ overflow: "visible" }}>
        <polygon points="200,115 185,140 215,140" fill="#3f3f46" />
        <rect x="170" y="138" width="60" height="6" rx="3" fill="#3f3f46" />

        <motion.g
          animate={{ rotate: tiltDeg }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          style={{ originX: `${pivotX}px`, originY: `${pivotY}px` }}
        >
          <rect x={pivotX - armLen} y={pivotY - 4} width={armLen * 2} height={8} rx="4" fill="#52525b" />

          <rect x={pivotX - armLen - 38} y={pivotY - 28} width={76} height={34} rx="8"
            fill={isDiscount ? "#1c0a0a" : "#0f2418"} stroke={isDiscount ? "#f43f5e" : "#34d399"} strokeWidth="1.5" />
          <text x={pivotX - armLen} y={pivotY - 16} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={isDiscount ? "#fda4af" : "#6ee7b7"} fontWeight="600">PRICE</text>
          <text x={pivotX - armLen} y={pivotY - 4} textAnchor="middle" fontSize="11" fontFamily="monospace" fill={isDiscount ? "#f43f5e" : "#34d399"} fontWeight="700">₹{priceNow.toFixed(0)}</text>

          <rect x={pivotX + armLen - 38} y={pivotY - 28} width={76} height={34} rx="8" fill="#131a29" stroke="#22d3ee" strokeWidth="1.5" />
          <text x={pivotX + armLen} y={pivotY - 16} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#7dd3fc" fontWeight="600">YTM</text>
          <text x={pivotX + armLen} y={pivotY - 4} textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#22d3ee" fontWeight="700">{ytm}%</text>
        </motion.g>

        <circle cx={pivotX} cy={pivotY} r="5" fill="#71717a" />
        <text x="60" y="155" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#52525b">{isDiscount ? "⬇ fell" : "stable"}</text>
        <text x="340" y="155" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#52525b">{ytm > 8 ? "⬆ rose" : "at base"}</text>
      </svg>
    </div>
  );
}

// ─── Trust Selector ────────────────────────────────────────────────────────

interface TrustSelectorProps {
  trustId: TrustId;
  onChange: (id: TrustId) => void;
}

function TrustSelector({ trustId, onChange }: TrustSelectorProps) {
  return (
    <motion.div variants={fadeUp} className="space-y-2">
      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
        Tanishka&apos;s Trust Score
      </p>
      <div className="grid grid-cols-2 gap-2">
        {TRUST_LEVELS.map((t) => {
          const active = trustId === t.id;
          const c = TRUST_COLOR[t.color];
          return (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(t.id)}
              className={`rounded-xl border p-3 text-left transition-all duration-200 ${
                active ? `${c.border} ${c.bg}` : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{t.emoji}</span>
                <div>
                  <p className={`text-xs font-bold font-mono ${active ? c.text : "text-zinc-400"}`}>{TRUST_DISPLAY_NAME[t.id]}</p>
                  <p className="text-[10px] text-zinc-600 leading-tight mt-0.5">{t.label}</p>
                </div>
              </div>
              {active && (
                <p className={`text-[10px] font-mono mt-1.5 ${c.text}`}>+{t.ytmBoost}% to market demand</p>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Wall Street Reveal ────────────────────────────────────────────────────

interface WallStreetRevealProps {
  coupon: number;
  ytm: number;
  onDone: () => void;
}

function WallStreetReveal({ coupon, ytm, onDone }: WallStreetRevealProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 3200),
      setTimeout(() => { setPhase(4); onDone(); }, 4400),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = [
    { street: "Pizza Promise", pro: "Coupon Rate", value: `${coupon}% p.a.`, color: "amber" as const },
    { street: "Trust Score Penalty", pro: "Yield to Maturity (YTM)", value: `${ytm}%`, color: "cyan" as const },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 backdrop-blur-sm px-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <AnimatePresence>
          {phase >= 1 && (
            <motion.p key="headline" variants={fadeUp} initial="hidden" animate="visible"
              className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              Meanwhile, on Dalal Street…
            </motion.p>
          )}
        </AnimatePresence>
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={item.street} className="relative h-14 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {phase < 2 + i ? (
                  <motion.div key="street" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.3 } }} className="absolute flex items-center gap-3">
                    <span className="text-2xl font-bold font-mono text-zinc-300">{item.street}</span>
                  </motion.div>
                ) : (
                  <motion.div key="pro" initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }} className="absolute flex items-center gap-3">
                    <span className={`text-2xl font-bold font-mono ${item.color === "amber" ? "text-amber-400" : "text-cyan-400"}`}>{item.pro}</span>
                    <span className={`text-lg font-mono ${item.color === "amber" ? "text-amber-300" : "text-cyan-300"}`}>{item.value}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <AnimatePresence>
          {phase >= 4 && (
            <motion.p key="sub" variants={fadeUp} initial="hidden" animate="visible" className="text-sm text-zinc-500 font-mono">
              Same concept. Different vocabulary.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Shared UI Pieces ──────────────────────────────────────────────────────

interface SliderInputProps {
  label: string;
  hint?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  accent?: AccentColor;
  disabled?: boolean;
}

function SliderInput({ label, hint, min, max, step, value, onChange, accent = "amber", disabled = false }: SliderInputProps) {
  const vCol = accent === "cyan" ? "text-cyan-400" : "text-amber-400";
  const acc = accent === "cyan" ? "accent-cyan-500" : "accent-amber-500";
  return (
    <motion.div variants={slideRight} className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <label className={`text-xs font-mono ${disabled ? "text-zinc-600" : "text-zinc-400"}`}>{label}</label>
        <span className={`text-sm font-bold font-mono ${disabled ? "text-zinc-600" : vCol}`}>{value}%</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} disabled={disabled}
        onChange={(e) => !disabled && onChange(Number(e.target.value))}
        className={`w-full h-1 bg-zinc-800 rounded-full appearance-none ${disabled ? "opacity-30 cursor-not-allowed" : `cursor-pointer ${acc}`}`} />
      {hint && <p className="text-[10px] text-zinc-600 mt-0.5">{hint}</p>}
    </motion.div>
  );
}

interface PriceCardProps { price: number; faceValue: number; missionComplete: boolean; bondLabel: string; }

function PriceCard({ price, faceValue, missionComplete, bondLabel }: PriceCardProps) {
  const isDiscount = price < faceValue;
  const isPremium = price > faceValue;
  const borderCls = missionComplete
    ? "border-emerald-400 shadow-[0_0_28px_4px_rgba(52,211,153,0.22)]"
    : isDiscount ? "border-rose-500/50" : isPremium ? "border-amber-500/40" : "border-zinc-700";
  const priceCol = isDiscount ? "text-rose-400" : isPremium ? "text-amber-400" : "text-zinc-100";
  const status = isDiscount ? "Discount" : isPremium ? "Premium" : "Par";
  const pillCls = isDiscount
    ? "text-rose-400 border-rose-500/40 bg-rose-500/10"
    : isPremium ? "text-amber-400 border-amber-500/40 bg-amber-500/10" : "text-zinc-400 border-zinc-700 bg-zinc-800";

  return (
    <motion.div layout animate={{ scale: isDiscount ? 0.97 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`relative rounded-2xl border-2 p-5 bg-zinc-900/80 transition-shadow duration-500 ${borderCls}`}>
      {missionComplete && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 rounded-2xl bg-emerald-400/5 pointer-events-none" />}
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">Bond Price</p>
        <span className="text-[10px] font-mono text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded-md">{bondLabel}</span>
      </div>
      <motion.p key={price.toFixed(0)} initial={{ opacity: 0.5, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
        className={`text-3xl font-bold font-mono ${priceCol}`}>₹{price.toFixed(2)}</motion.p>
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${pillCls}`}>{status}</span>
        {missionComplete && (
          <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 400 }}
            className="text-xs font-mono text-emerald-400 border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 rounded-full">✓ Mission complete</motion.span>
        )}
      </div>
    </motion.div>
  );
}

function StatMini({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <motion.div variants={fadeUp} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3">
      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-base font-bold font-mono text-zinc-200">{value}</p>
      {sub && <p className="text-[10px] text-zinc-500 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono">
      <p className="text-zinc-400 mb-1">YTM: {label}%</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: ₹{Number(p.value).toFixed(2)}</p>
      ))}
    </div>
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

// ─── Main Component ────────────────────────────────────────────────────────

export default function BondSimulator() {
  const [step, setStep] = useState(0);
  const [couponRate, setCouponRate] = useState(8);
  const [bondTypeId, setBondTypeId] = useState<BondTypeId>("semi");
  const [trustId, setTrustId] = useState<TrustId>("solid");
  const [revealDone, setRevealDone] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [missionYtm, setMissionYtm] = useState(8);

  const faceValue = 1000;
  const tenor = 5;

  const bondType = BOND_TYPES.find((b) => b.id === bondTypeId) ?? BOND_TYPES[1];
  const freq = bondType.freq;
  const effectiveCoupon = bondType.isZeroCoupon ? 0 : couponRate;

  // Lock coupon to 0 when zero-coupon is selected
  useEffect(() => {
    if (bondType.isZeroCoupon) setCouponRate(0);
  }, [bondType.isZeroCoupon]);

  const trust = TRUST_LEVELS.find((t) => t.id === trustId) ?? TRUST_LEVELS[0];
  const storyYtm = Math.min(20, effectiveCoupon + trust.ytmBoost);
  const activeYtm = step === 5 ? missionYtm : storyYtm;

  const price = useMemo(
    () => calcBondPrice(faceValue, effectiveCoupon / 100, activeYtm / 100, tenor, freq),
    [effectiveCoupon, activeYtm, freq],
  );

  const modDuration = useMemo(
    () => calcModDuration(faceValue, effectiveCoupon / 100, activeYtm / 100, tenor, freq),
    [effectiveCoupon, activeYtm, freq],
  );

  const curveData: CurvePoint[] = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        const y = 0.5 + i * 0.5;
        return {
          ytm: y.toFixed(1),
          price: calcBondPrice(faceValue, effectiveCoupon / 100, y / 100, tenor, freq),
          par: faceValue,
        };
      }),
    [effectiveCoupon, freq],
  );

  const missionComplete = step === 5 && price < faceValue;
  const meta = STEPS[step];

  useEffect(() => {
    if (step === 3 && !revealDone) setShowReveal(true);
  }, [step, revealDone]);

  useEffect(() => {
    if (step === 5) {
      setCouponRate(8);
      setBondTypeId("semi");
      setTrustId("solid");
      setMissionYtm(8);
    }
  }, [step]);

  const nextLabel =
    step === 0 ? "Lend Tanishka the money →"
      : step === 1 ? "Things get complicated →"
        : step === 2 ? "See the Wall Street translation →"
          : step === 3 ? (revealDone ? "See it on a chart →" : null)
            : step === 4 ? "Take the mission →" : null;

  const isLast = step === STEPS.length - 1;
  const usePro = step >= 3;

  const freqLabel = bondType.isZeroCoupon ? "Zero-Coupon" : bondType.label;
  const couponHint = bondType.isZeroCoupon
    ? "No coupons — only face value at maturity"
    : usePro
      ? `Paid ${bondType.label.toLowerCase()} · f=${freq}`
      : `₹${((faceValue * effectiveCoupon) / 100 / freq).toFixed(0)} per payment`;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100"
      style={{ fontFamily: "var(--font-mono, 'JetBrains Mono'), 'Fira Mono', monospace" }}>

      <AnimatePresence>
        {showReveal && (
          <WallStreetReveal coupon={effectiveCoupon} ytm={storyYtm}
            onDone={() => { setRevealDone(true); setShowReveal(false); }} />
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase">Finance Lab · Fixed Income</span>
            <span className="text-[10px] font-mono text-zinc-600">{step + 1} / {STEPS.length}</span>
          </div>
          <ProgressBar step={step} total={STEPS.length} />
        </div>

        {/* Step title */}
        <AnimatePresence mode="wait">
          <motion.div key={`title-${step}`} variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="mb-6">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{meta.tag}</p>
            <h1 className="text-2xl font-bold text-zinc-100 mb-2 leading-tight">{meta.tagline}</h1>
            {meta.body && <p className="text-sm text-zinc-400 leading-relaxed">{meta.body}</p>}
            {meta.isReveal && !revealDone && <p className="text-sm text-zinc-600 italic">Translating Tanishka&apos;s world…</p>}
            {meta.isReveal && revealDone && (
              <motion.p variants={fadeUp} initial="hidden" animate="visible" className="text-sm text-zinc-400 leading-relaxed">
                Every &quot;Pizza Promise&quot; is a <span className="text-amber-400 font-bold">Coupon Rate</span>. Every &quot;Trust Penalty&quot; is a <span className="text-cyan-400 font-bold">Yield to Maturity</span>. The math doesn&apos;t change. Only the words do.
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Lab body */}
        <div className="space-y-4">
          {/* Step 0 */}
          <AnimatePresence>
            {step === 0 && (
              <motion.div key="fv" variants={stagger} initial="hidden" animate="visible" exit="exit" className="space-y-3">
                <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 flex items-center gap-5">
                  <div className="w-16 h-16 flex-shrink-0 rounded-xl border-2 border-amber-500/60 bg-amber-500/10 flex items-center justify-center">
                    <span className="text-lg font-bold font-mono text-amber-400">₹1k</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-zinc-500 mb-1">The Loan (Face Value)</p>
                    <p className="text-3xl font-bold font-mono text-zinc-100">₹1,000</p>
                    <p className="text-xs text-zinc-500 mt-1">Tanishka gets this. You get it back in 5 years.</p>
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-xl mt-0.5">🤝</span>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    This is the simplest financial contract: I give you money now, you return the same amount later. Everything else — the interest, the risk, the price — layers on top of this promise.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Price card */}
          <AnimatePresence>
            {step >= 1 && (
              <motion.div key="price" variants={fadeUp} initial="hidden" animate="visible">
                <PriceCard price={price} faceValue={faceValue} missionComplete={missionComplete} bondLabel={freqLabel} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls (step 1–2) */}
          <AnimatePresence>
            {step >= 1 && step <= 2 && (
              <motion.div key="controls-story" variants={fadeUp} initial="hidden" animate="visible"
                className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-5">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  {step === 1 ? "The Pizza Promise" : "Tanishka's situation"}
                </p>
                <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
                  <BondTypeSelector selected={bondTypeId} onChange={setBondTypeId} />
                  <SliderInput
                    label={usePro ? "Coupon Rate" : "Pizza Promise (annual interest)"}
                    hint={couponHint}
                    min={0} max={20} step={0.5}
                    value={effectiveCoupon}
                    onChange={setCouponRate}
                    accent="amber"
                    disabled={bondType.isZeroCoupon}
                  />
                  <AnimatePresence>
                    {step >= 2 && (
                      <motion.div key="trust" variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
                        <TrustSelector trustId={trustId} onChange={setTrustId} />
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 flex items-center justify-between">
                          <span className="text-xs font-mono text-zinc-500">{usePro ? "Yield to Maturity (YTM)" : "Market's demanded return"}</span>
                          <motion.span key={storyYtm} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-bold font-mono text-cyan-400">{storyYtm}%</motion.span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pro controls (step 3–4) */}
          <AnimatePresence>
            {step >= 3 && revealDone && step <= 4 && (
              <motion.div key="controls-pro" variants={fadeUp} initial="hidden" animate="visible"
                className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-5">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Controls</p>
                <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
                  <BondTypeSelector selected={bondTypeId} onChange={setBondTypeId} />
                  <SliderInput label="Coupon Rate" hint={couponHint} min={0} max={20} step={0.5}
                    value={effectiveCoupon} onChange={setCouponRate} accent="amber" disabled={bondType.isZeroCoupon} />
                  <SliderInput label="Yield to Maturity (YTM)" hint="The market's demanded return" min={0.5} max={20} step={0.25}
                    value={activeYtm} onChange={() => {}} accent="cyan" disabled />
                  <TrustSelector trustId={trustId} onChange={setTrustId} />
                </motion.div>
                <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-3 gap-3 pt-3 border-t border-zinc-800">
                  <StatMini label="Duration" value={modDuration.toFixed(2)} sub="years" />
                  <StatMini label="Coupon / Period" value={`₹${((faceValue * effectiveCoupon) / 100 / freq).toFixed(0)}`} sub={`×${tenor * freq} payments`} />
                  <StatMini label="DV01" value={`₹${Math.abs(-modDuration * 0.01 * price).toFixed(2)}`} sub="per 1% move" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Seesaw */}
          <AnimatePresence>
            {step >= 2 && step <= 4 && (
              <motion.div key="seesaw" variants={fadeUp} initial="hidden" animate="visible">
                <Seesaw ytm={activeYtm} coupon={effectiveCoupon} freq={freq} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chart */}
          <AnimatePresence>
            {step >= 4 && (
              <motion.div key="curve" variants={fadeUp} initial="hidden" animate="visible" className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Price vs YTM — convex curve</p>
                <ResponsiveContainer width="100%" height={210}>
                  <LineChart data={curveData} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
                    <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                    <XAxis dataKey="ytm" tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }} tickFormatter={(v: string) => `${v}%`} interval={3} />
                    <YAxis tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }} tickFormatter={(v: number) => `₹${v}`} width={58} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 10, fontFamily: "monospace", color: "#71717a" }} />
                    <ReferenceLine x={activeYtm.toFixed(1)} stroke="#22d3ee" strokeDasharray="4 4" label={{ value: "current", fill: "#22d3ee", fontSize: 9, fontFamily: "monospace" }} />
                    <ReferenceLine y={faceValue} stroke="#3f3f46" strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={2} dot={false} name="Bond Price" />
                    <Line type="monotone" dataKey="par" stroke="#3f3f46" strokeWidth={1} dot={false} name="Par ₹1000" strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mission */}
          <AnimatePresence>
            {step === 5 && (
              <motion.div key="mission" variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
                <motion.div layout className={`rounded-2xl border-2 p-5 transition-all duration-500 ${missionComplete ? "border-emerald-400 bg-emerald-400/5 shadow-[0_0_32px_4px_rgba(52,211,153,0.15)]" : "border-amber-500/50 bg-amber-500/5"}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{missionComplete ? "🎯" : "📡"}</span>
                    <div>
                      <p className={`text-sm font-bold font-mono mb-1.5 ${missionComplete ? "text-emerald-400" : "text-amber-400"}`}>
                        {missionComplete ? "Objective secured." : "Mission active"}
                      </p>
                      {missionComplete ? (
                        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-zinc-300 leading-relaxed">
                          Your bond is at a <strong className="text-emerald-400">discount</strong>. When the RBI hikes, new bonds pay more — so your old bond&apos;s price falls to compete. You&apos;ve just lived the most important law of fixed income.
                        </motion.p>
                      ) : (
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          The RBI just hiked. Raise the <span className="text-cyan-400 font-bold">YTM</span> above <span className="text-amber-400 font-bold">8%</span> until your bond trades at a strict <span className="text-rose-400 font-bold">Discount</span> (price &lt; ₹1,000).
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Instrument</p>
                    <span className="text-[10px] font-mono text-zinc-600">Coupon locked at 8%</span>
                  </div>
                  <SliderInput label="Yield to Maturity (YTM)" hint="Push above 8% to trigger the discount" min={0.5} max={20} step={0.25} value={missionYtm} onChange={setMissionYtm} accent="cyan" />
                  <div className="flex items-center gap-2 text-xs font-mono pt-1 border-t border-zinc-800">
                    <span className="text-zinc-600">Coupon</span>
                    <span className="text-amber-400 font-bold">8%</span>
                    <span className="text-zinc-700">→</span>
                    <span className="text-cyan-400 font-bold">{missionYtm}% YTM</span>
                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border ${price < faceValue ? "text-rose-400 border-rose-500/40 bg-rose-500/10" : price > faceValue ? "text-amber-400 border-amber-500/40 bg-amber-500/10" : "text-zinc-400 border-zinc-700"}`}>
                      {price < faceValue ? "Discount ✓" : price > faceValue ? "Premium" : "At Par"}
                    </span>
                  </div>
                </div>
                <Seesaw ytm={missionYtm} coupon={8} freq={2} />
              </motion.div>
            )}
          </AnimatePresence>
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
                onClick={() => { setStep(0); setCouponRate(8); setBondTypeId("semi"); setTrustId("solid"); setMissionYtm(8); setRevealDone(false); }}
                className="px-5 py-2.5 text-sm font-mono text-zinc-400 border border-zinc-700 rounded-xl hover:border-zinc-500 hover:text-zinc-200 transition-colors">↺ restart</motion.button>
            )}
          </AnimatePresence>
        </div>
        <p className="text-center text-[10px] text-zinc-700 mt-6 font-mono">Finance Lab · Fixed Income · ₹25 · financelab.in</p>
      </div>
    </div>
  );
}

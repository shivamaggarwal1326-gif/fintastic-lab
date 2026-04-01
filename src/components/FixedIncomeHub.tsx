"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Search, LineChart, Landmark,
  Home, Clock, ShieldAlert, TrendingUp, Anchor, Activity, Sliders
} from "lucide-react";
import BondSimulator from "./BondSimulator"; // Ensure this path is correct based on your folder structure
import FloatingFormulaBackground from "@/components/FloatingFormulaBackground";

// ═══════════════════════════════════════════════════════════════════════════
// FORMULAS & THEMES
// ═══════════════════════════════════════════════════════════════════════════

const FI_FORMULAS = [
  "PV = Σ [CF_t / (1+r)^t]",
  "MacDur = Σ [t × PV(CF_t)] / Price",
  "ModDur = MacDur / (1+y)",
  "ΔP/P ≈ -ModDur × Δy + ½C × (Δy)²",
  "Dirty Price = Clean Price + Accrued Interest",
  "YTM = (C + (F-P)/n) / ((F+P)/2)",
  "Z-Spread = YTM_bond - YTM_treasury",
  "OAS = Z-Spread - Option Value",
  "(1 + S_A)^A × (1 + f_{A,B-A}) = (1 + S_B)^B",
  "EL = PD × LGD",
  "PVBP = Duration × 0.0001 × Price",
  "V_A = V_L",
  "D_A = D_L"
];

const FI_BALLOON_COLORS = [
  { bg: "bg-cyan-900/40", text: "text-cyan-300", glow: "rgba(6,182,212,0)" },
  { bg: "bg-emerald-900/40", text: "text-emerald-300", glow: "rgba(16,185,129,0)" },
  { bg: "bg-teal-950/50", text: "text-teal-300", glow: "rgba(20,184,166,0)" },
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
                depth === level ? "bg-cyan-500/10 text-cyan-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
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
                  currentTab === tab.id ? "text-cyan-400" : "text-zinc-500 hover:text-zinc-300"
                }`}>
                {currentTab === tab.id && (<motion.div layoutId="activeTabFI" className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/20 rounded-lg" transition={{ type: "spring", stiffness: 400, damping: 30 }} />)}
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
// TOPIC DEFINITIONS & DATA (FULL 9 TOPICS)
// ═══════════════════════════════════════════════════════════════════════════

type TopicId = "bond-basics" | "bond-valuation" | "yield-measures" | "duration-convexity" | "term-structure" | "credit-spreads" | "embedded-options" | "mbs" | "immunization";

interface Topic { id: TopicId; title: string; subtitle: string; icon: React.ReactNode; accent: string; description: string; difficulty: string; }

const TOPICS: Topic[] = [
  { id: "bond-basics", title: "What is a Bond?", subtitle: "The Debt Contract", icon: <Landmark className="w-5 h-5" />, accent: "emerald", description: "Understand mechanics, face value, maturity, and the governing indentures of lending.", difficulty: "Beginner" },
  { id: "bond-valuation", title: "Bond Valuation", subtitle: "Time Value of Money", icon: <LineChart className="w-5 h-5" />, accent: "cyan", description: "The core mechanic: inverse relationships, DCF pricing, and the pull-to-par effect.", difficulty: "Intermediate" },
  { id: "yield-measures", title: "Yield Measures", subtitle: "YTM vs Reality", icon: <Activity className="w-5 h-5" />, accent: "amber", description: "Current Yield, YTM, Yield to Call (YTC), and why Realized Yield almost never matches YTM.", difficulty: "Intermediate" },
  { id: "duration-convexity", title: "Duration & Convexity", subtitle: "Interest Rate Risk", icon: <Clock className="w-5 h-5" />, accent: "rose", description: "Macaulay vs Modified Duration, the Taylor Series expansion, and how price curves bend.", difficulty: "Advanced" },
  { id: "term-structure", title: "Term Structure", subtitle: "The Yield Curve", icon: <TrendingUp className="w-5 h-5" />, accent: "emerald", description: "Spot rates, implied forward rates, and bootstrapping the theoretical zero-coupon curve.", difficulty: "Advanced" },
  { id: "credit-spreads", title: "Credit Spreads", subtitle: "Default Risk", icon: <ShieldAlert className="w-5 h-5" />, accent: "rose", description: "Probability of Default (PD), Loss Given Default (LGD), and calculating the Z-Spread.", difficulty: "Intermediate" },
  { id: "embedded-options", title: "Embedded Options", subtitle: "Callable & Puttable", icon: <Sliders className="w-5 h-5" />, accent: "cyan", description: "Why callable bonds exhibit negative convexity, and how to isolate risk using the OAS.", difficulty: "Advanced" },
  { id: "mbs", title: "Mortgage-Backed Securities", subtitle: "Securitization", icon: <Home className="w-5 h-5" />, accent: "cyan", description: "SMM, CPR, Prepayment Risk (Extension/Contraction), and PAC/TAC CMO tranches.", difficulty: "Advanced" },
  { id: "immunization", title: "Portfolio Immunization", subtitle: "Asset-Liability", icon: <Anchor className="w-5 h-5" />, accent: "emerald", description: "How pension funds guarantee future payouts using cash flow matching and duration targeting.", difficulty: "Advanced" },
];

const TOPIC_CONTENT: Partial<Record<TopicId, { theory: DepthExplanationProps; math?: React.ReactNode }>> = {
  "bond-basics": {
    theory: {
      beginner: <p>A <strong>Bond</strong> is simply a loan. Instead of going to a bank, a company or government borrows money from the public. In exchange, they promise to pay regular interest (the <strong>Coupon</strong>) and return the original borrowed amount (the <strong>Principal</strong> or Face Value) on a specific end date (the <strong>Maturity</strong>).</p>,
      intermediate: <p>Bonds are governed by an <strong>Indenture</strong>, a legally binding contract. This includes <strong>Covenants</strong>. <em>Affirmative covenants</em> dictate what the issuer must do (pay taxes, maintain insurance). <em>Negative covenants</em> restrict actions (cannot issue more senior debt, cannot sell key assets) to protect current bondholders.</p>,
      advanced: <p>In the event of bankruptcy, bonds follow the <strong>Absolute Priority Rule</strong>. Senior Secured debt is paid first from liquidated collateral, followed by Senior Unsecured, Subordinated (Junior) debt, and finally Equity. The pricing and credit rating of a bond are heavily dependent on this structural subordination.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">The Core Bond Components</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4 font-mono text-sm">
            <div className="flex justify-between border-b border-zinc-800/50 pb-2"><span className="text-emerald-400 font-bold">Face Value (Par)</span> <span className="text-zinc-400 text-right">The principal amount repaid at maturity.</span></div>
            <div className="flex justify-between border-b border-zinc-800/50 pb-2"><span className="text-cyan-400 font-bold">Coupon Rate</span> <span className="text-zinc-400 text-right">Fixed annual interest % paid on Par Value.</span></div>
            <div className="flex justify-between border-b border-zinc-800/50 pb-2"><span className="text-amber-400 font-bold">Maturity Date</span> <span className="text-zinc-400 text-right">The exact date the principal is returned.</span></div>
            <div className="flex justify-between"><span className="text-rose-400 font-bold">Periodicity</span> <span className="text-zinc-400 text-right">Annual, Semi-Annual, or Quarterly payments.</span></div>
          </div>
        </div>
      </motion.div>
    )
  },
  "bond-valuation": {
    theory: {
      beginner: <p>Bonds are priced using the time value of money. The price of a bond is simply the <strong>Present Value</strong> of all its future cash flows. If the required interest rate in the market goes up, the price of the existing bond must go down to compensate the buyer.</p>,
      intermediate: <p>If a bond's coupon rate is higher than the market yield, it trades at a <strong>Premium</strong> (above par). If the coupon is lower, it trades at a <strong>Discount</strong> (below par). Regardless of trading at a premium or discount, as the bond approaches maturity, its price gets "pulled to par".</p>,
      advanced: <p>Using a single YTM to discount all cash flows is an approximation. <strong>Arbitrage-Free Pricing</strong> dictates that each individual cash flow should be discounted at its respective spot rate for that specific maturity. If the market price deviates from the arbitrage-free price, traders will strip or reconstitute the bond for riskless profit.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Bond Pricing (DCF)</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center space-y-2">
            <p className="text-lg font-mono text-zinc-200">
              Price = Σ [ <span className="text-cyan-400">PMT</span> / (1 + <span className="text-amber-400">r</span>)^<span className="text-emerald-400">t</span> ] + [ <span className="text-rose-400">FV</span> / (1 + <span className="text-amber-400">r</span>)^<span className="text-emerald-400">N</span> ]
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm font-mono">
          <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-cyan-400 block mb-1">PMT</span> Coupon Payment</div>
          <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-amber-400 block mb-1">r</span> Yield to Maturity (YTM)</div>
          <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-emerald-400 block mb-1">t</span> Time period</div>
          <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-rose-400 block mb-1">FV</span> Face Value (Par)</div>
        </div>
      </motion.div>
    )
  },
  "yield-measures": {
    theory: {
      beginner: <p><strong>Current Yield</strong> is just the annual coupon divided by the current price. It ignores the capital gain/loss you'll take if you hold the bond to maturity. <strong>Yield to Maturity (YTM)</strong> is the comprehensive metric that includes both the interest payments and the final capital gain/loss.</p>,
      intermediate: <p>For bonds that can be paid off early by the issuer, you must calculate the <strong>Yield to Call (YTC)</strong>. The <strong>Yield to Worst (YTW)</strong> is simply the lowest possible yield an investor could receive, looking at the YTM and all possible YTC dates. Institutional investors always quote the YTW.</p>,
      advanced: <p>The YTM is an Internal Rate of Return (IRR). It mathematically assumes that every single coupon payment you receive is reinvested at exactly the YTM rate. If the yield curve is upward sloping or rates drop, reinvesting at the YTM is impossible, making your <strong>Realized Yield</strong> lower than the quoted YTM.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Yield Approximations</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center space-y-4">
            <p className="text-sm sm:text-lg font-mono text-zinc-200">Current Yield = <span className="text-cyan-400">Annual Coupon</span> / <span className="text-amber-400">Flat Price</span></p>
            <div className="w-full h-px bg-zinc-800"></div>
            <p className="text-sm sm:text-lg font-mono text-zinc-200">YTM ≈ (<span className="text-cyan-400">C</span> + (<span className="text-rose-400">F</span>-<span className="text-amber-400">P</span>)/<span className="text-emerald-400">n</span>) / ((<span className="text-rose-400">F</span>+<span className="text-amber-400">P</span>)/2)</p>
          </div>
        </div>
      </motion.div>
    )
  },
  "duration-convexity": {
    theory: {
      beginner: <p>When interest rates go up, bond prices go down. <strong>Duration</strong> measures exactly how much your bond's price will drop if interest rates rise by 1%. A bond with a duration of 5 will lose roughly 5% of its value if rates rise by 1%.</p>,
      intermediate: <p><strong>Macaulay Duration</strong> is the weighted average time (in years) it takes to receive all cash flows. <strong>Modified Duration</strong> divides Macaulay Duration by the yield to give the direct percentage price sensitivity. Traders also use <strong>PVBP (Price Value of a Basis Point)</strong> to see the absolute dollar change for a 0.01% yield move.</p>,
      advanced: <p>Duration is a linear estimate, but the true price-yield relationship is curved. This second derivative is <strong>Convexity</strong>. Because of convexity, when yields fall, the bond price rises <em>more</em> than duration predicts. Convexity is highly valuable, and investors must accept a lower yield to acquire bonds with high positive convexity.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Macaulay {"&"} Modified Duration</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center space-y-4">
            <p className="text-lg font-mono text-zinc-200">MacDur = Σ [ <span className="text-emerald-400">t</span> × <span className="text-cyan-400">PV(CF_t)</span> ] / <span className="text-amber-400">Price</span></p>
            <div className="w-full h-px bg-zinc-800"></div>
            <p className="text-lg font-mono text-zinc-200">ModDur = <span className="text-emerald-400">MacDur</span> / (1 + <span className="text-amber-400">Yield</span>)</p>
          </div>
        </div>
        <div className="space-y-2 mt-6">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Total Price Change (Taylor Series)</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-sm sm:text-lg font-mono text-zinc-200">ΔP/P ≈ -<span className="text-emerald-400">ModDur</span> × Δy + ½<span className="text-cyan-400">Convexity</span> × (Δy)²</p>
          </div>
        </div>
      </motion.div>
    )
  },
  "term-structure": {
    theory: {
      beginner: <p>The <strong>Yield Curve</strong> plots the interest rates of bonds with equal credit quality but different maturity dates. Normally, it curves upwards: a 10-year loan pays more interest than a 1-year loan because locking money up longer is riskier. An inverted curve often signals a recession.</p>,
      intermediate: <p>There is no single "yield curve." The <strong>Spot Curve</strong> (Zero-coupon curve) represents the yield on single cash flows. The <strong>Par Curve</strong> shows the yields required for a bond to be priced exactly at par. The <strong>Forward Curve</strong> shows expected future spot rates implied by today's curve.</p>,
      advanced: <p><strong>Bootstrapping</strong> extracts the pure theoretical spot curve from the yields of coupon-paying par bonds. By stripping out the yield of the 1-year coupon, you can solve algebraically for the pure 2-year spot rate, iterating to build a risk-free valuation framework for any cash flow.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Implied Forward Rate</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-sm sm:text-lg font-mono text-zinc-200">(1 + <span className="text-amber-400">S_A</span>)^A × (1 + <span className="text-cyan-400">f_(A,B-A)</span>)^(B-A) = (1 + <span className="text-emerald-400">S_B</span>)^B</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm font-mono">
          <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-amber-400 block mb-1">S_A</span> Spot rate for period A</div>
          <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-emerald-400 block mb-1">S_B</span> Spot rate for longer period B</div>
          <div className="col-span-2 p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-cyan-400 block mb-1">f_(A,B-A)</span> The implied forward rate starting at year A and lasting for (B-A) years.</div>
        </div>
      </motion.div>
    )
  },
  "credit-spreads": {
    theory: {
      beginner: <p>US Treasury bonds are considered "risk-free". Corporations cannot print money, so there is a chance they default. To convince you to lend to them, corporations must pay a higher interest rate than the government. This extra interest is called the <strong>Credit Spread</strong>.</p>,
      intermediate: <p>Credit risk has two components: <strong>Probability of Default (PD)</strong> and <strong>Loss Given Default (LGD)</strong>. The Expected Loss is PD × LGD. The <strong>G-Spread</strong> is the nominal yield spread over a government bond of the same maturity.</p>,
      advanced: <p>The G-Spread is flawed because it assumes a flat yield curve. Analysts use the <strong>Z-Spread (Zero-volatility spread)</strong>, which is the constant basis point spread added to the <em>entire Treasury spot curve</em> so that the discounted cash flows match the bond's current market price.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Expected Loss {"&"} Dirty Price</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center space-y-4">
            <p className="text-lg font-mono text-zinc-200">Expected Loss = <span className="text-amber-400">PD</span> × <span className="text-rose-400">LGD</span></p>
            <div className="w-full h-px bg-zinc-800"></div>
            <p className="text-lg font-mono text-zinc-200">Dirty Price = <span className="text-emerald-400">Clean Price</span> + <span className="text-cyan-400">Accrued Interest</span></p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm font-mono">
          <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-amber-400 block mb-1">Probability of Default (PD)</span> Likelihood of bankruptcy</div>
          <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50"><span className="text-rose-400 block mb-1">Loss Given Default</span> (1 - Recovery Rate)</div>
        </div>
      </motion.div>
    )
  },
  "embedded-options": {
    theory: {
      beginner: <p>Some bonds have "options" built into the contract. A <strong>Callable Bond</strong> allows the issuer to pay the bond off early (bad for the investor). A <strong>Puttable Bond</strong> allows the investor to demand early repayment (good for the investor).</p>,
      intermediate: <p>Callable bonds exhibit <strong>Negative Convexity</strong>. Normally, as interest rates drop, bond prices rise. But for a callable bond, as rates drop, the price gets "capped" at the call price because the issuer will simply refinance the debt, limiting the investor's upside.</p>,
      advanced: <p>Because cash flows are uncertain, standard yield and duration fail. We use <strong>Effective Duration</strong> to measure interest rate sensitivity. To price credit risk, we use the <strong>Option-Adjusted Spread (OAS)</strong>. The OAS removes the value of the embedded option from the Z-spread, isolating the pure credit premium.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Option Adjusted Spread (OAS)</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center space-y-4">
            <p className="text-lg font-mono text-zinc-200">Z-Spread = <span className="text-cyan-400">OAS</span> + <span className="text-rose-400">Option Value</span></p>
            <div className="w-full h-px bg-zinc-800"></div>
            <p className="text-lg font-mono text-zinc-200"><span className="text-cyan-400">OAS</span> = Z-Spread - <span className="text-rose-400">Option Value</span></p>
          </div>
        </div>
        <p className="text-xs text-zinc-500 text-center">For a callable bond, the Option Value is positive to the issuer, so OAS {"<"} Z-Spread.</p>
      </motion.div>
    )
  },
  "mbs": {
    theory: {
      beginner: <p>Banks bundle thousands of home mortgages together and sell slices of this pool to investors. These are <strong>Mortgage-Backed Securities (MBS)</strong>. Investors receive the monthly interest and principal payments from the homeowners.</p>,
      intermediate: <p>MBS have massive <strong>Prepayment Risk</strong>. If rates drop, homeowners refinance, paying off loans early. The MBS investor gets their money back exactly when yields are low (<strong>Contraction Risk</strong>). If rates rise, nobody refinances, and the investor is stuck with a low-yielding asset (<strong>Extension Risk</strong>).</p>,
      advanced: <p>To manage this, pools are sliced into Collateralized Mortgage Obligations (CMOs). A <strong>PAC Tranche</strong> (Planned Amortization Class) provides a highly predictable cash flow schedule by diverting all prepayment unpredictability into a Support/Companion Tranche, shielding the PAC investor from extension and contraction risk.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Prepayment Measurement</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4 font-mono text-sm">
            <div className="flex justify-between border-b border-zinc-800/50 pb-2"><span className="text-cyan-400 font-bold">SMM (Single Monthly)</span> <span className="text-zinc-400 text-right">% of balance prepaid in one month.</span></div>
            <div className="flex justify-between border-b border-zinc-800/50 pb-2"><span className="text-emerald-400 font-bold">CPR (Conditional)</span> <span className="text-zinc-400 text-right">The annualized version of the SMM.</span></div>
            <div className="flex justify-between"><span className="text-amber-400 font-bold">PSA (Benchmark)</span> <span className="text-zinc-400 text-right">100 PSA = normal prepayment speed.</span></div>
          </div>
        </div>
      </motion.div>
    )
  },
  "immunization": {
    theory: {
      beginner: <p><strong>Immunization</strong> is a strategy used by pension funds and insurance companies to guarantee they will have exactly enough money to pay off a future liability (like a retiree's pension), regardless of what happens to interest rates.</p>,
      intermediate: <p>The simplest method is <strong>Cash Flow Matching</strong>, where you buy a zero-coupon bond that matures on the exact day the liability is due. However, zero-coupon bonds aren't always available. Instead, managers use <strong>Duration Matching</strong>, ensuring the Macaulay Duration of the assets equals the liability's due date.</p>,
      advanced: (
        <div className="space-y-2">
          <p>For perfect classical immunization against a single liability, three conditions must be met:</p>
          <ol className="list-decimal list-inside space-y-1 pl-1">
            <li><strong>PV of Assets ≥ PV of Liabilities.</strong> The asset pool must fully fund the obligation.</li>
            <li><strong>Macaulay Duration of Assets = Macaulay Duration of Liabilities.</strong> This ensures price sensitivity matches.</li>
            <li><strong>Convexity of Assets {">"} Convexity of Liabilities.</strong> This guarantees the asset value drops <em>less</em> than the liability value when rates change violently — providing a positive surplus no matter which direction rates move.</li>
          </ol>
        </div>
      )
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Immunization Conditions</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center space-y-4">
            <p className="text-lg font-mono text-zinc-200">PV(<span className="text-cyan-400">Assets</span>) {"≥"} PV(<span className="text-rose-400">Liabilities</span>)</p>
            <div className="w-full h-px bg-zinc-800"></div>
            <p className="text-lg font-mono text-zinc-200">MacDur(<span className="text-cyan-400">Assets</span>) = MacDur(<span className="text-rose-400">Liabilities</span>)</p>
            <div className="w-full h-px bg-zinc-800"></div>
            <p className="text-lg font-mono text-zinc-200">Convexity(<span className="text-cyan-400">Assets</span>) {">"} Convexity(<span className="text-rose-400">Liabilities</span>)</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 text-sm font-mono">
          <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50">
            <span className="text-emerald-400 block mb-1">Why Convexity {">"} Matters</span>
            <span className="text-zinc-400">Ensures assets gain more / lose less than liabilities for any parallel yield curve shift, protecting the surplus.</span>
          </div>
        </div>
      </motion.div>
    )
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// BOND VALUATION INTERACTIVE LAB (Wrapping the BondSimulator)
// ═══════════════════════════════════════════════════════════════════════════

function BondValuationLab({ onBack }: { onBack: () => void }) {
  const content = TOPIC_CONTENT["bond-valuation"];

  if (!content) return null;

  return (
    <TopicDashboard
      title="Bond Valuation" tag="Intermediate" onBack={onBack} defaultTab="lab"
      theoryContent={<DepthExplanation {...content.theory} />}
      mathContent={content.math}
      labContent={<div className="relative -mt-4"><BondSimulator /></div>}
    />
  );
}

function GenericInfoLab({ id, onBack }: { id: TopicId, onBack: () => void }) {
  const topic = TOPICS.find(t => t.id === id);
  const content = TOPIC_CONTENT[id];

  if (!topic) return null;

  const theoryContent = content?.theory
    ? <DepthExplanation {...content.theory} />
    : <p className="text-zinc-400 p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">Theory content currently being drafted...</p>;

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
  const a = accentMap[topic.accent] ?? accentMap.cyan;

  return (
    <motion.div custom={index} variants={fadeUp} initial="hidden" animate="visible" className="relative z-10">
      <motion.button
        whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} onClick={onClick}
        className={`group w-full text-left relative rounded-2xl border overflow-hidden transition-all duration-300 ${a.border} bg-zinc-900/60 backdrop-blur-md hover:shadow-[0_0_32px_-8px_rgba(6,182,212,0.12)] cursor-pointer`}
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
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function FixedIncomeHub() {
  const [activeTopic, setActiveTopic] = useState<TopicId | null>(null);
  const [completed, setCompleted] = useState<Set<TopicId>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const markDone = (id: TopicId) => setCompleted((prev) => new Set(prev).add(id));
  const handleBack = (id: TopicId) => { markDone(id); setActiveTopic(null); };

  const filteredTopics = TOPICS.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()) || t.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (activeTopic) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 py-8 px-5 relative overflow-hidden" style={{ fontFamily: "var(--font-mono, 'JetBrains Mono'), 'Fira Mono', monospace" }}>
        <FloatingFormulaBackground formulas={FI_FORMULAS} balloonColors={FI_BALLOON_COLORS} density={12} />

        <AnimatePresence mode="wait">
          {activeTopic === "bond-valuation" ? (
            <BondValuationLab key="bv" onBack={() => handleBack("bond-valuation")} />
          ) : (
            <GenericInfoLab key={activeTopic} id={activeTopic} onBack={() => handleBack(activeTopic)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden" style={{ fontFamily: "var(--font-mono, 'JetBrains Mono'), 'Fira Mono', monospace" }}>
      <FloatingFormulaBackground formulas={FI_FORMULAS} balloonColors={FI_BALLOON_COLORS} density={12} />

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3"><div className="h-[1px] w-8 bg-cyan-500/40" /><span className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest">Fixed Income</span></div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">Explore the Debt Markets.</h1>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div animate={{ width: `${(completed.size / TOPICS.length) * 100}%` }} transition={{ type: "spring", stiffness: 200, damping: 25 }} className="h-full bg-cyan-500 rounded-full" />
            </div>
            <span className="text-[10px] font-mono text-zinc-600">{completed.size}/{TOPICS.length} explored</span>
          </div>
          <div className="relative max-w-md mt-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input type="text" placeholder="Search concepts (e.g., Yield, Duration)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 font-mono focus:outline-none focus:border-cyan-500/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-600" />
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
        <p className="text-center text-[10px] text-zinc-700 mt-12 font-mono relative z-10">Fintastic Lab · Fixed Income · fintasticlab.in</p>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";
import {
  ArrowLeft, ArrowRight, Activity, Target, Crosshair,
  AlertTriangle, HelpCircle, Lightbulb, BookMarked, X, ChevronLeft,
  BarChart3, Scale, GitMerge, CheckCircle2, Search
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// GLOSSARY CONTEXT & DICTIONARY ENGINE (STATISTICS)
// ═══════════════════════════════════════════════════════════════════════════

const GlossaryContext = createContext<(term: string) => void>(() => {});

export const GLOSSARY_TERMS: Record<string, { title: string; definition: string; formula?: string; analogy?: string }> = {
  "mean": {
    title: "Arithmetic Mean (μ or x̄)",
    definition: "The sum of all observation values divided by the total number of observations. It represents the mathematical center of a dataset but is highly sensitive to extreme outliers.",
    formula: "μ = (Σ X_i) / n",
    analogy: "The center of gravity on a seesaw. If a very heavy person sits on the far edge (an outlier), the center of gravity shifts drastically to balance the weight."
  },
  "median": {
    title: "Median",
    definition: "The exact midpoint of a dataset when arranged in ascending or descending order. Half the observations lie above, and half below.",
    analogy: "The middle child in a family. Even if the oldest child grows to be 7 feet tall (an outlier), the middle child remains exactly in the middle."
  },
  "mode": {
    title: "Mode",
    definition: "The value that occurs most frequently in a dataset. A dataset can be unimodal, bimodal, or have no mode at all.",
    analogy: "The most popular item on a restaurant menu. It’s simply what people order the most, regardless of the price."
  },
  "variance": {
    title: "Variance (σ² or s²)",
    definition: "The average of the squared deviations from the mean. It measures the total dispersion of data points around the central tendency.",
    formula: "s² = Σ (X_i - x̄)² / (n - 1)",
    analogy: "If the mean is a campfire, variance measures the total physical area that the sparks cover as they fly away from the fire."
  },
  "std_dev": {
    title: "Standard Deviation (σ or s)",
    definition: "The square root of the variance. It translates the squared units of variance back into the original units of the dataset.",
    formula: "s = √(s²)",
    analogy: "The average size of the waves in the ocean today. High standard deviation means choppy, dangerous waters. Low means it is perfectly smooth."
  },
  "covariance": {
    title: "Covariance (Cov)",
    definition: "A statistical measure of how two variables move together. A positive value means they move in the same direction; a negative value means they move inversely.",
    formula: "Cov(X,Y) = Σ [(X_i - x̄)(Y_i - ȳ)] / (n - 1)",
    analogy: "Like umbrella and raincoat sales (positive covariance) vs. sunscreen and umbrella sales (negative covariance)."
  },
  "correlation": {
    title: "Correlation Coefficient (ρ or r)",
    definition: "A standardized measure of the linear relationship between two variables, bounded exactly between -1.0 and +1.0.",
    formula: "r = Cov(X,Y) / (s_X × s_Y)",
    analogy: "Two horses pulling a carriage. +1.0 means they pull in the exact same direction. -1.0 means they pull in perfect opposite directions."
  },
  "null_hypothesis": {
    title: "Null Hypothesis (H₀)",
    definition: "The default or assumed status quo statement about a population parameter that a researcher wants to reject through statistical testing.",
    analogy: "In a courtroom, the Null Hypothesis is 'Innocent until proven guilty.' You assume innocence unless the evidence forces you to reject it."
  },
  "type_1_error": {
    title: "Type I Error (α)",
    definition: "The rejection of the null hypothesis when it is actually true. The probability of this error is the 'Significance Level' of the test.",
    analogy: "Convicting a completely innocent person and sending them to jail. You rejected the assumption of innocence, but you were wrong."
  },
  "type_2_error": {
    title: "Type II Error",
    definition: "The failure to reject the null hypothesis when it is actually false. 1 minus this probability equals the 'Power of the Test'.",
    analogy: "Letting a guilty murderer go free because there wasn't quite enough evidence. You failed to reject their innocence, even though they did it."
  },
  "t_test": {
    title: "Student's t-Test",
    definition: "A parametric test used for testing hypotheses concerning the value of a population mean, especially when the sample size is small or population variance is unknown.",
    analogy: "A precision hand-tool used when you have a small, delicate job (small sample size) and don't know the exact specifications of the material (unknown variance)."
  },
  "z_test": {
    title: "Z-Test",
    definition: "A statistical test used to determine whether two population means are different when the variances are known and the sample size is large (n ≥ 30).",
    analogy: "The heavy machinery of statistics. You use it when you have massive amounts of data (large sample) and know exactly what you're dealing with (known variance)."
  },
  "f_test": {
    title: "F-Test",
    definition: "A statistical test used to compare the equality of TWO population variances. The F-statistic is the ratio of the two sample variances.",
    analogy: "A balancing scale. You put the variance of Group A on one side, and Group B on the other. If they weigh exactly the same, the scale balances at 1.0."
  },
  "normal_dist": {
    title: "Normal Distribution",
    definition: "A continuous probability distribution that is perfectly symmetrical. The mean, median, and mode are all exactly the same, forming a classic 'bell curve' shape.",
    analogy: "Like the heights of adult men in a city. Most people are clustered around the average, with very few extremely short or extremely tall people at the distant tails."
  },
  "empirical_rule": {
    title: "Empirical Rule (68-95-99.7)",
    definition: "A statistical rule stating that for a normal distribution, almost all observed data will fall within three standard deviations of the mean: 68% within 1 SD, 95% within 2 SDs, and 99.7% within 3 SDs."
  },
  "z_score": {
    title: "Z-Score",
    definition: "The number of standard deviations a specific data point is from the mean.",
    formula: "Z = (X - μ) / σ",
    analogy: "A standardized ruler. Instead of measuring in inches or dollars, you measure in 'standard deviations', allowing you to compare entirely different datasets on the exact same scale."
  }
};

function Term({ id, children, colorClass = "text-indigo-400" }: { id: string, children: React.ReactNode, colorClass?: string }) {
  const openGlossary = useContext(GlossaryContext);
  return (
    <span onClick={(e) => { e.stopPropagation(); openGlossary(id); }} className={`cursor-pointer border-b border-dashed border-current hover:bg-zinc-800/50 rounded px-0.5 transition-colors ${colorClass}`} title="Click for definition">
      {children}
    </span>
  );
}

function ElegantBackground() {
  const [elements, setElements] = useState<any[]>([]);

  React.useEffect(() => {
    const symbols = ["μ", "σ²", "H₀", "Hₐ", "ρ", "α", "t", "Z", "F", "x̄"];
    setElements(
      Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        text: symbols[Math.floor(Math.random() * symbols.length)],
        x: Math.random() * 100,
        scale: Math.random() * 0.6 + 0.4,
        duration: Math.random() * 25 + 25,
        delay: Math.random() * -30,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] opacity-30 mix-blend-screen" />
      
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
          style={{ fontSize: `${el.scale * 3.5}rem`, filter: `blur(${el.scale > 0.8 ? 0 : 3}px)` }}
        >
          {el.text}
        </motion.div>
      ))}
    </div>
  );
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

function DepthExplanation({ beginner, intermediate, advanced, analogy }: { beginner: React.ReactNode; intermediate: React.ReactNode; advanced: React.ReactNode; analogy?: string | React.ReactNode; }) {
  const [depth, setDepth] = useState<DepthLevel>("beginner");
  return (
    <div className="space-y-6">
      {analogy && (
        <motion.div variants={fadeUp} className="bg-indigo-500/10 border border-indigo-500/25 rounded-2xl p-5 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-indigo-400 mb-1">Concept Analogy</h3>
            <div className="text-sm text-zinc-300 leading-relaxed">{analogy}</div>
          </div>
        </motion.div>
      )}
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-5 relative z-10 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <h2 className="text-lg font-bold font-mono text-zinc-100">Core Concept</h2>
          <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            {(["beginner", "intermediate", "advanced"] as DepthLevel[]).map((level) => (
              <button key={level} onClick={() => setDepth(level)} className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-md transition-colors ${depth === level ? "bg-indigo-500/10 text-indigo-400 font-bold" : "text-zinc-500 hover:text-zinc-300"}`}>{level}</button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={depth} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="text-sm text-zinc-400 leading-relaxed min-h-[80px] space-y-3">
            {depth === "beginner" && beginner}
            {depth === "intermediate" && intermediate}
            {depth === "advanced" && advanced}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function SliderInput({ label, hint, min, max, step, value, onChange, accent = "indigo", suffix = "%" }: any) {
  const vCol = accent === "cyan" ? "text-cyan-400" : accent === "emerald" ? "text-emerald-400" : accent === "rose" ? "text-rose-400" : "text-indigo-400";
  const acc = accent === "cyan" ? "accent-cyan-500" : accent === "emerald" ? "accent-emerald-500" : accent === "rose" ? "accent-rose-500" : "accent-indigo-500";
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

function QuestionsTab({ questions }: { questions: { q: string; a: string }[] }) {
  return (
    <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <HelpCircle className="w-6 h-6 text-indigo-400" />
        <h2 className="text-lg font-bold font-mono text-zinc-100">Exam Prep {"&"} Practice</h2>
      </div>
      <div className="space-y-4">
        {questions.map((item, idx) => (
          <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
            <p className="text-sm font-bold text-zinc-200 mb-3">Q: {item.q}</p>
            <div className="pl-4 border-l-2 border-indigo-500/50">
              <p className="text-sm text-zinc-400 leading-relaxed"><strong>Ans:</strong> {item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TOPIC DEFINITIONS & CONTENT
// ═══════════════════════════════════════════════════════════════════════════

type TopicId = "central-tendency" | "dispersion" | "correlation" | "hypothesis-testing" | "test-statistics" | "normal-distribution";

interface Topic { id: TopicId; title: string; subtitle: string; icon: React.ReactNode; accent: string; description: string; difficulty: string; }

const TOPICS: Topic[] = [
  { id: "central-tendency", title: "Mean, Median & Mode", subtitle: "Measuring the Center", icon: <BarChart3 className="w-5 h-5" />, accent: "indigo", description: "Discover how to identify the 'typical' value in a dataset and why extreme outliers can distort reality.", difficulty: "Beginner" },
  { id: "dispersion", title: "Variance & Dispersion", subtitle: "Measuring Risk & Spread", icon: <Activity className="w-5 h-5" />, accent: "emerald", description: "Explore Variance, Standard Deviation, and Covariance. Learn how to quantify the spread of data.", difficulty: "Intermediate" },
  { id: "correlation", title: "Correlation", subtitle: "Measuring Relationships", icon: <GitMerge className="w-5 h-5" />, accent: "cyan", description: "Understand how to standardize covariance to measure the exact strength of the linear relationship between two variables.", difficulty: "Intermediate" },
  { id: "normal-distribution", title: "Normal Distribution", subtitle: "The Bell Curve", icon: <Activity className="w-5 h-5" />, accent: "emerald", description: "Understand the Empirical Rule (68-95-99.7), Z-scores, and the shape of probability.", difficulty: "Intermediate" },
  { id: "hypothesis-testing", title: "Hypothesis Testing", subtitle: "The Statistical Courtroom", icon: <Scale className="w-5 h-5" />, accent: "amber", description: "Learn how to formulate Null and Alternative hypotheses, and understand the dangers of Type I and Type II errors.", difficulty: "Advanced" },
  { id: "test-statistics", title: "T, Z, and F Tests", subtitle: "Statistical Machinery", icon: <Target className="w-5 h-5" />, accent: "rose", description: "Know exactly which test statistic to deploy depending on your sample size, variance, and objective.", difficulty: "Advanced" }
];

const TOPIC_CONTENT: Partial<Record<TopicId, any>> = {
  "central-tendency": {
    theory: {
      analogy: "If nine regular people and Bill Gates walk into a bar, the Arithmetic Mean wealth of the bar skyrockets to billions of dollars (pulled by the outlier). But the Median wealth remains a normal, middle-class salary. The Median ignores the billionaire; the Mean is deeply distorted by him.",
      beginner: <p>Measures of central tendency identify the center, or 'average', of a dataset. The <Term id="mean">Mean</Term> is the mathematical average. The <Term id="median">Median</Term> is the exact middle number. The <Term id="mode">Mode</Term> is the number that shows up the most often.</p>,
      intermediate: <p>While the <Term id="mean">Arithmetic Mean</Term> is the most commonly used measure, it is heavily skewed by extreme outliers. In a positively skewed distribution (long right tail), the Mean is greater than the Median, which is greater than the Mode. To counter outliers, analysts often use a Trimmed Mean (deleting the top/bottom 1%) or a Winsorized Mean (replacing extreme values).</p>,
      advanced: <p>In finance, we must also distinguish between the Arithmetic Mean and the Geometric Mean. The Arithmetic Mean is an unbiased estimator of the true population mean, but the Geometric Mean is required to calculate true compound growth rates over multiple time periods. The Geometric Mean is always less than or equal to the Arithmetic Mean.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Population Mean</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-lg font-mono text-zinc-200"><Term id="mean" colorClass="text-indigo-400">μ</Term> = (Σ X_i) / n</p>
          </div>
        </div>
      </motion.div>
    ),
    questions: [
      { q: "In a positively skewed distribution, which is larger: the mean or the median?", a: "The mean is larger. Positively skewed means there is a long tail on the right side (positive side). These large outliers pull the mean upwards, while the median stays anchored in the middle." }
    ]
  },
  "dispersion": {
    theory: {
      analogy: "If the Mean is the target you are throwing darts at, Dispersion measures how wildly your darts are scattered across the wall. Variance tells you the total area of your misses. Standard Deviation translates that area back into inches, telling you exactly how far, on average, your darts landed from the bullseye.",
      beginner: <p>Dispersion tells us about risk. If two stocks both return 10% on average, but Stock A swings between +50% and -30%, while Stock B stays between +12% and +8%, Stock A has much higher dispersion (<Term id="std_dev">Standard Deviation</Term>).</p>,
      intermediate: <p>The <Term id="variance">Variance</Term> is the average of the squared differences from the mean. We square the differences so negative and positive errors don't cancel each other out. We also use <Term id="covariance">Covariance</Term> to measure how two different variables move together (e.g., Apple stock and Google stock).</p>,
      advanced: <p>For sample variance, we divide by (n - 1) instead of n. This is known as Bessel's correction, and it provides an unbiased estimator of the population variance. Without it, the sample variance would systematically underestimate the true population variance.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Sample Variance</h3>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-sm font-mono text-zinc-200"><Term id="variance" colorClass="text-emerald-400">s²</Term> = Σ(X_i - x̄)² / (n-1)</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Sample Covariance</h3>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-sm font-mono text-zinc-200"><Term id="covariance" colorClass="text-emerald-400">Cov(X,Y)</Term> = Σ[(X_i - x̄)(Y_i - ȳ)] / (n-1)</p>
            </div>
          </div>
        </div>
      </motion.div>
    ),
    questions: [
      { q: "Why do we divide by (n-1) instead of n when calculating Sample Variance?", a: "To correct for bias (Bessel's correction). A sample tends to have less dispersion than the full population. Dividing by a smaller number (n-1) slightly inflates the variance, giving a more accurate estimate of the true population variance." }
    ]
  },
  "correlation": {
    theory: {
      analogy: "Covariance just tells you if two cars are driving in the same general direction. Correlation acts like a GPS tracker—it tells you the exact mathematical strength of their convoy. +1.0 means they are perfectly tethered together. 0 means one is going to the store and the other is driving in random circles.",
      beginner: <p>Because <Term id="covariance">Covariance</Term> numbers can be huge (like millions of dollars squared), they are very hard to read. We fix this by converting it into a <Term id="correlation">Correlation Coefficient</Term>. Correlation is always a clean, simple number between -1.0 and +1.0.</p>,
      intermediate: <p>If the <Term id="correlation">Correlation (ρ)</Term> is exactly 1.0, the variables have perfect positive linear relationship. If it is 0, there is no linear relationship at all. In finance, holding assets with a correlation of less than 1.0 provides diversification benefits and lowers total portfolio risk.</p>,
      advanced: <p>Be careful: Correlation ONLY measures linear relationships. Two variables can have a correlation of 0 but still have a perfect, predictable non-linear relationship (like a U-shape). Furthermore, correlation never implies causation. Spurious correlation is often driven by a hidden third variable.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Correlation Formula</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-lg font-mono text-zinc-200"><Term id="correlation" colorClass="text-cyan-400">r</Term> = <Term id="covariance" colorClass="text-cyan-400">Cov(X,Y)</Term> / (<Term id="std_dev">s_X</Term> × <Term id="std_dev">s_Y</Term>)</p>
          </div>
        </div>
      </motion.div>
    ),
    questions: [
      { q: "If two variables have a correlation of 0, does that mean they have no relationship at all?", a: "No. It only means they have no LINEAR relationship. They could have a very strong non-linear relationship (like a quadratic curve) that standard correlation fails to capture." }
    ]
  },
  "normal-distribution": {
    theory: {
      analogy: "The Normal Distribution is nature's default sorting mechanism. Whether you are measuring the test scores of a massive class, the weights of apples in an orchard, or the daily returns of the stock market, they all tend to form this exact same bell shape.",
      beginner: <p>A <Term id="normal_dist" colorClass="text-zinc-100">Normal Distribution</Term> is a symmetrical bell curve where the <Term id="mean" colorClass="text-zinc-100">Mean</Term>, <Term id="median" colorClass="text-zinc-100">Median</Term>, and <Term id="mode" colorClass="text-zinc-100">Mode</Term> are all exactly the same number, sitting right in the center.</p>,
      intermediate: <p>The most important feature of a normal distribution is the <Term id="empirical_rule" colorClass="text-zinc-100">Empirical Rule</Term>. It states that approximately 68% of all data falls within ±1 <Term id="std_dev" colorClass="text-zinc-100">Standard Deviation</Term> of the mean, 95% falls within ±2, and 99.7% falls within ±3.</p>,
      advanced: <p>To compare different normal distributions, we standardize them using <Term id="z_score" colorClass="text-zinc-100">Z-Scores</Term>. A Standard Normal Distribution has a mean of 0 and a standard deviation of 1. By converting any value X to a Z-score, we can use standard probability tables to find the exact area under the curve.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Z-Score Standardization</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-lg font-mono text-zinc-200">
              <Term id="z_score" colorClass="text-emerald-400">Z</Term> = (X - <Term id="mean" colorClass="text-indigo-400">μ</Term>) / <Term id="std_dev" colorClass="text-cyan-400">σ</Term>
            </p>
          </div>
        </div>
      </motion.div>
    ),
    questions: [
      { q: "If a dataset has a mean of 22 and a standard deviation of 2.4, what is the probability of a value falling between 19.6 and 24.4?", a: "68%. The bounds 19.6 and 24.4 represent exactly ±1 standard deviation from the mean (22 - 2.4 = 19.6, and 22 + 2.4 = 24.4). According to the Empirical Rule, 68% of data falls within 1 standard deviation." }
    ]
  },
  "hypothesis-testing": {
    theory: {
      analogy: "Think of hypothesis testing as a criminal trial. The Null Hypothesis is 'Innocent until proven guilty.' A Type I Error (False Positive) is convicting an innocent person—this is considered the worst mistake. A Type II Error (False Negative) is letting a guilty person walk free.",
      beginner: <p>A hypothesis is just a mathematical belief. We set up a <Term id="null_hypothesis">Null Hypothesis</Term> that we actively try to disprove (the status quo), and an Alternative Hypothesis that represents what we actually suspect is true.</p>,
      intermediate: <p>When testing, we can make two mistakes. A <Term id="type_1_error">Type I Error (α)</Term> is rejecting the null when it is actually true. The Significance Level of a test (like 5%) is explicitly the probability of making a Type I error. A <Term id="type_2_error">Type II Error</Term> is failing to reject a false null.</p>,
      advanced: <p>There is a fundamental tradeoff: for a given sample size, if you decrease the chance of a <Term id="type_1_error">Type I error</Term> (e.g., moving from 5% to 1% significance), you automatically INCREASE the chance of a <Term id="type_2_error">Type II error</Term>, thereby reducing the 'Power of the Test'. The only way to decrease both error probabilities simultaneously is to increase the sample size.</p>
    },
    questions: [
      { q: "What is the relationship between the Significance Level and a Type I Error?", a: "They are the exact same thing. The significance level (alpha) is defined as the maximum acceptable probability of making a Type I Error (rejecting a true null hypothesis)." }
    ]
  },
  "test-statistics": {
    theory: {
      analogy: "Choosing a test statistic is like picking a tool from a toolbox. The Z-test is the heavy machinery used when you have massive amounts of data (large sample). The T-test is the precise hand-tool used when you have a small sample and don't know the exact population variance. The F-test is a scale used purely to compare the weight (variance) of two different objects.",
      beginner: <p>Once we state our hypothesis, we calculate a Test Statistic and compare it to a 'Critical Value' on a chart. If our test statistic is larger than the critical value, we reject the null hypothesis.</p>,
      intermediate: <p>Use the <Term id="t_test">T-Test</Term> if you are testing the value of a population mean, especially if the sample size is small and the variance is unknown. Use the <Term id="z_test">Z-Test</Term> if the sample is large (n ≥ 30) or the population variance is perfectly known.</p>,
      advanced: <p>If you need to test hypotheses concerning the equality of two population variances (not means), you MUST use the <Term id="f_test">F-Test</Term>. The F-statistic is simply the ratio of the two sample variances. If the variances are perfectly equal, the F-statistic will be exactly 1.0.</p>
    },
    math: (
      <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">General Test Statistic Formula</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-sm font-mono text-zinc-200">Test Statistic = (Sample Statistic - Hypothesized Value) / Standard Error</p>
          </div>
        </div>
      </motion.div>
    ),
    questions: [
      { q: "When must you use an F-Test instead of a t-test or z-test?", a: "You use an F-Test when you are comparing the equality of two VARIANCES, not means." }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE LABS
// ═══════════════════════════════════════════════════════════════════════════

function CentralTendencyLab() {
  const [outlier, setOutlier] = useState(50);
  
  const baseData = [10, 12, 14, 15, 18, 20, 22];
  const fullData = [...baseData, outlier].sort((a, b) => a - b);
  
  const mean = fullData.reduce((a, b) => a + b, 0) / fullData.length;
  const median = (fullData[3] + fullData[4]) / 2; // Exact midpoint for n=8
  
  const chartData = fullData.map((val, idx) => ({ name: `P${idx+1}`, value: val, isOutlier: val === outlier }));

  return (
    <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
      <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-bold font-mono text-zinc-100">The Outlier Effect</h2>
          <p className="text-xs text-zinc-500 font-mono mt-1">Mean vs Median Robustness</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-4">
            <SliderInput label="Adjust the Outlier Value" min={0} max={200} step={5} value={outlier} onChange={setOutlier} accent="indigo" suffix="" />
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Arithmetic Mean</p>
              <p className="text-xl font-mono text-indigo-400">{mean.toFixed(1)}</p>
            </div>
            <div className="h-px w-full bg-zinc-800"></div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Median</p>
              <p className="text-xl font-mono text-emerald-400">{median.toFixed(1)}</p>
            </div>
          </div>
          
          <p className="text-xs text-zinc-500 leading-relaxed">
            Notice how dragging the outlier to extreme highs pulls the <span className="text-indigo-400 font-bold">Mean</span> completely away from the cluster. The <span className="text-emerald-400 font-bold">Median</span> barely moves, remaining highly robust.
          </p>
        </div>

        <div className="lg:col-span-2 h-64 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 200]} tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "#27272a", opacity: 0.4 }} contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a" }} />
              <ReferenceLine y={mean} stroke="#818cf8" strokeDasharray="3 3" label={{ position: 'top', value: 'Mean', fill: '#818cf8', fontSize: 10 }} />
              <ReferenceLine y={median} stroke="#34d399" strokeDasharray="3 3" label={{ position: 'bottom', value: 'Median', fill: '#34d399', fontSize: 10 }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isOutlier ? "#818cf8" : "#52525b"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

function NormalDistributionLab() {
  const [mean, setMean] = useState(22);
  const [stdDev, setStdDev] = useState(2.4);
  const [range, setRange] = useState(1);

  const chartData = useMemo(() => {
    const points = [];
    for (let i = mean - 4 * stdDev; i <= mean + 4 * stdDev; i += (8 * stdDev) / 100) {
      const exponent = Math.exp(-Math.pow(i - mean, 2) / (2 * Math.pow(stdDev, 2)));
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * exponent;
      const isShaded = i >= mean - range * stdDev && i <= mean + range * stdDev;
      points.push({ name: Number(i.toFixed(1)), yShaded: isShaded ? y : 0, yBase: y });
    }
    return points;
  }, [mean, stdDev, range]);

  const lowerBound = (mean - range * stdDev).toFixed(1);
  const upperBound = (mean + range * stdDev).toFixed(1);
  const percentage = range === 1 ? "68%" : range === 2 ? "95%" : "99.7%";

  return (
    <motion.div variants={fadeUp} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
      <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-bold font-mono text-zinc-100">The Empirical Rule</h2>
          <p className="text-xs text-zinc-500 font-mono mt-1">Visualizing the 68-95-99.7 Theorem</p>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-4">
            <SliderInput label="Mean (μ)" min={0} max={100} step={1} value={mean} onChange={setMean} accent="emerald" suffix="" />
            <SliderInput label="Std Deviation (σ)" min={0.5} max={10} step={0.1} value={stdDev} onChange={setStdDev} accent="cyan" suffix="" />
            <div className="pt-4 border-t border-zinc-800">
              <SliderInput label="Target Range" min={1} max={3} step={1} value={range} onChange={setRange} accent="indigo" suffix=" SD" hint="1=68%, 2=95%, 3=99.7%" />
            </div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center space-y-2">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Probability Area</p>
            <p className="text-3xl font-bold font-mono text-emerald-400">{percentage}</p>
            <p className="text-xs text-zinc-400">Between {lowerBound} and {upperBound}</p>
          </div>
        </div>
        <div className="lg:col-span-2 h-64 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={false} contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a" }} labelStyle={{ color: "#a1a1aa" }} />
              <Area type="monotone" dataKey="yBase" stroke="#52525b" fill="none" strokeWidth={2} />
              <Area type="monotone" dataKey="yShaded" stroke="none" fill="#34d399" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

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
              <button onClick={() => onSelect("ALL")} className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors"><ChevronLeft className="w-4 h-4 text-zinc-400" /></button>
            )}
            <h2 className="text-lg font-bold font-mono text-white">{isAll ? "Stats Dictionary" : "Concept Definition"}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {isAll ? (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input type="text" placeholder="Search terms (e.g., Variance)..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-sm font-mono text-zinc-200 focus:outline-none focus:border-indigo-500/50" />
              </div>
              <div className="space-y-3">
                {filteredList.map(([key, data]) => (
                  <div key={key} onClick={() => onSelect(key)} className="group p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl cursor-pointer hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all">
                    <h4 className="text-sm font-bold font-mono text-indigo-400 mb-1">{data.title}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-2">{data.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : termData ? (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold font-mono text-indigo-400 mb-4">{termData.title}</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">{termData.definition}</p>
              </div>
              {termData.formula && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Mathematical Formula</h4>
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl"><code className="text-emerald-400 text-sm">{termData.formula}</code></div>
                </div>
              )}
              {termData.analogy && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Real-World Analogy</h4>
                  <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-xl"><p className="text-sm text-zinc-400 leading-relaxed italic">"{termData.analogy}"</p></div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

function TopicDashboard({ title, tag, onBack, theoryContent, labContent, mathContent, questions, defaultTab = "theory" }: any) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const tabs = [
    { id: "theory", label: "Core Concept", available: !!theoryContent },
    { id: "lab", label: "Interactive Lab", available: !!labContent },
    { id: "math", label: "Math & Formulae", available: !!mathContent },
    { id: "questions", label: "Exam Prep", available: !!questions && questions.length > 0 }
  ].filter(t => t.available);

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative z-10 pb-20">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col mb-8 gap-6">
        <div className="flex items-center gap-4">
          <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.96 }} onClick={onBack} className="px-3 py-1.5 text-xs font-mono text-zinc-500 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:text-zinc-300 transition-colors flex items-center gap-1.5 bg-zinc-950">
            <ArrowLeft className="w-3 h-3" /> Hub
          </motion.button>
          <div>
            <p className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest">{tag}</p>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100 mt-1">{title}</h1>
          </div>
        </div>

        {tabs.length > 1 && (
          <div className="flex gap-8 border-b border-zinc-800/60 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative pb-3 text-sm font-mono tracking-wide transition-colors whitespace-nowrap ${activeTab === tab.id ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"}`}>
                {tab.label}
                {activeTab === tab.id && (<motion.div layoutId="activeTabStats" className="absolute bottom-0 left-0 right-0 h-[2px] bg-current rounded-t-full shadow-[0_-2px_12px_rgba(99,102,241,0.8)]" transition={{ type: "spring", stiffness: 400, damping: 35 }} />)}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "theory" && (<motion.div key="theory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>{theoryContent}</motion.div>)}
          {activeTab === "lab" && (<motion.div key="lab" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>{labContent}</motion.div>)}
          {activeTab === "math" && (<motion.div key="math" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>{mathContent}</motion.div>)}
          {activeTab === "questions" && questions && (<motion.div key="questions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}><QuestionsTab questions={questions} /></motion.div>)}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function StatisticsHub() {
  // 1. Add the isMounted state
  const [isMounted, setIsMounted] = useState(false);
  const [activeTopic, setActiveTopic] = useState<TopicId | null>(null);
  const [completed, setCompleted] = useState<Set<TopicId>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<string | null>(null);

  // 2. Tell React to wait until the browser is ready
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBack = (id: TopicId) => { setCompleted((prev) => new Set(prev).add(id)); setActiveTopic(null); };

  const filteredTopics = TOPICS.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()));

  // 3. THE MAGIC FIX: Render a blank screen for 1 millisecond on the server to prevent all HTML mismatch errors.
  if (!isMounted) {
    return <div className="min-h-screen bg-zinc-950" />;
  }

  return (
    <GlossaryContext.Provider value={setActiveGlossaryTerm}>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden" style={{ fontFamily: "var(--font-mono, 'JetBrains Mono'), 'Fira Mono', monospace" }}>
        
        {activeTopic ? (
          <div className="py-8 px-5 relative z-10">
            <ElegantBackground />
            <AnimatePresence mode="wait">
              {activeTopic === "central-tendency" && <TopicDashboard key="ct" title={TOPICS.find(t=>t.id===activeTopic)?.title} tag="Concept" onBack={() => handleBack("central-tendency")} defaultTab="lab" theoryContent={<DepthExplanation {...TOPIC_CONTENT["central-tendency"].theory} />} mathContent={TOPIC_CONTENT["central-tendency"].math} labContent={<CentralTendencyLab />} questions={TOPIC_CONTENT["central-tendency"].questions} />}
              {activeTopic === "normal-distribution" && <TopicDashboard key="nd" title={TOPICS.find(t=>t.id===activeTopic)?.title} tag="Concept" onBack={() => handleBack("normal-distribution")} defaultTab="lab" theoryContent={<DepthExplanation {...TOPIC_CONTENT["normal-distribution"].theory} />} mathContent={TOPIC_CONTENT["normal-distribution"].math} labContent={<NormalDistributionLab />} questions={TOPIC_CONTENT["normal-distribution"].questions} />}
              {!["central-tendency", "normal-distribution"].includes(activeTopic) && <TopicDashboard key={activeTopic} title={TOPICS.find(t=>t.id===activeTopic)?.title} tag="Concept" onBack={() => handleBack(activeTopic)} theoryContent={<DepthExplanation {...TOPIC_CONTENT[activeTopic].theory} />} mathContent={TOPIC_CONTENT[activeTopic].math} questions={TOPIC_CONTENT[activeTopic].questions} />}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <ElegantBackground />
            <div className="relative z-10 max-w-5xl mx-auto px-5 py-12">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
                <div className="flex items-center gap-3 mb-3"><div className="h-[1px] w-8 bg-indigo-500/40" /><span className="text-[10px] font-mono text-indigo-400/70 uppercase tracking-widest">Quantitative Methods</span></div>
                <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">Statistics & Probability.</h1>
                <div className="relative max-w-md mt-6">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input type="text" placeholder="Search concepts (e.g., Variance, T-Test)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 font-mono focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-600" />
                </div>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-5 relative z-10">
                <AnimatePresence>
                  {filteredTopics.map((topic, i) => (
                    <motion.div key={topic.id} custom={i} variants={fadeUp} initial="hidden" animate="visible" whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setActiveTopic(topic.id)} className={`group w-full text-left relative rounded-2xl border border-${topic.accent}-500/25 bg-${topic.accent}-500/5 overflow-hidden transition-all duration-300 bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 backdrop-blur-md hover:shadow-[0_0_32px_-8px_rgba(99,102,241,0.12)] cursor-pointer`}>
                      <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-${topic.accent}-500/40 to-transparent`} />
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-inner shadow-white/5 border border-${topic.accent}-500/25 text-${topic.accent}-400`}>{topic.icon}</div>
                          {completed.has(topic.id) && <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/8 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Done</span>}
                        </div>
                        <h3 className="text-lg font-bold font-mono text-zinc-100 mb-2">{topic.title}</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed mb-4">{topic.description}</p>
                        <div className={`inline-flex items-center gap-2 text-sm font-mono font-semibold text-${topic.accent}-400 group-hover:gap-3 transition-all`}><span>Explore</span><ArrowRight className="w-4 h-4" /></div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}

        <motion.button initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveGlossaryTerm("ALL")} className="fixed bottom-6 right-6 z-40 bg-indigo-500 text-zinc-950 p-4 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center" title="Statistics Dictionary">
          <BookMarked className="w-6 h-6" />
        </motion.button>

        <AnimatePresence>
          {activeGlossaryTerm && <GlossaryDrawer activeTerm={activeGlossaryTerm} onClose={() => setActiveGlossaryTerm(null)} onSelect={setActiveGlossaryTerm} />}
        </AnimatePresence>
      </div>
    </GlossaryContext.Provider>
  );
}
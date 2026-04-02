// ═══════════════════════════════════════════════════════════════════════════
// GLOSSARY_TERMS — Fintastic Lab | Portfolio Management Module
// Source: CFA® Level II SchweserNotes™ 2025, Book 5 — Portfolio Management
// ═══════════════════════════════════════════════════════════════════════════
// HOW TO USE:
// 1. Paste this object into PortfolioHub.tsx (above TOPIC_CONTENT).
// 2. Wire up a GlossaryDrawer component that renders these entries.
// 3. Each "term_id" is a slug you'll use as the lookup key.
// ═══════════════════════════════════════════════════════════════════════════

export const GLOSSARY_TERMS: Record<
  string,
  { title: string; definition: string; formula?: string; analogy: string }
> = {

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 1 — CORE PORTFOLIO BUILDING BLOCKS
  // ─────────────────────────────────────────────────────────────────────────

  "expected_return": {
    title: "Expected Return — E(R)",
    definition:
      "The probability-weighted average of all possible returns an investment could produce. It is the single number that summarises what an investor anticipates earning, on average, from holding an asset or portfolio over a given period.",
    formula: "E(R_P) = Σ [wᵢ × E(Rᵢ)]",
    analogy:
      "Think of it as the average number of runs you'd expect a cricket batsman to score per match — based on his entire past performance. You don't know the exact score tomorrow, but the historical average tells you what to 'expect'.",
  },

  "standard_deviation": {
    title: "Standard Deviation (σ) — Volatility",
    definition:
      "The square root of the variance of returns. It measures the average dispersion of a portfolio's actual returns around its expected return. A higher σ means returns are more unpredictable — more risk. It is the most widely used measure of total risk.",
    formula: "σ_P = √(Variance of portfolio returns)",
    analogy:
      "Imagine two delivery apps. Both promise 30-minute delivery on average. App A always arrives in exactly 28–32 minutes. App B arrives anywhere from 5 to 90 minutes. They have the same 'expected' delivery time but wildly different standard deviations. Investors hate the App B kind of surprise.",
  },

  "covariance": {
    title: "Covariance (Cov / σᵢⱼ)",
    definition:
      "A statistical measure of how two assets' returns move in relation to each other. A positive covariance means both assets tend to move in the same direction. A negative covariance means they tend to move in opposite directions. It is the raw building block of all portfolio risk calculations.",
    formula: "Cov(Rᵢ, Rⱼ) = E[(Rᵢ − E(Rᵢ)) × (Rⱼ − E(Rⱼ))]",
    analogy:
      "Covariance is like the relationship between umbrella sales and raincoat sales. They both spike on rainy days — high positive covariance. Sunscreen and umbrella sales, on the other hand, move in opposite directions — negative covariance. Combining assets with negative covariance is the engine of diversification.",
  },

  "correlation": {
    title: "Correlation Coefficient (ρ)",
    definition:
      "A standardised measure of how two assets' returns move together. It is covariance scaled by the individual standard deviations to always fall between −1 and +1. ρ = +1 means assets move perfectly together; ρ = −1 means perfectly opposite; ρ = 0 means no relationship. A value of less than +1 always produces a diversification benefit.",
    formula: "ρᵢⱼ = Cov(Rᵢ, Rⱼ) / (σᵢ × σⱼ)",
    analogy:
      "Correlation is the friendship score between two stocks. +1 = they are identical twins who always agree. −1 = they are bitter rivals who always do the opposite. 0 = they're strangers who have never met. The lower the score, the more powerful the diversification when you combine them in a portfolio.",
  },

  "portfolio_variance": {
    title: "Portfolio Variance (σ²_P)",
    definition:
      "The total risk of a portfolio, measured as the weighted sum of each asset's variance PLUS the weighted covariances between every pair of assets. This is the core insight of Markowitz: portfolio risk is NOT a simple weighted average of individual risks; it is reduced by the covariances between assets.",
    formula:
      "σ²_P = Σᵢ Σⱼ (wᵢ × wⱼ × Cov(Rᵢ, Rⱼ)) = w₁²σ₁² + w₂²σ₂² + 2w₁w₂σ₁σ₂ρ₁₂ (2 assets)",
    analogy:
      "Imagine carrying two fragile glasses. If both shatter easily (high individual risk) but you wrap them so one absorbs shocks the other can't (negative covariance), the total probability of you dropping *both* is much lower than the sum of the individual probabilities. Portfolio variance captures this 'shock-absorbing' effect mathematically.",
  },

  "risk_free_rate": {
    title: "Risk-Free Rate (R_f)",
    definition:
      "The theoretical rate of return an investor can earn on an investment with zero risk of financial loss. In practice, it is proxied by the yield on short-term government Treasury bills. All other return premiums are calculated *above* this baseline. It is the starting point for the Capital Allocation Line and the CAPM.",
    formula: "R_f = Real Rate (R) + Expected Inflation (π)",
    analogy:
      "The risk-free rate is the 'floor rent' of the financial world. If you own a building (money), even if you do nothing, you expect to at least keep pace with inflation. The risk-free rate is the minimum return you demand before considering any investment at all.",
  },

  "risk_premium": {
    title: "Risk Premium (RP / λ)",
    definition:
      "The additional expected return that an investor demands above the risk-free rate to compensate for bearing risk. Different asset classes command different risk premiums based on how risky they are and how well they hedge bad economic outcomes. In APT models, λ (lambda) represents the risk premium for a specific systematic factor.",
    formula: "Risk Premium = E(R_Asset) − R_f",
    analogy:
      "Think of risk premium as a 'danger bonus'. A security guard earns more than a librarian not because the work is more skilled, but because it carries the risk of physical harm. Similarly, equity investors demand a higher return than bond investors as their 'danger bonus' for accepting more uncertainty.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 2 — ACTIVE MANAGEMENT & THE FUNDAMENTAL LAW
  // ─────────────────────────────────────────────────────────────────────────

  "active_return": {
    title: "Active Return (R_A) — Alpha Return",
    definition:
      "The difference between the return of an actively managed portfolio and the return of its benchmark index over the same period. Active return is the entire reason for paying a fund manager's fees. It can be measured ex-ante (based on forecasts) or ex-post (based on realised results). It is decomposed into Asset Allocation Return and Security Selection Return.",
    formula: "R_A = R_P − R_B = Σ (Δwᵢ × Rᵢ)",
    analogy:
      "If your train (the benchmark index) goes from Mumbai to Delhi and arrives at 6 PM, but your private car (the active manager) gets you there at 4 PM, the two hours you saved is the 'active return'. You pay extra for the car only if it consistently gets you there faster than the train.",
  },

  "active_weight": {
    title: "Active Weight (Δwᵢ)",
    definition:
      "The difference between a security's weight in the actively managed portfolio and its weight in the benchmark portfolio. Positive active weight = overweighted relative to benchmark; negative = underweighted. Crucially, all active weights in a portfolio must sum to exactly zero — for every overweight, there must be a corresponding underweight.",
    formula: "Δwᵢ = w_Portfolio_i − w_Benchmark_i | Σ Δwᵢ = 0",
    analogy:
      "The benchmark index is like a class average. Your active weights are like the extra marks you add or subtract from each student. If you give 5 marks more to student A, you must take 5 marks away from someone else — the total class score stays the same. Active weights are always a zero-sum game against the benchmark.",
  },

  "active_risk": {
    title: "Active Risk / Tracking Error (σ_A)",
    definition:
      "The standard deviation of the differences between the portfolio's returns and the benchmark's returns over time. A high tracking error means the portfolio is taking large, volatile bets away from the index. A low tracking error means it closely shadows the index (a 'closet index fund'). It is the denominator of the Information Ratio.",
    formula: "σ_A = StdDev(R_P − R_B) [annualized]",
    analogy:
      "Tracking error is like how far your shadow strays from your body when you walk. A sunny, clear day (passive fund) = your shadow perfectly mirrors every step. A windy, cloudy day (aggressive active fund) = your shadow goes all over the place. Investors pay managers for smart straying, not random straying.",
  },

  "information_coefficient": {
    title: "Information Coefficient (IC)",
    definition:
      "A measure of a manager's skill. It is the ex-ante risk-weighted correlation between the manager's forecasted active returns and the actual realised active returns. IC ranges from −1 to +1. An IC of 0 means the manager's forecasts are no better than random guessing. The ex-post IC is denoted ICR. Formula: IC = 2 × (Hit Rate) − 1.",
    formula: "IC = 2 × P(Correct) − 1 [e.g., 60% accuracy → IC = 0.20]",
    analogy:
      "IC is like a weather forecaster's accuracy score. If they predict rain correctly 60% of the time, their IC = 0.20. A perfect forecaster has IC = 1. A monkey throwing darts has IC = 0. A 'reverse' genius who is always wrong has IC = −1. The IC is the purest measure of forecasting skill in active management.",
  },

  "transfer_coefficient": {
    title: "Transfer Coefficient (TC)",
    definition:
      "The correlation between the manager's optimal active portfolio weights and the actual portfolio weights implemented. It measures how efficiently a manager can translate their forecasts and insights into real portfolio positions. TC = 1 for a fully unconstrained portfolio. Long-only constraints, sector limits, and regulatory caps all reduce TC below 1, destroying some of the IC's value.",
    formula: "TC = Corr(Δwᵢ × σᵢ, μᵢ) ∈ [0, 1]",
    analogy:
      "You're a brilliant chess player (high IC) who is told you can only move pawns and bishops — no queens, no rooks (constraints). Your insight is high but your ability to implement the best strategy is hobbled. TC measures how much of your chess brilliance actually shows up on the board. A long-only fund is like playing chess with half your pieces missing.",
  },

  "breadth": {
    title: "Breadth (BR) — Number of Independent Bets",
    definition:
      "The number of truly independent active investment decisions a manager makes per year. 'Independent' is key — if 10 stock picks all react to the same GDP news, they are not truly independent bets. Breadth drives the Law of Large Numbers in investing: the more independent bets you can make, the more your skill compounds and the more reliable your active return becomes.",
    formula: "BR = Securities Held × Rebalancing Periods/Year",
    analogy:
      "Running a casino with 100 tables vs. betting everything on a single hand. With one hand, you could be ruined by luck. With 100 tables running all night, the house edge (your IC) is statistically almost guaranteed to compound into profit. High Breadth is why algorithmic quant funds with thousands of positions are so powerful — even a tiny IC compounds magnificently.",
  },

  "information_ratio": {
    title: "Information Ratio (IR)",
    definition:
      "The ratio of a portfolio's active return (return above the benchmark) to its active risk (tracking error). It measures how many units of active return are generated per unit of active risk taken. It is the 'Sharpe Ratio for active management'. An IR above 0.5 is considered good; above 1.0 is exceptional. Unlike the Sharpe ratio, the IR is sensitive to adding cash or leverage.",
    formula: "IR = E(R_A) / σ_A = Active Return / Tracking Error",
    analogy:
      "If the Sharpe Ratio asks 'How fast can you run?', the Information Ratio asks 'How much faster are you than the index runner next to you, for the energy you spent passing them?' A manager who beats the index by 3% while taking only 2% of extra risk (IR = 1.5) is far more impressive than one who beats it by 5% while taking 10% extra risk (IR = 0.5).",
  },

  "fundamental_law": {
    title: "Fundamental Law of Active Management (Grinold's Law)",
    definition:
      "The foundational theorem of active portfolio management, which decomposes a manager's expected Information Ratio into three components: Skill (IC), the number of opportunities to apply that skill (BR), and how efficiently they can implement their bets (TC). An unconstrained manager's optimal IR is simply IC × √BR. A constrained manager's IR is reduced by the Transfer Coefficient.",
    formula:
      "Unconstrained: IR* = IC × √BR\nConstrained: IR = TC × IC × √BR\nExpected Active Return: E(R_A) = TC × IC × √BR × σ_A",
    analogy:
      "Skill × Opportunity = Success. A brilliant surgeon (IC) who only performs 1 surgery a year (low BR) will have a less statistically reliable record than a brilliant surgeon who performs 500 a year (high BR). And if the hospital's safety rules (constraints) prevent the surgeon from using their best techniques, even more value is lost (low TC). The Fundamental Law quantifies this precisely.",
  },

  "optimal_active_risk": {
    title: "Optimal Active Risk (σ_A*)",
    definition:
      "The mathematically precise level of active risk (tracking error) an investor should allocate to a given active manager to maximise the total blended portfolio's Sharpe ratio. It is directly proportional to the manager's Information Ratio and inversely proportional to the benchmark's Sharpe ratio. It represents the exact portfolio construction formula for blending active and passive.",
    formula: "σ_A* = (IR / SR_B) × σ_B",
    analogy:
      "Mixing a cocktail. The active manager is the liquor (high-potency but needs to be controlled). The benchmark is the mixer. The Optimal Active Risk formula tells you the EXACT mathematical shot-to-mixer ratio for the perfect cocktail. Too much active manager (over-allocating) and the portfolio gets dangerously volatile. Too little and you're paying active fees for essentially passive exposure.",
  },

  "closet_index_fund": {
    title: "Closet Index Fund",
    definition:
      "An actively managed fund that closely mimics its benchmark index in practice, despite claiming to be actively managed and charging active management fees. These funds have very low active risk (tracking error), a Sharpe ratio similar to the benchmark, and — crucially — a negative Information Ratio after fees. They collect active fees while delivering passive performance.",
    formula: "Closet Indexer: IR ≈ 0 (before fees) → IR < 0 (after fees)",
    analogy:
      "A closet index fund is like a 'personal chef' who just orders food from Swiggy every night and plates it on fine china. You're paying a premium for the illusion of home-cooked meals, but you're actually getting the same Zomato food your neighbour orders for a fraction of the cost. The 'skill' (IC) is near zero, but the fees are very real.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 3 — FACTOR MODELS & APT
  // ─────────────────────────────────────────────────────────────────────────

  "arbitrage_pricing_theory": {
    title: "Arbitrage Pricing Theory (APT)",
    definition:
      "A multi-factor asset pricing model developed by Stephen Ross as an alternative to CAPM. APT states that expected returns are a linear function of multiple systematic risk factors (not just the market). Unlike CAPM, APT does not require the market portfolio to be one of the factors. Its core assumption is that no risk-free, zero-cost arbitrage opportunities can exist in equilibrium.",
    formula: "E(R_P) = R_F + β₁λ₁ + β₂λ₂ + ... + βₖλₖ",
    analogy:
      "CAPM is like saying a patient's health depends only on their age (one factor — the market). APT is like saying health depends on age, blood pressure, diet, sleep, and genetics (multiple factors). It's a richer, more realistic model. The key rule: if two portfolios have the same factor exposures, they must have the same expected return — any divergence is an arbitrage opportunity.",
  },

  "factor_sensitivity": {
    title: "Factor Sensitivity / Factor Loading (β)",
    definition:
      "The measure of how sensitively an asset's return responds to a one-unit change in a specific systematic risk factor. In CAPM, there is only one beta (market beta). In APT and multifactor models, each asset has multiple betas — one for each factor. A higher factor loading means the asset's return is more strongly driven by changes in that factor.",
    formula: "Asset Return = Rf + β₁F₁ + β₂F₂ + ... + firm-specific surprise",
    analogy:
      "Factor sensitivity is like a sound equaliser's slider for each frequency band. Beta to 'GDP factor' is the bass slider — it controls how much GDP news shakes your stock. Beta to 'inflation factor' is the treble slider. A stock with a very high GDP beta is like a speaker with the bass cranked all the way up — it reacts massively to macroeconomic news.",
  },

  "pure_factor_portfolio": {
    title: "Pure Factor Portfolio",
    definition:
      "A hypothetical portfolio constructed to have a factor sensitivity of exactly 1.0 to one specific risk factor, and factor sensitivities of exactly 0.0 to all other factors. Its expected return above the risk-free rate IS the risk premium (λ) for that single factor. Pure factor portfolios are the building blocks for pricing any asset in an APT framework.",
    formula: "E(Pure Factor Portfolio) − R_F = λⱼ (the risk premium for factor j)",
    analogy:
      "A pure factor portfolio is like a scientific control experiment. You isolate one variable (one risk factor) perfectly and neutralise everything else. By observing how this perfectly-isolated portfolio performs, you can precisely measure how much the market rewards investors for bearing ONLY that one specific risk.",
  },

  "macroeconomic_factor_model": {
    title: "Macroeconomic Factor Model",
    definition:
      "A multifactor model where the risk factors are surprises in macroeconomic variables (e.g., GDP growth, inflation, interest rates, credit spreads). The key insight is that only the UNEXPECTED part of these variables (the 'shock' or 'surprise') affects stock prices, because the expected value is already priced into the market. Factor = Realised Value − Consensus Expected Value.",
    formula: "R_i = E(R_i) + b_GDP × F_GDP + b_INF × F_INF + ε_i",
    analogy:
      "The stock market is like a student who has already studied the exam syllabus. What moves the market is not the question (which was expected) but the surprise — a question that wasn't on the syllabus. A GDP report that exactly matches the 2.5% consensus forecast moves nothing. An unexpected 4.5% GDP number is the 'surprise factor' that shocks the market.",
  },

  "fundamental_factor_model": {
    title: "Fundamental Factor Model",
    definition:
      "A multifactor model where the risk factors are firm-level financial attributes — like Price-to-Earnings (P/E), market capitalisation, leverage, and earnings growth rate. Unlike macroeconomic models, the factor sensitivities are standardised cross-sectional attributes (z-scores), not regression slopes. The most famous implementation is the Fama-French 3-factor model.",
    formula:
      "Factor Sensitivity (standardised) = (Stock's P/E − Avg P/E) / StdDev of P/E",
    analogy:
      "A fundamental factor model is like ranking students on a class curve. Instead of measuring 'how high the score is', it measures 'how many standard deviations above or below the class average this student sits'. A P/E sensitivity of +2.0 means this stock is 2 standard deviations more expensive than the average stock — and the model prices that premium.",
  },

  "fama_french": {
    title: "Fama-French 3-Factor Model",
    definition:
      "The most famous fundamental factor model, developed by Eugene Fama and Kenneth French. It adds two factors to the CAPM market factor: SMB (Small Minus Big — the return premium of small-cap stocks over large-cap stocks) and HML (High Minus Low — the return premium of high book-to-market 'value' stocks over low book-to-market 'growth' stocks). The Carhart 4-Factor model adds a Momentum (WML) factor.",
    formula: "E(R_i) = R_F + β_Mkt(R_M − R_F) + β_SMB(SMB) + β_HML(HML)",
    analogy:
      "CAPM is a black-and-white TV showing one channel. The Fama-French model is full colour HD with three channels: the market channel (are stocks rising?), the size channel (are small companies outperforming?), and the value channel (are cheap, unpopular stocks outperforming flashy growth stocks?). Each channel independently contributes to a stock's total expected return.",
  },

  "smb_factor": {
    title: "SMB — Small Minus Big Factor",
    definition:
      "One of the two additional factors in the Fama-French 3-Factor model. SMB measures the historical tendency for small-capitalisation stocks to outperform large-capitalisation stocks over time. A stock with a positive SMB loading has returns that behave more like small-cap stocks. The SMB premium is the return you earn for bearing the specific risks of being small (illiquidity, higher business risk).",
    formula: "SMB = Return of Small-Cap Stocks − Return of Large-Cap Stocks",
    analogy:
      "SMB is like the 'underdog premium' in a competition. Small businesses often have to work harder, take more risks, and are less protected from market shocks than large corporations. In exchange, investors in small-cap stocks historically earned a higher return — their 'underdog bonus' for bearing the greater uncertainty of investing in smaller companies.",
  },

  "hml_factor": {
    title: "HML — High Minus Low (Value) Factor",
    definition:
      "The second additional factor in the Fama-French 3-Factor model. HML measures the historical tendency for 'value' stocks (high book-to-market ratio, cheap relative to accounting value) to outperform 'growth' stocks (low book-to-market ratio, expensive relative to accounting value). A stock with positive HML loading benefits when value stocks are in favour.",
    formula: "HML = Return of High Book-to-Market Stocks − Return of Low Book-to-Market Stocks",
    analogy:
      "HML is the 'ugly duckling premium'. Value stocks are the unpopular, unglamorous companies that trade cheaply — nobody wants them. Growth stocks are the beautiful, hyped companies everyone loves. Fama and French found that the ugly ducks historically outperformed the swans over the long run, suggesting investors UNDER-price boredom and OVER-price glamour.",
  },

  "tracking_portfolio": {
    title: "Tracking Portfolio",
    definition:
      "A portfolio deliberately constructed to replicate the factor exposures of a target portfolio (like a benchmark index). It has specific, designed factor betas that match the target, not to maximise returns, but to perfectly mimic the factor-risk profile of the target. Tracking portfolios are used in risk management and for isolating specific factor bets.",
    formula: "Factor Exposures of Tracking Portfolio = Factor Exposures of Target",
    analogy:
      "A tracking portfolio is like a stunt double in a movie. The stunt double doesn't play the full role — they are engineered to perfectly replicate the star's appearance and specific dangerous moves, while the actual actor focuses on other scenes. The tracking portfolio 'doubles' for the factor risks of the original portfolio.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 4 — RISK MEASUREMENT
  // ─────────────────────────────────────────────────────────────────────────

  "value_at_risk": {
    title: "Value at Risk (VaR)",
    definition:
      "A statistical measure that estimates the minimum loss expected to be exceeded with a given probability (confidence level) over a specified time period. For example, a 5% monthly VaR of ₹10 lakh means there is a 5% probability the portfolio will lose AT LEAST ₹10 lakh in a given month. VaR tells you the threshold — but NOT how bad losses get beyond that threshold.",
    formula:
      "Parametric VaR = [μ_P − (z × σ_P)] × Portfolio Value\n(z = 1.65 for 95% confidence; z = 2.33 for 99% confidence)",
    analogy:
      "VaR is the 'flood warning system' for your money. It says: 'There is a 5% chance the water will rise higher than 10 feet this season.' It doesn't tell you whether it might rise to 11 feet or 50 feet beyond that threshold — just that you'll breach the warning level with 5% probability. The sandbags only go up to 10 feet; what happens after is another question entirely.",
  },

  "conditional_var": {
    title: "Conditional VaR (CVaR) — Expected Shortfall",
    definition:
      "An extension of VaR that answers the critical question VaR ignores: 'If we DO breach the VaR threshold, how bad does it actually get?' CVaR is the expected average loss of the portfolio conditional on the loss exceeding the VaR level. It captures the severity of tail losses, not just their probability. Mathematically, it is the integral of the tail distribution beyond VaR.",
    formula: "CVaR = E(Loss | Loss > VaR) [Average of worst-case losses in the tail]",
    analogy:
      "VaR tells you the 5% chance the flood will exceed 10 feet. CVaR tells you: 'When it DOES exceed 10 feet, the average water level is actually 17 feet.' CVaR is the answer to 'okay so we broke through the sandbags — now how deep are we swimming?' It's critical for stress-testing extreme catastrophic scenarios.",
  },

  "incremental_var": {
    title: "Incremental VaR (IVaR)",
    definition:
      "The change in the total portfolio's VaR that results from adding, removing, or changing the weight of a single position. IVaR isolates the contribution of one specific asset to the portfolio's total tail risk. A position with a very high IVaR is adding a disproportionate amount of tail risk to the portfolio and is a key target for risk reduction.",
    formula: "IVaR = VaR(Portfolio with position) − VaR(Portfolio without position)",
    analogy:
      "IVaR is the 'blame score' in a portfolio. If the entire basketball team loses by 30 points, IVaR asks: 'How much of that loss is specifically due to player #7?' By subbing out player #7 and seeing how the team's expected 'worst game performance' changes, you isolate that player's contribution to catastrophic risk.",
  },

  "max_drawdown": {
    title: "Maximum Drawdown (MDD)",
    definition:
      "The largest peak-to-trough decline in a portfolio's value over a specified period, before a new peak is reached. It measures the worst loss an investor would have experienced if they had invested at the peak and sold at the worst subsequent trough. It is a critical risk metric for backtesting investment strategies — especially for investors with low loss tolerance.",
    formula: "MDD = (Trough Value − Peak Value) / Peak Value [expressed as a %]",
    analogy:
      "Maximum drawdown is the 'worst nightmare scenario' of being the unluckiest investor possible. Imagine your friend invested at the exact top of the Dot-com bubble in 2000. Maximum drawdown tells you how deep into the valley they fell before markets recovered. A 90% drawdown means they watched their ₹1,00,000 become ₹10,000 before recovering.",
  },

  "sharpe_ratio": {
    title: "Sharpe Ratio (SR)",
    definition:
      "The most widely used risk-adjusted return metric. It measures the excess return earned above the risk-free rate per unit of TOTAL risk (standard deviation). A Sharpe ratio of 1.0 means you earn 1% of extra return for every 1% of total risk. A key property: the Sharpe ratio is unaffected by adding cash or leverage — both excess return and standard deviation scale proportionally.",
    formula: "SR = (R_P − R_F) / σ_P",
    analogy:
      "Sharpe Ratio is the 'return per horsepower' of investing. A car doing 200 km/h with a 500 horsepower engine is less efficient than a car doing 180 km/h with a 100 horsepower engine. The Sharpe Ratio rewards you for getting the most return bang for your risk buck. Two portfolios with the same return but different volatility will have different Sharpe Ratios.",
  },

  "treynor_ratio": {
    title: "Treynor Ratio",
    definition:
      "A risk-adjusted return metric similar to the Sharpe ratio but uses systematic risk (Beta) instead of total risk (Standard Deviation) in the denominator. It is appropriate when the portfolio is already part of a larger, well-diversified portfolio — meaning unsystematic risk has been eliminated. The Treynor ratio rewards managers only for the market risk they took.",
    formula: "Treynor Ratio = (R_P − R_F) / β_P",
    analogy:
      "The Treynor Ratio is like evaluating a surfer only on how they handled the biggest waves (market risk), ignoring whether they fell off the board due to their own clumsiness (company-specific risk). If you're part of a large team (diversified portfolio), your individual clumsiness doesn't matter to the team — only how well you rode the market wave.",
  },

  "jensens_alpha": {
    title: "Jensen's Alpha (α)",
    definition:
      "The excess return of a portfolio over what was expected by the Capital Asset Pricing Model (CAPM), given the portfolio's level of systematic risk (Beta). A positive alpha indicates the manager generated returns beyond what pure market exposure would predict — true 'value added'. It is the intercept of the regression of excess portfolio returns against excess market returns.",
    formula: "α = R_P − [R_F + β_P × (R_M − R_F)]",
    analogy:
      "Jensen's Alpha is like a teacher's grade adjustment. CAPM says: 'Given how hard the exam was (market conditions) and how smart this student is (beta), they should score 75%.' If the student scores 85%, the extra 10 marks is their Alpha — pure evidence of personal skill beyond what their 'intelligence' (beta) predicted.",
  },

  "m_squared": {
    title: "M-Squared (M²) — Modigliani Risk-Adjusted Performance",
    definition:
      "A performance metric that converts the Sharpe ratio into an annualised percentage return, making it directly comparable to the market's return. It works by hypothetically adjusting (leveraging up or de-leveraging) the portfolio so that its standard deviation exactly matches the market's standard deviation. A positive M² means the portfolio, at market-equivalent risk, outperformed the market.",
    formula: "M² = (SR_P − SR_M) × σ_M = Risk-adjusted outperformance in %",
    analogy:
      "Sharpe ratios are like track times — abstract and hard to compare (is 0.8 good?). M² is like converting everyone's time to 'how fast would you finish a standard 100m race?' It levels the playing field by adjusting everyone to run the same distance (same risk level as the market), then tells you who would win and by exactly how many metres.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 5 — MARKET STRUCTURE & ECONOMICS
  // ─────────────────────────────────────────────────────────────────────────

  "break_even_inflation": {
    title: "Break-Even Inflation Rate (BEI)",
    definition:
      "The difference in yield between a nominal (non-inflation-indexed) bond and an inflation-linked bond (like TIPS) of the same maturity. BEI is the market's implied forecast of inflation. It has two components: (1) the market's expected inflation and (2) an extra risk premium for the uncertainty around actual inflation. If actual inflation exceeds BEI, the TIPS holder wins.",
    formula: "BEI = Yield_Nominal − Yield_Inflation-Linked = π + θ (where θ = inflation risk premium)",
    analogy:
      "BEI is the market's bet on inflation. If BEI is 5%, the market is saying 'we expect inflation to be about 5%'. If you think inflation will be 8%, you'd buy the inflation-linked bond. If you think it'll be 3%, you'd buy the nominal bond. It's like a public odds board for the inflation race — whoever is right wins.",
  },

  "equity_risk_premium": {
    title: "Equity Risk Premium (ERP)",
    definition:
      "The excess return investors demand over the risk-free rate for investing in equities rather than bonds. It compensates for the higher risk and lower consumption-hedging properties of equities. Equity values are generally cyclical (high during expansions, low during recessions), which is EXACTLY when investors need their money most — meaning equities are poor hedges, justifying a large risk premium.",
    formula: "ERP = E(R_Equity) − R_F",
    analogy:
      "The Equity Risk Premium is the 'bad timing tax' investors are compensated for. Unlike gold or government bonds, stocks tend to crash exactly when recessions hit — when workers lose jobs and need cash desperately. An investment that tends to fail you when you need it most demands a higher expected reward (the ERP) in exchange for you accepting that terrible timing.",
  },

  "taylor_rule": {
    title: "Taylor Rule",
    definition:
      "A monetary policy guideline that prescribes how central banks should set their policy interest rates based on current economic conditions — specifically, the deviation of inflation from its target and the deviation of GDP from its potential (the 'output gap'). The Taylor Rule provides a mathematical framework for 'appropriate' interest rate setting, linking monetary policy to the business cycle.",
    formula: "Policy Rate = Neutral Rate + 0.5(Inflation Gap) + 0.5(Output Gap)",
    analogy:
      "The Taylor Rule is the autopilot for a central bank. If the economy is 'running hot' (inflation too high, GDP above potential), the rule says raise rates to cool it down. If the economy is 'in recession' (inflation low, GDP below potential), cut rates to stimulate it. Real central banks use it as a guideline (not a law), like an airline pilot using autopilot but retaining manual override.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 6 — BACKTESTING & STRATEGY EVALUATION
  // ─────────────────────────────────────────────────────────────────────────

  "survivorship_bias": {
    title: "Survivorship Bias",
    definition:
      "A critical flaw in backtesting that occurs when the historical dataset only includes assets or funds that still exist today — ignoring all companies that went bankrupt, were delisted, or funds that were liquidated due to poor performance. This artificially inflates historical backtested returns because all the 'losers' have been erased from history. It creates an illusion of a 'better' past.",
    formula: "Survivorship Bias Error = Backtested Return − True Historical Return [always positive]",
    analogy:
      "Survivorship bias is why we remember Steve Jobs but forget a thousand other garage inventors who failed. If you survey all tech entrepreneurs living in Silicon Valley today, they look incredibly successful. But you've completely excluded the thousands who tried, failed, and left — making entrepreneurship look far less risky than it actually is. Financial databases do the exact same thing with dead companies.",
  },

  "look_ahead_bias": {
    title: "Look-Ahead Bias",
    definition:
      "A backtesting flaw where the simulation uses information that was not actually available to investors at the time of the simulated trade. For example, using a company's Q1 2022 earnings report to make a simulated trade dated in January 2022, even though the report was only published in April 2022. It gives the strategy 'tomorrow's newspaper' to trade with today — producing artificially inflated returns.",
    formula: "Look-Ahead Bias Error = Using Data[t] at Time t-k (before it existed)",
    analogy:
      "Look-ahead bias is like allowing a student to study the exam questions the night before, and then claiming the result proves they are a genius. In backtesting, it's using quarterly earnings, merger announcements, or CEO resignations ON the date of the event — when in reality, the market wouldn't know until weeks later.",
  },

  "data_snooping": {
    title: "Data Snooping / Overfitting",
    definition:
      "A backtesting flaw where a researcher tests hundreds or thousands of different rules, parameters, and signals on the same historical dataset until, purely by statistical chance, one appears to work brilliantly. The 'strategy' is mathematically fitted to the noise of the past data, not to any underlying economic reality. It will almost certainly fail in live trading.",
    formula: "P(False Discovery) rises exponentially with number of tests run",
    analogy:
      "Data snooping is like adjusting the dartboard's position after you throw the dart — then claiming you got a bullseye. If you test 1,000 random number generators on past stock data, statistically, a few will appear to 'predict' the market perfectly. Those aren't genius strategies — they're lucky coincidences found by exhaustive searching. The strategy fits the past noise, not the future signal.",
  },

  "hit_rate": {
    title: "Hit Rate (Win Rate)",
    definition:
      "The proportion of active investment positions that are profitable (winners) out of the total number of positions taken. Hit rate alone does not determine profitability — a manager can have a 40% hit rate but still be highly profitable if their winners generate far more return than their losers (high Profit Factor). Hit rate is the simplest backtesting evaluation metric.",
    formula: "Hit Rate = Number of Profitable Trades / Total Number of Trades",
    analogy:
      "A cricket batsman's hit rate is how often they score runs (vs. getting out). But a batsman who scores 5 runs every 10 balls is worse than one who scores 0 runs 8 times and then hits a century. Hit Rate (consistency) must be evaluated alongside Gain/Loss Ratio (magnitude). A 30% hit rate with 10× winners is far better than 80% hit rate with 0.5× winners.",
  },

  "cape_ratio": {
    title: "CAPE Ratio — Shiller P/E",
    definition:
      "The Cyclically Adjusted Price-to-Earnings Ratio, developed by Robert Shiller. It is the ratio of the current stock price to a 10-year average of REAL (inflation-adjusted) earnings. By smoothing over a full business cycle (10 years), CAPE removes the distortion caused by cyclically depressed or inflated earnings, giving a more stable estimate of whether equities are broadly over or undervalued.",
    formula: "CAPE = Current Price / (10-Year Average of Real Earnings)",
    analogy:
      "A normal P/E ratio is like judging a restaurant's quality from a single night — that night could have been their absolute best or worst. CAPE is like reviewing 10 years of customer feedback across good times and bad. It tells you the restaurant's true quality by averaging out the lucky, exceptional nights and the off, disastrous ones. Shiller's CAPE is the 'long-form review' of stock market valuation.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 7 — ETF MECHANICS
  // ─────────────────────────────────────────────────────────────────────────

  "tracking_difference": {
    title: "Tracking Difference",
    definition:
      "The cumulative difference between an ETF's actual return (based on its NAV) and the return of its underlying benchmark index over the same period. Tracking difference is the sum of all frictions that prevent a perfect replication: management fees, transaction costs when index changes, sampling errors, and dividend taxation. Tracking Error is the annualised standard deviation of this daily tracking difference.",
    formula: "Tracking Difference = ETF Return − Benchmark Index Return [over a period]",
    analogy:
      "Tracking difference is like the gap between your GPS estimated arrival time and your actual arrival time. Every red light, every wrong turn, every pothole (fees, taxes, rebalancing costs) adds to the gap. A 'perfect' ETF with zero fees would have zero tracking difference. In reality, small leakages add up — tracking difference shows the total leakage over time.",
  },

  "etf_premium_discount": {
    title: "ETF Premium / Discount to NAV",
    definition:
      "The percentage difference between an ETF's market trading price and its Net Asset Value (NAV — the value of all the underlying securities it holds). When ETF price > NAV, it trades at a Premium. When ETF price < NAV, it trades at a Discount. The creation/redemption mechanism performed by Authorised Participants (APs) keeps this spread close to zero for most liquid ETFs.",
    formula: "Premium (Discount) % = (ETF Market Price − NAV) / NAV × 100",
    analogy:
      "An ETF trading at a premium is like a collectible trading card selling for more than the individual cards inside the pack are worth on the secondary market. This shouldn't happen for long — an arbitrageur (the Authorised Participant) will immediately buy the individual cards, bundle them into a pack, and sell it at the inflated pack price, pocketing the difference and correcting the premium.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 8 — IPS & CLIENT MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────

  "ips": {
    title: "Investment Policy Statement (IPS)",
    definition:
      "A formal, written document that governs a client's investment programme. It defines the client's objectives (risk and return targets) and constraints (time horizon, taxes, liquidity, legal/regulatory, and unique factors), and establishes the benchmark and monitoring procedures. The IPS is the legal and professional foundation of the client-manager relationship. The constraint framework is summarised by RRTTLLU.",
    formula: "IPS Constraints: RRTTLLU = Risk, Return, Time, Taxes, Liquidity, Legal, Unique",
    analogy:
      "An IPS is the financial constitution of a client's wealth. Just as a country's constitution defines the government's powers and limits, the IPS defines the manager's powers (what they can invest in) and limits (how much risk they can take, how quickly they must be able to liquidate). A government that ignores its constitution creates chaos; a manager that ignores the IPS creates lawsuits.",
  },

  "ability_vs_willingness": {
    title: "Ability vs. Willingness to Bear Risk",
    definition:
      "Two distinct and often conflicting dimensions of risk assessment in the IPS process. 'Ability' is the objective, financial capacity to absorb losses — determined by wealth, income stability, and time horizon. 'Willingness' is the subjective, psychological comfort with potential losses — determined by attitudes and temperament. When they conflict, the manager must ALWAYS construct the portfolio based on the MORE CONSERVATIVE of the two.",
    formula: "If Ability ≠ Willingness: Portfolio Risk = min(Ability, Willingness)",
    analogy:
      "A fearless 25-year-old tech founder (high ability — decades to recover, massive income) who is psychologically terrified of market fluctuations (low willingness) must be managed conservatively, despite their objective financial strength. Conversely, a risk-hungry retiree with no savings who 'wants to be in 100% stocks' has low ability — the manager must protect them from themselves.",
  },

};

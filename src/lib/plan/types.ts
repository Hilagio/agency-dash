/**
 * Structured 90-day client plan (BUILD: automate the ecomtrada 90-day report).
 *
 * The AI fills this structure (grounded in the account's live data + the client
 * context pack); a fixed template renders it in the ecomtrada house style with
 * charts drawn from real window data. Keeping the content structured — rather
 * than letting the model emit HTML — guarantees the brand look and real numbers.
 */

export type PlanLanguage = "en" | "nl";
export type PlanArchetype = "fix_first" | "scale";
export type PlanActor = "Ecomtrada" | "Client" | "Together";
/** SOP plan cycles: first = baseline + quick wins (0–90) · next = 90–180 scale/efficiency/expansion ·
 *  recovery = short sprint to fix critical issues fast · q4 = seasonal growth sprint · custom = user-briefed. */
export type PlanType = "first" | "next" | "recovery" | "q4" | "custom";

export interface PlanStat {
  key: string;                 // "Tracked ROAS"
  value: string;               // "1.54x"
  sub?: string;                // "target 2.6x"
  tone?: "good" | "bad" | "grad" | "neutral";
}
export interface PlanFinding { title: string; body: string; }
export interface PlanLever { title: string; body: string; }
export interface PlanBuildItem { title: string; body: string; }
export interface PlanPhaseAction {
  action: string; who: PlanActor; when: string;
  /** Added after activation as a deliberate deviation from the plan. */
  deviation?: boolean; deviationReason?: string; addedAt?: string; addedBy?: string;
  /** Dropped from the live plan (kept for the audit trail, excluded from progress). */
  dropped?: boolean; droppedReason?: string;
  /** Set only when rendering the live printable version: "afgerond 2026-09-17 · lennard". */
  doneStamp?: string;
}
export interface PlanPhase { title: string; window: string; actions: PlanPhaseAction[]; }
export interface PlanForecastRow { label: string; now: string; target: string; note?: string; }

export interface PlanContent {
  language: PlanLanguage;
  client: string;
  /** goal · market · target ROAS · period · AM — the header sub-line. */
  subtitle: string;
  archetype: PlanArchetype;
  planType?: PlanType;
  /** Plan horizon in days (default 90) — drives "day X of N" everywhere. */
  horizonDays?: number;
  /** SOP §2: the measurable goal for this period ("€30k → €60k/month at ROAS ≥ 3.0"). */
  goal?: string;
  /** SOP §3: the strategic roadmap — the logic of X now because it enables Y later. */
  pathToGoal?: string[];
  /** SOP snapshot: what could block progress in this cycle. */
  mainRisk?: string;
  /** SOP snapshot: when we decide next (first review moment). */
  nextReview?: string;
  /** "Where we start" / "The strategy" lead paragraph. */
  strategyLead: string;
  stats: PlanStat[];
  /** The one factor that decides everything (must be grounded in makeOrBreak). */
  makeOrBreakTitle: string;
  makeOrBreakBody: string;
  makeOrBreakBullets?: string[];
  findings: PlanFinding[];       // "what the data says" (2–4)
  levers: PlanLever[];           // the 2–3 strategic levers
  whatWeBuild: PlanBuildItem[];  // concrete campaign / systems stack
  phases: PlanPhase[];           // 3 phases, week ranges + who/when
  forecastLead?: string;
  forecast: PlanForecastRow[];   // now vs day-90 target
  whatWeNeed: string[];          // client responsibilities
  caveats?: string;              // "what we won't promise" / data caveat
}

/** Real chart series, computed from the spine — never authored by the model. */
export interface PlanCharts {
  /** ROAS across the standard windows, long→short (e.g. 90/30/14d). */
  roasWindows: { label: string; roas: number | null; target?: number | null; breakEven?: number | null }[];
  /** Average daily revenue, oldest→newest, to show acceleration/decline. */
  dailyRevenue: { label: string; value: number }[];
  currencySymbol: string;
}

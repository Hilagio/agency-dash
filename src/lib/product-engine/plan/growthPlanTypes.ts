// Types for the AI-authored growth plan (the "Briller-style" 90-day plan).
//
// Two halves:
//   • GrowthPlanData  — the factual data gathered server-side (Google Ads + Shopify).
//                       This is what Claude reads.
//   • GrowthPlanContent — the narrative Claude writes back. The renderer turns this
//                       into the on-brand HTML document.
//
// Kept dependency-free (no server imports) so the renderer can run in the browser too.

export type Lang = 'en' | 'nl';

/** The Client Context Pack — the six human-supplied "why" inputs (replaces the Typeform). */
export interface ContextPack {
  goalAmbition?: string;   // goal + target/proven ROAS beyond the data window
  usps?:         string;   // USPs & positioning
  audience?:     string;   // audience nuances (different products = different buyers)
  makeOrBreak?:  string;   // ⭐ the client-specific dynamic invisible in the numbers
  constraints?:  string;   // budget ceiling, countries, hard no-go's
  stockInputs?:  string;   // core product list, limited-edition alerts, restock cadence
}

/** One time window of account totals (mirrors GrowthWindow from google-ads.ts, decoupled). */
export interface MomentumWindow {
  label:           string;   // e.g. "90 days"
  days:            number;
  spendPerDay:     number;
  convValuePerDay: number;
  roas:            number;
}

/** A campaign read passed to Claude. */
export interface PlanCampaignData {
  name:           string;
  channelType:    string;
  spend:          number;
  roas:           number;
  cvr:            number;
  budgetLimited:  boolean;
  biddingLimited: boolean;
}

/** Everything factual the plan is built from. Gathered server-side; read by Claude. */
export interface GrowthPlanData {
  client:       string;
  currency:     string;
  market:       string | null;
  vertical:     string | null;
  periodLabel:  string;
  amName:       string | null;
  targetRoas:   number | null;
  goalNotes:    string | null;   // legacy free-text fallback
  contextPack:  ContextPack | null;  // the six structured human inputs
  scalingStrategy: string | null;    // cashflow-efficient | profitable | aggressive
  language:     Lang;

  google: {
    windows: {
      d90: MomentumWindow;
      d30: MomentumWindow;
      d14: MomentumWindow;
      d7?: MomentumWindow;   // live mode only; manual SOP uploads cover 90/30/14
    };
    breakEven:        number;
    breakEvenAssumed: boolean;
    wastedSpend:      number;
    winners:          { title: string; spend: number; revenue: number; roas: number }[];
    statusSummary:    { status: string; count: number; spend: number; revenue: number; roas: number }[];
    campaigns:        PlanCampaignData[];
    dailyBudget:      number | null;
    readyToScale:     boolean | null;
    scalingNote:      string | null;
  };

  shopify: null | {
    totalRevenue:   number;
    grossMarginPct: number | null;
    cogsConfigured: boolean;
    netSales:       number | null;
    googleSharePct: number | null;  // Google conv value ÷ Shopify total revenue
    aov:            number | null;
  };
}

// ─── What Claude authors ──────────────────────────────────────────────────────
// Prose fields support **bold** and newlines. The renderer escapes HTML first.

export interface GrowthFinding { big: string; body: string }

export interface GrowthPlanRow {
  action: string;
  who:    'Ecomtrada' | 'Client' | 'Together';
  when:   string;
}

export interface GrowthPlanPhase {
  title: string;            // e.g. "Phase 1 · Unlock & set the base (week 1–4)"
  rows:  GrowthPlanRow[];
}

export interface GrowthGoal {
  goal:       string;
  now:        string;
  target:     string;
  assessment: string;
  expand?:    boolean;      // highlight row (the headline growth goal)
}

export interface GrowthPlanContent {
  subtitle:      string;            // header strategic one-liner
  strategyLead:  string;            // "The strategy" prose
  standToday:    GrowthFinding[];   // 4 cards
  honestRead:    string;            // "The honest read on the numbers" prose (• bullets ok)
  momentumNote:  string;            // note under the momentum chart
  levers:        GrowthFinding[];   // 3–4 cards
  phases:        GrowthPlanPhase[]; // exactly 3
  forecastIntro: string;
  goals:         GrowthGoal[];
  forecastRead:  string;            // "The honest read:" note under the goals table
  seasonalNote:  string;
  needs:         string[];          // "What we need from you"
}

/** Minimal context the renderer needs beyond the authored content. */
export interface GrowthPlanRender {
  client:   string;
  currency: string;
  subtitle: string;
  windows:  MomentumWindow[];   // [d90, d30, d14] for the momentum chart
}

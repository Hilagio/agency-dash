// Ecomtrada huisstijl — single source of truth for the tool's look & feel.

export const BRAND = {
  bg: '#0B130F',
  bgDeep: '#050806',
  card: '#141F1A',
  paper: '#F5F4F0',
  dim: '#9fb3a8',
  gold: '#F9C31F',
  goldDark: '#F2A60D',
  green: '#33CC80',
  red: '#E5484D',
  redAlt: '#DC4444',
  line: '#26342b',
  gradient: 'linear-gradient(135deg,#F9C31F,#F2A60D 45%,#33CC80)',
  status: {
    WINNER:    { solid: '#33CC80', row: '#C9F2DE' },
    PROMISING: { solid: '#A9DFA0', row: '#E8F5D9' },
    TEST:      { solid: '#C7CED0', row: '#ECEFF0' },
    DRAG:      { solid: '#F2A60D', row: '#FBE4C9' },
    EXCLUDE:   { solid: '#DC4444', row: '#F6C9C9' },
  },
  fontStack: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
} as const;

export function brandWordmarkHTML(size = 22): string {
  return `<span style="font-weight:800;font-size:${size}px;color:${BRAND.paper}">ecomtrada<span style="color:${BRAND.gold}">.</span></span>`;
}

export const BRAND_CSS_VARS = `
  --bg:${BRAND.bg};--bg-deep:${BRAND.bgDeep};--card:${BRAND.card};--paper:${BRAND.paper};
  --dim:${BRAND.dim};--gold:${BRAND.gold};--gold-dark:${BRAND.goldDark};--green:${BRAND.green};
  --red:${BRAND.redAlt};--line:${BRAND.line};
  --grad:${BRAND.gradient};
`;

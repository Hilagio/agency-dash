// Adapter: the Client Context Pack Typeform export (CSV) -> ContextPack + identity.
// One response per row. Maps the Typeform questions onto the six structured fields.

import { ContextPack } from '../plan/growthPlanTypes';

function tokenize(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c === '\r') { /* ignore */ }
    else cur += c;
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

export interface TypeformImport {
  client?:          string;
  amName?:          string;
  targetRoasText?:  string;
  scalingStrategy?: string;
  contextPack:      ContextPack;
}

/** Parse the Typeform responses CSV. Uses the most recent (last) non-empty response. */
export function parseTypeformCsv(text: string): TypeformImport {
  const recs = tokenize(text).filter((r) => r.some((c) => c.trim() !== ''));
  if (recs.length < 2) return { contextPack: {} };

  const head = recs[0].map((h) => h.trim().toLowerCase());
  // last data row = newest response
  const row = recs[recs.length - 1];
  const get = (...needles: string[]) => {
    for (const n of needles) {
      const i = head.findIndex((h) => h.includes(n));
      if (i >= 0) return (row[i] ?? '').trim();
    }
    return '';
  };

  const goal     = get('what does the client want to achieve');
  const kpi      = get('main kpi');
  const roas     = get('target roas');
  const started  = get('account start', 'start spending');
  const strategy = get('strategy does the client prefer', 'kind of strategy');
  const usps     = get('usps', 'makes this client different');
  const audience = get('audience nuances', 'audience');
  const mob      = get('make-or-break', 'make or break');
  const elseNote = get('anything else');

  const goalAmbition = [
    goal && goal,
    kpi && `KPI: ${kpi}`,
    roas && `Target ROAS: ${roas}`,
    started && `Account started: ${started}`,
  ].filter(Boolean).join(' · ');

  return {
    client: get('client name') || undefined,
    amName: get('account manager') || undefined,
    targetRoasText: roas || undefined,
    scalingStrategy: strategy || undefined,
    contextPack: {
      goalAmbition: goalAmbition || undefined,
      usps: usps || undefined,
      audience: audience || undefined,
      makeOrBreak: mob || undefined,
      constraints: elseNote || undefined,
      stockInputs: undefined,
    },
  };
}

'use client';

import React, { useState, useMemo } from 'react';
import { BRAND } from '@/lib/product-engine/brand';
import { AnalysisResult } from '@/lib/product-engine/engine/types';
import { generatePlanHtml, downloadPlanHtml, PlanInputs } from '@/lib/product-engine/plan/ninetyDayPlan';

export interface NinetyDayPlanProps {
  result: AnalysisResult | null;
  defaultClient?: string;
}

export default function NinetyDayPlan({ result, defaultClient }: NinetyDayPlanProps) {
  const [input, setInput] = useState<PlanInputs>({
    client: defaultClient ?? '',
    market: '',
    amName: '',
    periodLabel: '90-day plan',
    language: 'en',
    targetRoas: undefined,
    makeOrBreak: '',
  });

  const set = (k: keyof PlanInputs) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setInput((s) => ({ ...s, [k]: k === 'targetRoas' ? (e.target.value ? parseFloat(e.target.value) : undefined) : e.target.value }));

  const html = useMemo(() => (result ? generatePlanHtml(result, input) : ''), [result, input]);

  if (!result) {
    return <div style={{ ...wrap, color: BRAND.dim, fontSize: 13 }}>Analyseer eerst een account in de Product Analyzer — dan vul ik dit plan automatisch met de data.</div>;
  }

  return (
    <div style={wrap}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: 22 }}>ecomtrada<span style={{ color: BRAND.gold }}>.</span></div>
        <div style={{ fontSize: 12, color: BRAND.dim, letterSpacing: 1, textTransform: 'uppercase' }}>90-day plan generator</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 16 }}>
        <input placeholder="Client" value={input.client} onChange={set('client')} style={inp} />
        <input placeholder="Markt (bv. NL)" value={input.market ?? ''} onChange={set('market')} style={inp} />
        <input placeholder="Account manager" value={input.amName ?? ''} onChange={set('amName')} style={inp} />
        <input placeholder="Periode-label" value={input.periodLabel ?? ''} onChange={set('periodLabel')} style={inp} />
        <input placeholder="Doel-ROAS (bv. 3)" value={input.targetRoas ?? ''} onChange={set('targetRoas')} style={inp} />
        <select value={input.language} onChange={set('language')} style={inp}>
          <option value="en">English</option>
          <option value="nl">Nederlands</option>
        </select>
      </div>

      <textarea placeholder="De make-or-break factor — het klant-specifieke ding dat de strategie bepaalt." value={input.makeOrBreak ?? ''} onChange={set('makeOrBreak')} style={{ ...inp, width: '100%', minHeight: 70, marginTop: 10, resize: 'vertical' }} />

      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <button onClick={() => downloadPlanHtml(result, input)} style={btnPrimary}>Download plan (HTML)</button>
        <button onClick={() => { const w = window.open('', '_blank'); if (w) { w.document.write(html); w.document.close(); } }} style={btnGhost}>Open in nieuw tabblad</button>
      </div>

      <div style={{ marginTop: 16, border: `1px solid ${BRAND.line}`, borderRadius: 12, overflow: 'hidden' }}>
        <iframe title="preview" srcDoc={html} style={{ width: '100%', height: 540, border: 'none', background: '#fff' }} />
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = { fontFamily: BRAND.fontStack, color: BRAND.paper, background: BRAND.bg, borderRadius: 16, padding: 24, border: `1px solid ${BRAND.line}` };
const inp: React.CSSProperties = { background: BRAND.bgDeep, color: BRAND.paper, border: `1px solid ${BRAND.line}`, borderRadius: 8, padding: '8px 10px', fontSize: 13 };
const btnPrimary: React.CSSProperties = { background: BRAND.gradient, color: '#0B130F', fontWeight: 800, border: 'none', borderRadius: 8, padding: '9px 16px', cursor: 'pointer', fontSize: 13 };
const btnGhost: React.CSSProperties = { background: 'transparent', color: BRAND.paper, border: `1px solid ${BRAND.line}`, borderRadius: 8, padding: '9px 14px', cursor: 'pointer', fontSize: 13 };

'use client';

// AI-authored Ecomtrada 90-day plan. Pulls live Google Ads data, has Claude write the
// plan the Ecomtrada way, and renders it into the branded template with a live preview.

import React, { useEffect, useMemo, useState } from 'react';
import { BRAND } from '@/lib/product-engine/brand';
import { renderGrowthPlanHtml } from '@/lib/product-engine/plan/growthPlanHtml';
import { GrowthPlanContent, GrowthPlanRender, Lang } from '@/lib/product-engine/plan/growthPlanTypes';

export interface GrowthPlanGeneratorProps {
  accountId: string;
  defaultClient?: string;
}

interface Inputs {
  amName: string;
  market: string;
  vertical: string;
  periodLabel: string;
  goalNotes: string;
  language: Lang;
}

export default function GrowthPlanGenerator({ accountId, defaultClient }: GrowthPlanGeneratorProps) {
  const [input, setInput] = useState<Inputs>({
    amName: '', market: '', vertical: '', periodLabel: '', goalNotes: '', language: 'en',
  });
  const [content, setContent] = useState<GrowthPlanContent | null>(null);
  const [render, setRender] = useState<GrowthPlanRender | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [error, setError] = useState('');

  const set = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setInput((s) => ({ ...s, [k]: e.target.value }));

  // Restore the last generated plan on mount.
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch(`/api/accounts/${accountId}/growth-plan`);
        if (res.ok) {
          const j = await res.json();
          if (live && j.plan?.content && j.plan?.render) {
            setContent(j.plan.content);
            setRender(j.plan.render);
            setGeneratedAt(j.generatedAt ?? null);
          }
        }
      } catch { /* ignore */ }
      finally { if (live) setRestoring(false); }
    })();
    return () => { live = false; };
  }, [accountId]);

  async function generate() {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/accounts/${accountId}/growth-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? 'Generation failed');
      setContent(j.content);
      setRender(j.render);
      setGeneratedAt(j.generatedAt ?? new Date().toISOString());
    } catch (e: unknown) {
      setError((e as Error).message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  const html = useMemo(
    () => (content && render ? renderGrowthPlanHtml(content, render) : ''),
    [content, render],
  );

  function download() {
    if (!html || !render) return;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `Ecomtrada-90DayPlan-${render.client.replace(/\s+/g, '')}.html`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div style={wrap}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: 22 }}>ecomtrada<span style={{ color: BRAND.gold }}>.</span></div>
        <div style={{ fontSize: 12, color: BRAND.dim, letterSpacing: 1, textTransform: 'uppercase' }}>90-day plan</div>
      </div>

      <p style={{ fontSize: 13, color: BRAND.dim, marginTop: 10, lineHeight: 1.5 }}>
        Pulls live Google Ads data (90 / 30 / 14-day windows, products, campaigns) and writes the plan
        the Ecomtrada way — honest read, the levers, a phased action table, a realistic forecast.
        Add the strategy context below so it names the make-or-break factor instead of staying generic.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 16 }}>
        <input placeholder="Account manager" value={input.amName} onChange={set('amName')} style={inp} />
        <input placeholder="Markt (bv. NL, USA)" value={input.market} onChange={set('market')} style={inp} />
        <input placeholder="Vertical (bv. men's jewellery)" value={input.vertical} onChange={set('vertical')} style={inp} />
        <input placeholder="Periode-label (auto if blank)" value={input.periodLabel} onChange={set('periodLabel')} style={inp} />
        <select value={input.language} onChange={set('language')} style={inp}>
          <option value="en">English</option>
          <option value="nl">Nederlands</option>
        </select>
      </div>

      <textarea
        placeholder="Strategy context — the goal & KPI, scaling appetite (cashflow / profitable / aggressive), gross margin / COGS, USPs, and the make-or-break factor. The more you give, the less generic the plan."
        value={input.goalNotes}
        onChange={set('goalNotes')}
        style={{ ...inp, width: '100%', minHeight: 90, marginTop: 10, resize: 'vertical' }}
      />

      <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={generate} disabled={loading} style={btnPrimary}>
          {loading ? 'Schrijven…' : content ? 'Opnieuw genereren' : 'Genereer plan'}
        </button>
        {content && <button onClick={download} style={btnGhost}>Download (HTML)</button>}
        {content && (
          <button
            onClick={() => { const w = window.open('', '_blank'); if (w) { w.document.write(html); w.document.close(); } }}
            style={btnGhost}
          >Open in nieuw tabblad</button>
        )}
        {generatedAt && <span style={{ fontSize: 11, color: BRAND.dim }}>Laatst gegenereerd: {new Date(generatedAt).toLocaleString()}</span>}
      </div>

      {loading && (
        <div style={{ marginTop: 14, fontSize: 13, color: BRAND.dim }}>
          Live data ophalen en het plan schrijven — dit duurt ~10–20 seconden.
        </div>
      )}
      {error && <div style={{ marginTop: 14, color: BRAND.redAlt, fontSize: 13 }}>⚠ {error}</div>}

      {restoring && !content && !error && (
        <div style={{ marginTop: 14, fontSize: 13, color: BRAND.dim }}>Laden…</div>
      )}

      {content && (
        <div style={{ marginTop: 16, border: `1px solid ${BRAND.line}`, borderRadius: 12, overflow: 'hidden' }}>
          <iframe title="90-day plan preview" srcDoc={html} style={{ width: '100%', height: 720, border: 'none', background: '#0B130F' }} />
        </div>
      )}
    </div>
  );
}

const wrap: React.CSSProperties = { fontFamily: BRAND.fontStack, color: BRAND.paper, background: BRAND.bg, borderRadius: 16, padding: 24, border: `1px solid ${BRAND.line}` };
const inp: React.CSSProperties = { background: BRAND.bgDeep, color: BRAND.paper, border: `1px solid ${BRAND.line}`, borderRadius: 8, padding: '8px 10px', fontSize: 13 };
const btnPrimary: React.CSSProperties = { background: BRAND.gradient, color: '#0B130F', fontWeight: 800, border: 'none', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontSize: 13 };
const btnGhost: React.CSSProperties = { background: 'transparent', color: BRAND.paper, border: `1px solid ${BRAND.line}`, borderRadius: 8, padding: '9px 14px', cursor: 'pointer', fontSize: 13 };

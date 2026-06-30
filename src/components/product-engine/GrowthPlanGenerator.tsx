'use client';

// The Ecomtrada 90-day plan generator.
//   • Client Context Pack — the six human "why" inputs (replaces the Typeform). Persisted.
//   • Live mode    — auto-fetch Google Ads data + Context Pack → plan.
//   • Manual mode  — upload the SOP CSVs + type Shopify numbers + Context Pack → plan.
// Both render the same Claude-authored, on-brand Briller-style document.

import React, { useEffect, useMemo, useState } from 'react';
import { BRAND } from '@/lib/product-engine/brand';
import { renderGrowthPlanHtml } from '@/lib/product-engine/plan/growthPlanHtml';
import { GrowthPlanContent, GrowthPlanRender, Lang, ContextPack } from '@/lib/product-engine/plan/growthPlanTypes';
import { parseGoogleAdsCampaignCsv, CampaignCsvResult } from '@/lib/product-engine/adapters/campaignCsvAdapter';
import { parseGoogleAdsProductCsv } from '@/lib/product-engine/adapters/csvAdapter';
import { RawRow } from '@/lib/product-engine/engine/types';

export interface GrowthPlanGeneratorProps {
  accountId: string;
  defaultClient?: string;
}

type Mode = 'live' | 'manual';

interface Identity {
  amName: string; market: string; vertical: string;
  periodLabel: string; language: Lang; scalingStrategy: string;
}

interface ShopifyForm {
  totalRevenue: string; aov: string; grossMarginPct: string;
  cogs: string; netSales: string; mostSold: string; inStock: string;
}

const EMPTY_PACK: ContextPack = { goalAmbition: '', usps: '', audience: '', makeOrBreak: '', constraints: '', stockInputs: '' };

function readFile(f: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error('Kon bestand niet lezen'));
    r.readAsText(f);
  });
}

export default function GrowthPlanGenerator({ accountId, defaultClient }: GrowthPlanGeneratorProps) {
  const [mode, setMode] = useState<Mode>('live');
  const [identity, setIdentity] = useState<Identity>({
    amName: '', market: '', vertical: '', periodLabel: '', language: 'en', scalingStrategy: '',
  });
  const [pack, setPack] = useState<ContextPack>(EMPTY_PACK);

  // manual inputs
  const [camp, setCamp] = useState<{ d90?: CampaignCsvResult; d30?: CampaignCsvResult; d14?: CampaignCsvResult }>({});
  const [prod, setProd] = useState<{ rows: RawRow[]; range: string } | null>(null);
  const [shop, setShop] = useState<ShopifyForm>({ totalRevenue: '', aov: '', grossMarginPct: '', cogs: '', netSales: '', mostSold: '', inStock: '' });

  // output
  const [content, setContent] = useState<GrowthPlanContent | null>(null);
  const [render, setRender] = useState<GrowthPlanRender | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [error, setError] = useState('');

  const setId = (k: keyof Identity) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setIdentity((s) => ({ ...s, [k]: e.target.value }));
  const setP = (k: keyof ContextPack) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
    setPack((s) => ({ ...s, [k]: e.target.value }));
  const setS = (k: keyof ShopifyForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setShop((s) => ({ ...s, [k]: e.target.value }));

  // Restore last plan + saved context pack.
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch(`/api/accounts/${accountId}/growth-plan`);
        if (res.ok) {
          const j = await res.json();
          if (!live) return;
          if (j.contextPack) setPack({ ...EMPTY_PACK, ...j.contextPack });
          if (j.plan?.content && j.plan?.render) {
            setContent(j.plan.content); setRender(j.plan.render);
            setGeneratedAt(j.generatedAt ?? null);
          }
        }
      } catch { /* ignore */ }
      finally { if (live) setRestoring(false); }
    })();
    return () => { live = false; };
  }, [accountId]);

  async function onCampaign(which: 'd90' | 'd30' | 'd14', f: File) {
    try {
      const parsed = parseGoogleAdsCampaignCsv(await readFile(f));
      setCamp((c) => ({ ...c, [which]: parsed }));
      setError('');
    } catch (e: unknown) { setError((e as Error).message); }
  }
  async function onProducts(f: File) {
    try {
      const parsed = parseGoogleAdsProductCsv(await readFile(f));
      setProd({ rows: parsed.rows, range: parsed.dateRange });
      setError('');
    } catch (e: unknown) { setError((e as Error).message); }
  }

  function applyResult(j: { content: GrowthPlanContent; render: GrowthPlanRender; generatedAt?: string }) {
    setContent(j.content); setRender(j.render);
    setGeneratedAt(j.generatedAt ?? new Date().toISOString());
  }

  async function generateLive() {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/accounts/${accountId}/growth-plan`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...identity, contextPack: pack }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? 'Generatie mislukt');
      applyResult(j);
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  async function generateManual() {
    if (!camp.d90 || !camp.d30 || !camp.d14) { setError('Upload de campagne-CSV voor 90, 30 én 14 dagen.'); return; }
    if (!prod || prod.rows.length === 0) { setError('Upload de producten-CSV (90 dagen, met Issues-kolom).'); return; }
    setLoading(true); setError('');
    try {
      const num = (v: string) => { const n = parseFloat(v.replace(/[^0-9.\-]/g, '')); return isNaN(n) ? null : n; };
      const payload = {
        ...identity,
        contextPack: pack,
        grossMarginPct: num(shop.grossMarginPct),
        windows: {
          d90: camp.d90.totals, d30: camp.d30.totals, d14: camp.d14.totals,
        },
        products: prod.rows,
        campaigns: camp.d90.campaigns.map((c) => ({
          name: c.name, channelType: c.channelType, spend: c.spend, convValue: c.convValue, conv: c.conv, clicks: c.clicks,
        })),
        shopify: {
          totalRevenue: num(shop.totalRevenue), aov: num(shop.aov), grossMarginPct: num(shop.grossMarginPct),
          cogs: num(shop.cogs), netSales: num(shop.netSales),
          mostSold: shop.mostSold || null, inStock: shop.inStock || null,
        },
      };
      const res = await fetch(`/api/accounts/${accountId}/growth-plan/manual`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? 'Generatie mislukt');
      applyResult(j);
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  const html = useMemo(() => (content && render ? renderGrowthPlanHtml(content, render) : ''), [content, render]);

  function download() {
    if (!html || !render) return;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `Ecomtrada-90DayPlan-${render.client.replace(/\s+/g, '')}.html`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const campSummary = (r?: CampaignCsvResult) =>
    r ? `${r.campaigns.length} campagnes · ROAS ${(r.totals.spend > 0 ? r.totals.convValue / r.totals.spend : 0).toFixed(2)}` : 'geen bestand';

  return (
    <div style={wrap}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: 22 }}>ecomtrada<span style={{ color: BRAND.gold }}>.</span></div>
        <div style={{ fontSize: 12, color: BRAND.dim, letterSpacing: 1, textTransform: 'uppercase' }}>90-day plan</div>
      </div>

      {/* ── Mode toggle ───────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button onClick={() => setMode('live')} style={tab(mode === 'live')}>Live data (auto)</button>
        <button onClick={() => setMode('manual')} style={tab(mode === 'manual')}>Handmatig (SOP-upload)</button>
      </div>
      <p style={{ fontSize: 12.5, color: BRAND.dim, marginTop: 10, lineHeight: 1.5 }}>
        {mode === 'live'
          ? 'Haalt Google Ads-data automatisch op (90/30/14-daagse vensters, producten, campagnes) en schrijft het plan op de Ecomtrada-manier.'
          : 'Volgt de SOP: upload de Google Ads-CSV’s en vul de Shopify-cijfers in. De engine bouwt hetzelfde plan. Shopify-API-koppeling volgt later.'}
      </p>

      {/* ── Identity ──────────────────────────────────────────────────── */}
      <div style={grid3}>
        <input placeholder="Account manager" value={identity.amName} onChange={setId('amName')} style={inp} />
        <input placeholder="Markt (bv. NL, USA)" value={identity.market} onChange={setId('market')} style={inp} />
        <input placeholder="Vertical (bv. men's jewellery)" value={identity.vertical} onChange={setId('vertical')} style={inp} />
        <select value={identity.scalingStrategy} onChange={setId('scalingStrategy')} style={inp}>
          <option value="">Schaalstrategie…</option>
          <option value="cashflow-efficient">Cashflow-efficiënt</option>
          <option value="profitable">Winstgevend</option>
          <option value="aggressive">Agressief schalen</option>
        </select>
        <input placeholder="Periode-label (auto)" value={identity.periodLabel} onChange={setId('periodLabel')} style={inp} />
        <select value={identity.language} onChange={setId('language')} style={inp}>
          <option value="en">English</option>
          <option value="nl">Nederlands</option>
        </select>
      </div>

      {/* ── Client Context Pack ───────────────────────────────────────── */}
      <div style={section}>
        <div style={sectionTitle}>Client Context Pack <span style={{ color: BRAND.dim, fontWeight: 400 }}>— de zes dingen die niet in de data zitten</span></div>
        <Field label="1 · Doel & ambitie" hint="wat de klant wil + hun doel/bewezen ROAS (buiten het datavenster)" value={pack.goalAmbition} onChange={setP('goalAmbition')} />
        <Field label="2 · USP's & positionering" hint="wat hen anders maakt" value={pack.usps} onChange={setP('usps')} />
        <Field label="3 · Doelgroep-nuances" hint="verschillende producten = verschillende kopers die het algoritme apart moet leren" value={pack.audience} onChange={setP('audience')} />
        <Field label="4 · ⭐ De make-or-break factor" hint="het klant-specifieke ding dat de strategie bepaalt en onzichtbaar is in de cijfers — laat dit NOOIT leeg" value={pack.makeOrBreak} onChange={setP('makeOrBreak')} star />
        <Field label="5 · Constraints" hint="budgetplafond, landen, harde no-go's" value={pack.constraints} onChange={setP('constraints')} />
        <Field label="6 · Voorraad-input" hint="kern-productenlijst, limited-edition alerts (inkomend + bijna op), restock-ritme" value={pack.stockInputs} onChange={setP('stockInputs')} />
      </div>

      {/* ── Manual upload ─────────────────────────────────────────────── */}
      {mode === 'manual' && (
        <div style={section}>
          <div style={sectionTitle}>SOP-data <span style={{ color: BRAND.dim, fontWeight: 400 }}>— Google Ads CSV’s + Shopify</span></div>

          <div style={{ ...grid3, marginTop: 4 }}>
            <FileInput label="Campagnes — 90 dagen" sub={campSummary(camp.d90)} onFile={(f) => onCampaign('d90', f)} />
            <FileInput label="Campagnes — 30 dagen" sub={campSummary(camp.d30)} onFile={(f) => onCampaign('d30', f)} />
            <FileInput label="Campagnes — 14 dagen" sub={campSummary(camp.d14)} onFile={(f) => onCampaign('d14', f)} />
          </div>
          <div style={{ marginTop: 10 }}>
            <FileInput label="Producten — 90 dagen (met Issues-kolom)" sub={prod ? `${prod.rows.length} regels${prod.range ? ' · ' + prod.range : ''}` : 'geen bestand'} onFile={onProducts} />
          </div>

          <div style={{ ...sectionTitle, marginTop: 18, fontSize: 12 }}>Shopify (uit Sidekick / P&L)</div>
          <div style={grid3}>
            <input placeholder="Totale omzet (90d)" value={shop.totalRevenue} onChange={setS('totalRevenue')} style={inp} />
            <input placeholder="AOV" value={shop.aov} onChange={setS('aov')} style={inp} />
            <input placeholder="Brutomarge %" value={shop.grossMarginPct} onChange={setS('grossMarginPct')} style={inp} />
            <input placeholder="COGS" value={shop.cogs} onChange={setS('cogs')} style={inp} />
            <input placeholder="Netto-omzet" value={shop.netSales} onChange={setS('netSales')} style={inp} />
            <input placeholder="Best verkocht (kort)" value={shop.mostSold} onChange={setS('mostSold')} style={inp} />
          </div>
          <input placeholder="Voorraad-status / OOS-notities" value={shop.inStock} onChange={setS('inStock')} style={{ ...inp, width: '100%', marginTop: 10 }} />
        </div>
      )}

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, marginTop: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={mode === 'live' ? generateLive : generateManual} disabled={loading} style={btnPrimary}>
          {loading ? 'Schrijven…' : content ? 'Opnieuw genereren' : 'Genereer plan'}
        </button>
        {content && <button onClick={download} style={btnGhost}>Download (HTML)</button>}
        {content && (
          <button onClick={() => { const w = window.open('', '_blank'); if (w) { w.document.write(html); w.document.close(); } }} style={btnGhost}>
            Open in nieuw tabblad
          </button>
        )}
        {generatedAt && <span style={{ fontSize: 11, color: BRAND.dim }}>Laatst gegenereerd: {new Date(generatedAt).toLocaleString()}</span>}
      </div>

      {loading && <div style={{ marginTop: 14, fontSize: 13, color: BRAND.dim }}>Data verwerken en het plan schrijven — dit duurt ~10–20 seconden.</div>}
      {error && <div style={{ marginTop: 14, color: BRAND.redAlt, fontSize: 13 }}>⚠ {error}</div>}
      {restoring && !content && !error && <div style={{ marginTop: 14, fontSize: 13, color: BRAND.dim }}>Laden…</div>}

      {content && (
        <div style={{ marginTop: 16, border: `1px solid ${BRAND.line}`, borderRadius: 12, overflow: 'hidden' }}>
          <iframe title="90-day plan preview" srcDoc={html} style={{ width: '100%', height: 720, border: 'none', background: '#0B130F' }} />
        </div>
      )}
    </div>
  );
}

/* ── sub-components ── */

function Field({ label, hint, value, onChange, star }: {
  label: string; hint: string; value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; star?: boolean;
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: star ? BRAND.gold : BRAND.paper }}>{label}</div>
      <div style={{ fontSize: 11, color: BRAND.dim, marginBottom: 4 }}>{hint}</div>
      <textarea value={value ?? ''} onChange={onChange} style={{ ...inp, width: '100%', minHeight: star ? 64 : 46, resize: 'vertical' }} />
    </div>
  );
}

function FileInput({ label, sub, onFile }: { label: string; sub: string; onFile: (f: File) => void }) {
  return (
    <label style={{ display: 'block', background: BRAND.bgDeep, border: `1px dashed ${BRAND.line}`, borderRadius: 8, padding: '10px 12px', cursor: 'pointer' }}>
      <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 11, color: BRAND.dim, marginTop: 2 }}>{sub}</div>
      <input type="file" accept=".csv" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
    </label>
  );
}

/* ── styles ── */
const wrap: React.CSSProperties = { fontFamily: BRAND.fontStack, color: BRAND.paper, background: BRAND.bg, borderRadius: 16, padding: 24, border: `1px solid ${BRAND.line}` };
const grid3: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 14 };
const section: React.CSSProperties = { marginTop: 18, paddingTop: 16, borderTop: `1px solid ${BRAND.line}` };
const sectionTitle: React.CSSProperties = { fontSize: 13, fontWeight: 800, marginBottom: 10 };
const inp: React.CSSProperties = { background: BRAND.bgDeep, color: BRAND.paper, border: `1px solid ${BRAND.line}`, borderRadius: 8, padding: '8px 10px', fontSize: 13 };
const btnPrimary: React.CSSProperties = { background: BRAND.gradient, color: '#0B130F', fontWeight: 800, border: 'none', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontSize: 13 };
const btnGhost: React.CSSProperties = { background: 'transparent', color: BRAND.paper, border: `1px solid ${BRAND.line}`, borderRadius: 8, padding: '9px 14px', cursor: 'pointer', fontSize: 13 };
function tab(active: boolean): React.CSSProperties {
  return { background: active ? BRAND.gold : 'transparent', color: active ? '#0B130F' : BRAND.paper, fontWeight: 700, border: `1px solid ${active ? BRAND.gold : BRAND.line}`, borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 12.5 };
}

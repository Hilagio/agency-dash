'use client';

// Branded Product Analyzer component for agency-dash.

import React, { useMemo, useRef, useState } from 'react';
import { BRAND } from '@/lib/product-engine/brand';
import { analyze } from '@/lib/product-engine/engine/productEngine';
import { AnalysisResult, RawRow, Status } from '@/lib/product-engine/engine/types';
import { parseGoogleAdsProductCsv } from '@/lib/product-engine/adapters/csvAdapter';
import { FetchProductRows } from '@/lib/product-engine/adapters/googleAdsAdapter';
import { downloadXlsx } from '@/lib/product-engine/export/xlsxExport';
import { downloadExclusionCsv } from '@/lib/product-engine/export/exclusionCsv';

const STATUSES: Status[] = ['WINNER', 'PROMISING', 'TEST', 'DRAG', 'EXCLUDE'];

export interface ProductAnalyzerProps {
  accounts?: { id: string; name: string }[];
  fetchRows?: FetchProductRows;
  defaultClient?: string;
  onResult?: (result: AnalysisResult | null) => void;
}

export default function ProductAnalyzer({ accounts, fetchRows, defaultClient, onResult }: ProductAnalyzerProps) {
  const [client, setClient] = useState(defaultClient ?? '');
  const [accountId, setAccountId] = useState(accounts?.[0]?.id ?? '');
  const [marginPct, setMarginPct] = useState<string>('');
  const [useRevenue, setUseRevenue] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [filter, setFilter] = useState<Status | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function run(rows: RawRow[], dateRange?: string) {
    try {
      const margin = marginPct ? parseFloat(marginPct) / 100 : null;
      const r = analyze(rows, { margin, useRevenue, dateRange });
      setResult(r);
      onResult?.(r);
      setError('');
    } catch (e: unknown) { setError((e as Error).message ?? String(e)); }
  }

  async function onAnalyzeLive() {
    if (!fetchRows || !accountId) return;
    setLoading(true); setError('');
    try {
      const rows = await fetchRows(accountId);
      run(rows);
      if (!client) setClient(accounts?.find((a) => a.id === accountId)?.name ?? accountId);
    } catch (e: unknown) { setError((e as Error).message ?? String(e)); }
    finally { setLoading(false); }
  }

  function onFile(f: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const { dateRange, rows } = parseGoogleAdsProductCsv(String(reader.result));
      if (!client) setClient(f.name.replace(/\.csv$/i, ''));
      run(rows, dateRange);
    };
    reader.readAsText(f);
  }

  const shown = useMemo(() => {
    if (!result) return [];
    return result.products.filter((p) =>
      (filter === 'ALL' || p.status === filter) &&
      (!search || p.product.toLowerCase().includes(search.toLowerCase()) || p.parent.includes(search))
    );
  }, [result, filter, search]);

  return (
    <div style={{ fontFamily: BRAND.fontStack, color: BRAND.paper, background: BRAND.bg, borderRadius: 16, padding: 24, border: `1px solid ${BRAND.line}` }}>
      <Header />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginTop: 16 }}>
        {fetchRows && (
          <>
            {accounts && accounts.length > 0 && (
              <select value={accountId} onChange={(e) => setAccountId(e.target.value)} style={inp}>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            )}
            <button onClick={onAnalyzeLive} disabled={loading} style={btnPrimary}>{loading ? 'Bezig…' : 'Analyseer account'}</button>
            <span style={{ color: BRAND.dim, fontSize: 12 }}>of</span>
          </>
        )}
        <input placeholder="Client naam" value={client} onChange={(e) => setClient(e.target.value)} style={inp} />
        <input placeholder="Marge % (optioneel)" value={marginPct} onChange={(e) => setMarginPct(e.target.value)} style={{ ...inp, width: 150 }} />
        <label style={{ fontSize: 12, color: BRAND.dim, display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="checkbox" checked={useRevenue} onChange={(e) => setUseRevenue(e.target.checked)} /> Revenue-modus
        </label>
        <button onClick={() => fileRef.current?.click()} style={btnGhost}>Upload CSV</button>
        <input ref={fileRef} type="file" accept=".csv" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </div>

      {error && <div style={{ marginTop: 14, color: BRAND.redAlt, fontSize: 13 }}>⚠ {error}</div>}

      {result && (
        <>
          <SummaryBand result={result} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 18 }}>
            <Donut title="Spend per status" data={result.statusSummary.map((s) => ({ label: s.status, value: s.spend }))} />
            <Donut title="Producten per status" data={result.statusSummary.map((s) => ({ label: s.status, value: s.count }))} />
          </div>

          <StatusTable result={result} onPick={setFilter} active={filter} />

          <div style={{ marginTop: 16, background: BRAND.card, border: `1px solid ${BRAND.line}`, borderRadius: 12, padding: '12px 16px', fontSize: 13 }}>
            <b style={{ color: BRAND.gold }}>{result.exclusions.length}</b> varianten veilig uit te sluiten nu —{' '}
            <b>{result.currency} {Math.round(result.exclusionRecovered).toLocaleString()}</b> spend terug te winnen.
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <button onClick={() => downloadXlsx(result, { client: client || 'client', charts: collectCharts() })} style={btnPrimary}>Download xlsx</button>
            <button onClick={() => downloadExclusionCsv(result, client || 'client')} style={btnGhost}>Download exclusion-lijst</button>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap', alignItems: 'center' }}>
            {(['ALL', ...STATUSES] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)} style={chip(s, filter)}>{s}</button>
            ))}
            <input placeholder="Zoek product…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inp, marginLeft: 'auto' }} />
          </div>

          <div style={{ marginTop: 12, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr>{['Product', 'Var', 'Clicks', 'Verw.conv', 'Spend', 'Conv', 'Omzet', 'ROAS', 'Conv%', 'Status'].map((h) => <th key={h} style={th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {shown.map((p) => (
                  <tr key={p.parent} style={{ background: BRAND.status[p.status].row + '22' }}>
                    <td style={td}>{p.product}{p.oos ? ' 🔻OOS' : ''}</td>
                    <td style={td}>{p.variants}</td>
                    <td style={td}>{p.clicks}</td>
                    <td style={td}>{p.expConv}</td>
                    <td style={td}>{result.currency} {Math.round(p.spend).toLocaleString()}</td>
                    <td style={td}>{p.conv.toFixed(1)}</td>
                    <td style={td}>{result.currency} {Math.round(p.revenue).toLocaleString()}</td>
                    <td style={{ ...td, fontWeight: 700 }}>{p.roas.toFixed(2)}</td>
                    <td style={td}>{p.convRate.toFixed(2)}%</td>
                    <td style={td}><Pill status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Header() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontWeight: 800, fontSize: 22 }}>ecomtrada<span style={{ color: BRAND.gold }}>.</span></div>
      <div style={{ fontSize: 12, color: BRAND.dim, letterSpacing: 1, textTransform: 'uppercase' }}>Product Analyzer</div>
    </div>
  );
}

function SummaryBand({ result }: { result: AnalysisResult }) {
  const t = result.totals; const cur = result.currency;
  const items: [string, string][] = [
    ['Spend', `${cur} ${Math.round(t.spend).toLocaleString()}`],
    ['Omzet', `${cur} ${Math.round(t.revenue).toLocaleString()}`],
    ['ROAS', t.roas.toFixed(2)],
    ['Conv-rate', `${(t.convRate * 100).toFixed(2)}%`],
    ['Break-even', `${t.breakEven}${t.breakEvenAssumed ? '*' : ''}`],
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length},1fr)`, gap: 10, marginTop: 18 }}>
      {items.map(([k, v]) => (
        <div key={k} style={{ background: BRAND.card, border: `1px solid ${BRAND.line}`, borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ fontSize: 10, color: BRAND.dim, textTransform: 'uppercase', letterSpacing: 1 }}>{k}</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>{v}</div>
        </div>
      ))}
      {result.dateRange && <div style={{ gridColumn: '1 / -1', fontSize: 11, color: BRAND.dim }}>{result.dateRange}{t.breakEvenAssumed ? ' · *break-even aangenomen (vul marge in)' : ''}{result.revenueColumnUsed === 'revenue' ? ' · REVENUE MODE' : ''}</div>}
    </div>
  );
}

function StatusTable({ result, onPick, active }: { result: AnalysisResult; onPick: (s: Status) => void; active: Status | 'ALL' }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 18 }}>
      <thead><tr>{['Status', 'Producten', 'Spend', '% spend', 'Omzet', 'ROAS', 'Actie'].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
      <tbody>
        {result.statusSummary.map((s) => (
          <tr key={s.status} onClick={() => onPick(s.status)} style={{ cursor: 'pointer', background: s.status === active ? BRAND.status[s.status].row + '33' : 'transparent' }}>
            <td style={td}><Pill status={s.status} /></td>
            <td style={td}>{s.count}</td>
            <td style={td}>{result.currency} {Math.round(s.spend).toLocaleString()}</td>
            <td style={td}>{Math.round(s.spendPct * 100)}%</td>
            <td style={td}>{result.currency} {Math.round(s.revenue).toLocaleString()}</td>
            <td style={td}>{s.roas.toFixed(2)}</td>
            <td style={{ ...td, color: BRAND.dim }}>{s.action}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Pill({ status }: { status: Status }) {
  return <span style={{ background: BRAND.status[status].solid, color: '#0B130F', fontWeight: 800, fontSize: 11, padding: '2px 8px', borderRadius: 20 }}>{status}</span>;
}

function Donut({ title, data }: { title: string; data: { label: string; value: number }[] }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  let acc = 0; const R = 60, C = 2 * Math.PI * R;
  return (
    <div data-donut style={{ background: BRAND.card, border: `1px solid ${BRAND.line}`, borderRadius: 12, padding: 14 }}>
      <div style={{ fontSize: 12, color: BRAND.dim, marginBottom: 8 }}>{title}</div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <svg width="150" height="150" viewBox="0 0 150 150">
          <g transform="rotate(-90 75 75)">
            {data.map((d) => {
              const frac = d.value / total; const dash = `${frac * C} ${C}`;
              const el = <circle key={d.label} cx="75" cy="75" r={R} fill="none" stroke={BRAND.status[d.label as Status].solid} strokeWidth="22" strokeDasharray={dash} strokeDashoffset={-acc * C} />;
              acc += frac; return el;
            })}
          </g>
        </svg>
        <div style={{ fontSize: 11.5 }}>
          {data.map((d) => (
            <div key={d.label} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: BRAND.status[d.label as Status].solid, display: 'inline-block' }} />
              {d.label} — {Math.round((d.value / total) * 100)}%
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function collectCharts(): { spendPie?: string; countPie?: string } {
  try {
    const svgs = Array.from(document.querySelectorAll('[data-donut] svg'));
    const toPng = (svg: Element): string => {
      const xml = new XMLSerializer().serializeToString(svg);
      return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(xml)));
    };
    return { spendPie: svgs[0] ? toPng(svgs[0]) : undefined, countPie: svgs[1] ? toPng(svgs[1]) : undefined };
  } catch { return {}; }
}

const inp: React.CSSProperties = { background: BRAND.bgDeep, color: BRAND.paper, border: `1px solid ${BRAND.line}`, borderRadius: 8, padding: '8px 10px', fontSize: 13 };
const btnPrimary: React.CSSProperties = { background: BRAND.gradient, color: '#0B130F', fontWeight: 800, border: 'none', borderRadius: 8, padding: '9px 16px', cursor: 'pointer', fontSize: 13 };
const btnGhost: React.CSSProperties = { background: 'transparent', color: BRAND.paper, border: `1px solid ${BRAND.line}`, borderRadius: 8, padding: '9px 14px', cursor: 'pointer', fontSize: 13 };
const th: React.CSSProperties = { textAlign: 'left', padding: '8px 10px', borderBottom: `1px solid ${BRAND.line}`, color: BRAND.dim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.5px' };
const td: React.CSSProperties = { padding: '7px 10px', borderBottom: `1px solid ${BRAND.line}` };
function chip(s: string, active: string): React.CSSProperties {
  return { background: s === active ? BRAND.gold : 'transparent', color: s === active ? '#0B130F' : BRAND.paper, fontWeight: 700, border: `1px solid ${BRAND.line}`, borderRadius: 20, padding: '5px 12px', cursor: 'pointer', fontSize: 12 };
}

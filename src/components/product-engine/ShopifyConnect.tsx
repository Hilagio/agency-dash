'use client';

// Connect a Shopify store to an account via a custom-app Admin API token (Phase 1).
// Once connected, the live 90-day plan auto-fills total store revenue, AOV and Google's
// share of total revenue.

import React, { useEffect, useState } from 'react';

export default function ShopifyConnect({ accountId }: { accountId: string }) {
  const [connected, setConnected] = useState(false);
  const [shopDomain, setShopDomain] = useState<string | null>(null);
  const [domainInput, setDomainInput] = useState('');
  const [token, setToken] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch(`/api/accounts/${accountId}/shopify`);
        if (res.ok && live) {
          const j = await res.json();
          setConnected(!!j.connected);
          setShopDomain(j.shopDomain ?? null);
        }
      } catch { /* ignore */ }
    })();
    return () => { live = false; };
  }, [accountId]);

  async function connect() {
    setLoading(true); setError(''); setNote('');
    try {
      const res = await fetch(`/api/accounts/${accountId}/shopify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopDomain: domainInput, accessToken: token }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? 'Connection failed');
      setConnected(true); setShopDomain(j.shopDomain); setToken(''); setOpen(false);
      setNote(`Verbonden met ${j.shop ?? j.shopDomain}${j.currency ? ` (${j.currency})` : ''}.`);
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  async function disconnect() {
    setLoading(true); setError('');
    try {
      await fetch(`/api/accounts/${accountId}/shopify`, { method: 'DELETE' });
      setConnected(false); setShopDomain(null); setNote('');
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🛍️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Shopify</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-dim)' }}>
              {connected
                ? <>Verbonden{shopDomain ? <> · <span style={{ color: 'var(--text-3)' }}>{shopDomain}</span></> : null} — live plan vult omzet & AOV automatisch in</>
                : 'Koppel de store zodat het plan totale omzet, AOV en Google’s aandeel automatisch ophaalt'}
            </div>
          </div>
        </div>
        {connected ? (
          <button onClick={disconnect} disabled={loading} style={btnGhost}>Ontkoppelen</button>
        ) : (
          <button onClick={() => setOpen((o) => !o)} style={btnPrimary}>{open ? 'Annuleren' : 'Verbind Shopify'}</button>
        )}
      </div>

      {note && <div style={{ marginTop: 8, fontSize: 12, color: 'var(--accent)' }}>✓ {note}</div>}

      {open && !connected && (
        <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <ol style={{ margin: '0 0 12px 16px', padding: 0, fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.7 }}>
            <li>In Shopify admin → <b style={{ color: 'var(--text-3)' }}>Settings → Apps and sales channels → Develop apps</b> → maak een custom app.</li>
            <li>Geef <b style={{ color: 'var(--text-3)' }}>read_orders</b> (Admin API scope) en installeer de app.</li>
            <li>Kopieer de <b style={{ color: 'var(--text-3)' }}>Admin API access token</b> en plak hieronder.</li>
          </ol>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input placeholder="store.myshopify.com" value={domainInput} onChange={(e) => setDomainInput(e.target.value)} style={inp} />
            <input placeholder="Admin API access token (shpat_…)" value={token} onChange={(e) => setToken(e.target.value)} style={inp} type="password" />
          </div>
          <button onClick={connect} disabled={loading || !domainInput || !token} style={{ ...btnPrimary, marginTop: 10 }}>
            {loading ? 'Verbinden…' : 'Verbind & test'}
          </button>
        </div>
      )}

      {error && <div style={{ marginTop: 10, fontSize: 12, color: '#E5484D' }}>⚠ {error}</div>}
    </div>
  );
}

const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 14 };
const inp: React.CSSProperties = { background: 'var(--input-bg)', color: 'var(--text)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '8px 10px', fontSize: 13 };
const btnPrimary: React.CSSProperties = { background: 'var(--btn-primary)', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 12.5, whiteSpace: 'nowrap' };
const btnGhost: React.CSSProperties = { background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 12.5, whiteSpace: 'nowrap' };

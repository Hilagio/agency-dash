"use client";

import { useState } from "react";
import { Search, Plus, CheckCircle, Loader2, RefreshCw } from "lucide-react";

interface GoogleAdsAccount {
  googleAdsId: string;
  name: string;
  currency: string;
  resourceName: string;
  imported: boolean;
}

interface Props {
  onImported: () => void;
}

export function AccountImporter({ onImported }: Props) {
  const [accounts, setAccounts] = useState<GoogleAdsAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [authRequired, setAuthRequired] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    setAuthRequired(false);
    try {
      const res = await fetch("/api/google-ads/accounts");
      const data = await res.json();
      if (!res.ok) {
        if (data.authUrl) { setAuthRequired(true); setError("Authentication required."); }
        else setError(data.error ?? "Failed to fetch accounts");
        return;
      }
      setAccounts(data);
      setLoaded(true);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const importAccount = async (account: GoogleAdsAccount) => {
    setImporting(account.googleAdsId);
    try {
      const res = await fetch("/api/google-ads/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleAdsId: account.googleAdsId,
          name:        account.name,
          currency:    account.currency,
        }),
      });
      if (res.ok) {
        setAccounts((prev) =>
          prev.map((a) => a.googleAdsId === account.googleAdsId ? { ...a, imported: true } : a)
        );
        onImported();
      }
    } finally {
      setImporting(null);
    }
  };

  const filtered = accounts.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.googleAdsId.includes(search)
  );

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--surface-3)", borderRadius: 14,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px", borderBottom: "1px solid var(--border)",
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-3)" }}>Import from MCC</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={fetchAccounts}
            disabled={loading}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--text-dim)", padding: 4, borderRadius: 6,
              display: "flex", alignItems: "center",
            }}
          >
            <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          </button>
        </div>
      </div>

      {/* Auth required */}
      {authRequired && (
        <div style={{ padding: 20 }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
            Connect your Google Ads account to import.
          </p>
          <a
            href="/api/auth/google-ads"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#1d4ed8", borderRadius: 8, color: "#fff",
              fontSize: 13, fontWeight: 500, padding: "8px 16px",
              textDecoration: "none",
            }}
          >
            Connect Google Ads →
          </a>
        </div>
      )}

      {/* Error */}
      {error && !authRequired && (
        <div style={{ padding: "14px 18px", fontSize: 13, color: "#f87171" }}>{error}</div>
      )}

      {/* Loading */}
      {loading && !authRequired && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, padding: "32px 0", color: "var(--text-dim)",
        }}>
          <Loader2 size={14} className="animate-spin" />
          <span style={{ fontSize: 13 }}>Fetching accounts from MCC…</span>
        </div>
      )}

      {/* Not loaded yet */}
      {!loaded && !loading && !error && (
        <div style={{ padding: 20 }}>
          <button
            onClick={fetchAccounts}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--surface-2)", border: "1px solid var(--border-2)",
              borderRadius: 8, color: "var(--text-muted)", fontSize: 13, fontWeight: 500,
              padding: "8px 14px", cursor: "pointer",
            }}
          >
            <Plus size={13} />
            Load accounts from MCC
          </button>
        </div>
      )}

      {/* Account list */}
      {!loading && !error && accounts.length > 0 && (
        <>
          {/* Search */}
          <div style={{ padding: "12px 18px 0" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "var(--input-bg)", border: "1px solid var(--surface-3)",
              borderRadius: 8, padding: "8px 12px",
            }}>
              <Search size={12} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or ID…"
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  fontSize: 13, color: "var(--text-3)",
                }}
              />
            </div>
          </div>

          {/* Rows */}
          <div style={{ maxHeight: 280, overflowY: "auto", padding: "8px 10px" }}>
            {filtered.length === 0 ? (
              <p style={{ padding: "16px 8px", textAlign: "center", fontSize: 13, color: "var(--text-dim)" }}>No accounts match</p>
            ) : (
              filtered.map((account) => (
                <div
                  key={account.googleAdsId}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 10px", borderRadius: 8,
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "var(--surface-2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                >
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-3)" }}>{account.name}</p>
                    <p style={{ fontSize: 11, color: "var(--text-dim)" }}>{account.googleAdsId} · {account.currency}</p>
                  </div>

                  {account.imported ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 500, color: "#4ade80" }}>
                      <CheckCircle size={12} /> Imported
                    </span>
                  ) : (
                    <button
                      onClick={() => importAccount(account)}
                      disabled={importing === account.googleAdsId}
                      style={{
                        display: "flex", alignItems: "center", gap: 5,
                        background: "#1d4ed8", borderRadius: 7, color: "#fff",
                        fontSize: 12, fontWeight: 500, padding: "5px 12px",
                        border: "none", cursor: importing === account.googleAdsId ? "not-allowed" : "pointer",
                        opacity: importing === account.googleAdsId ? 0.5 : 1,
                      }}
                    >
                      {importing === account.googleAdsId
                        ? <Loader2 size={10} className="animate-spin" />
                        : <Plus size={10} />}
                      Import
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{
            borderTop: "1px solid var(--border)", padding: "10px 18px",
            fontSize: 11, color: "var(--text-faint)",
          }}>
            {accounts.length} in MCC · {accounts.filter((a) => a.imported).length} imported
          </div>
        </>
      )}
    </div>
  );
}

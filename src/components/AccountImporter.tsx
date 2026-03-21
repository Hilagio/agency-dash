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
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState<GoogleAdsAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [authRequired, setAuthRequired] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    setAuthRequired(false);
    try {
      const res = await fetch("/api/google-ads/accounts");
      const data = await res.json();

      if (!res.ok) {
        if (data.authUrl) {
          setAuthRequired(true);
          setError("Google Ads authentication required.");
        } else {
          setError(data.error ?? "Failed to fetch accounts");
        }
        return;
      }

      setAccounts(data);
    } catch {
      setError("Network error — check that the dev server is running");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchAccounts();
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
          prev.map((a) =>
            a.googleAdsId === account.googleAdsId ? { ...a, imported: true } : a
          )
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

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:border-blue-400 hover:bg-blue-100 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Import accounts from Google Ads MCC
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h3 className="font-semibold text-gray-900 text-sm">Import from MCC</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAccounts}
            disabled={loading}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            close
          </button>
        </div>
      </div>

      {authRequired && (
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">
            You need to authorise Google Ads access first.
          </p>
          <a
            href="/api/auth/google-ads"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Connect Google Ads →
          </a>
        </div>
      )}

      {error && !authRequired && (
        <div className="p-4 text-sm text-red-600">{error}</div>
      )}

      {loading && !authRequired && (
        <div className="flex items-center justify-center gap-2 p-8 text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Fetching accounts from MCC…</span>
        </div>
      )}

      {!loading && !error && accounts.length > 0 && (
        <>
          <div className="px-4 pt-3">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or ID…"
                className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
              />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="p-4 text-center text-sm text-gray-400">No accounts match</p>
            ) : (
              filtered.map((account) => (
                <div
                  key={account.googleAdsId}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{account.name}</p>
                    <p className="text-xs text-gray-400">{account.googleAdsId} · {account.currency}</p>
                  </div>

                  {account.imported ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Imported
                    </span>
                  ) : (
                    <button
                      onClick={() => importAccount(account)}
                      disabled={importing === account.googleAdsId}
                      className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {importing === account.googleAdsId ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                      Import
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-400">
            {accounts.length} accounts in MCC · {accounts.filter((a) => a.imported).length} imported
          </div>
        </>
      )}
    </div>
  );
}

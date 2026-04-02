"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ERROR_MESSAGES: Record<string, string> = {
  no_code:        "Google sign-in was cancelled.",
  token_exchange: "Could not complete sign-in. Please try again.",
  no_email:       "Your Google account didn't share an email address.",
};

function LoginContent() {
  const params = useSearchParams();
  const error  = params.get("error");
  const errMsg = error ? (ERROR_MESSAGES[error] ?? "Something went wrong. Please try again.") : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 380,
        textAlign: "center",
      }}>
        {/* Logo / brand */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "linear-gradient(135deg, var(--btn-primary), #7c3aed)",
            margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.5px", marginBottom: 6 }}>
            Agency Dashboard
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-dim)" }}>
            Constraint-based Google Ads optimization
          </p>
        </div>

        {/* Error message */}
        {errMsg && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 10, padding: "12px 16px", marginBottom: 20,
            fontSize: 13, color: "#ef4444",
          }}>
            {errMsg}
          </div>
        )}

        {/* Sign in button */}
        <a
          href="/api/auth/signin"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            width: "100%", padding: "13px 20px",
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 12, textDecoration: "none",
            color: "var(--text)", fontSize: 14, fontWeight: 600,
            transition: "border-color 0.15s, box-shadow 0.15s",
            boxSizing: "border-box",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#3b82f6";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
          }}
        >
          {/* Google logo */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </a>

        <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 20, lineHeight: 1.6 }}>
          Your Google account is used only to sign in.<br />
          It does not grant access to your Google Ads data.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

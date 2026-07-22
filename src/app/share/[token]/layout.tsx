import type { Metadata } from "next";

// Client share pages are token-gated and must never be indexed or cached by
// search engines / link previewers.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: "Prestatieoverzicht · Ecomtrada",
};

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return children;
}

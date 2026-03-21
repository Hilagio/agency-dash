import type { Metadata } from "next";
import "./globals.css";

// System font stack — no Google Fonts network dependency
const geistSans = { variable: "" };

export const metadata: Metadata = {
  title: "Constraint Optimizer | Agency Dash",
  description: "Identify and resolve the governing constraint in your Google Ads accounts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}

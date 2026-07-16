import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ecomtrada AI",
  description: "Ecomtrada's AI account manager — spots what's wrong across your Google Ads accounts and helps you fix it.",
};

// Inline script applied before React hydration to prevent theme flash
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light') document.documentElement.classList.add('light');
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

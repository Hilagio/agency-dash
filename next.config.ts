import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the headless-browser packages out of the webpack bundle and ship them
  // as-is to the server runtime, so the page auditor's runtime require resolves
  // them (and their Chromium binary) in production.
  serverExternalPackages: ["playwright-core", "@sparticuz/chromium"],
};

export default nextConfig;

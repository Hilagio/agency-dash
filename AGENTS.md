<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deployment
- Production is on **Railway** at `https://agency-dash-production.up.railway.app`
- Never assume localhost — all OAuth redirect URIs, base URLs, and environment assumptions must account for Railway
- `RAILWAY_PUBLIC_DOMAIN` is auto-injected by Railway and is the canonical way to resolve the public origin in code

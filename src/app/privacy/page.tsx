/**
 * Public privacy policy for the Shopify app connection. Required for the Shopify
 * app review. Intentionally accessible without login (allowlisted in proxy.ts)
 * so Shopify's reviewers and merchants can read it before installing.
 */
export const metadata = {
  title: "Privacy Policy — Ecomtrada AI",
  description: "How the Ecomtrada AI Shopify connection accesses and handles store data.",
};

const UPDATED = "17 July 2026";

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "56px 22px 90px", lineHeight: 1.6, color: "#1a1a1a", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.6px", marginBottom: 6 }}>Privacy Policy</h1>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>Ecomtrada AI · last updated {UPDATED}</p>

      <Section title="Who we are">
        Ecomtrada AI is an internal analytics tool operated by Ecomtrada (a Google Ads agency,
        Netherlands). Our Shopify connection lets us reconcile a store&rsquo;s real order data
        against Google Ads performance so we can advise the store on its advertising. Contact:{" "}
        <a href="mailto:lennard@ecomtrada.nl">lennard@ecomtrada.nl</a>.
      </Section>

      <Section title="What data we access">
        With the store&rsquo;s permission we request read-only access to two things:
        <ul>
          <li><strong>Orders</strong> (<code>read_orders</code>) — used only for aggregate order counts and sales value per day.</li>
          <li><strong>Products</strong> (<code>read_products</code>) — product titles and identifiers, to attribute ad spend to products.</li>
        </ul>
        We request the minimum. We do <strong>not</strong> request or store customer personal data
        (names, emails, phone numbers, or addresses), and we never write to or modify the store.
      </Section>

      <Section title="How we use it">
        Order totals and product data are aggregated into daily figures and compared against Google
        Ads results to produce advertising diagnostics for the store. We do not sell data, share it
        with third parties, or use it for advertising to consumers.
      </Section>

      <Section title="Retention and deletion">
        We keep aggregated figures only as long as we advise the store. When the app is uninstalled,
        Shopify notifies us (<code>shop/redact</code>) and we delete the store&rsquo;s data. Because we
        hold no individual customer records, the <code>customers/data_request</code> and{" "}
        <code>customers/redact</code> requests have nothing to return or erase; we acknowledge them
        as required. You can also request deletion any time at the address above.
      </Section>

      <Section title="Security">
        Access tokens are stored encrypted at rest and transmitted only over HTTPS. Access is limited
        to Ecomtrada staff who manage the relevant account.
      </Section>

      <Section title="Changes">
        We&rsquo;ll update this page if our data practices change, with a new date above.
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 26 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h2>
      <div style={{ fontSize: 15 }}>{children}</div>
    </section>
  );
}

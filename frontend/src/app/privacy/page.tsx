import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — ReportIQ',
  description: 'Privacy Policy for ReportIQ client reporting platform.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6 sm:px-12 max-w-4xl mx-auto">
      <Link href="/" className="text-violet-400 hover:underline mb-8 inline-block">
        ← Back to Home
      </Link>
      
      <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
      <p className="text-slate-400 text-sm mb-8">Last updated: August 23, 2026</p>
      
      <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
          <p>
            ReportIQ collects minimal data necessary to provide automated marketing reporting services. This includes agency account information (email, name), client metrics requested for reports (GA4, Google Ads, Meta Ads data via authorized APIs), and billing metadata processed securely via Stripe.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Data</h2>
          <p>
            Data accessed through third-party integrations is strictly used to generate executive summaries, metric dashboards, and scheduled PDF reports. We do not sell, rent, or trade your data or your clients' data to any third party.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Data Security & Encryption</h2>
          <p>
            All connection credentials and OAuth tokens are stored encrypted. All client communications and report links are transmitted over HTTPS / SSL TLS 1.3 encryption.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Client Data Isolation</h2>
          <p>
            Each client report and portal is isolated. Client view access is strictly limited to authorized links or password-protected client portals.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Contact Us</h2>
          <p>
            For privacy inquiries, reach out to <span className="text-violet-400">support@reportiq.app</span>.
          </p>
        </section>
      </div>
    </div>
  );
}

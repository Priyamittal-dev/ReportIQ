import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — ReportIQ',
  description: 'Terms of Service for ReportIQ client reporting platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6 sm:px-12 max-w-4xl mx-auto">
      <Link href="/" className="text-violet-400 hover:underline mb-8 inline-block">
        ← Back to Home
      </Link>
      
      <h1 className="text-4xl font-bold text-white mb-6">Terms of Service</h1>
      <p className="text-slate-400 text-sm mb-8">Last updated: August 23, 2026</p>
      
      <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ReportIQ, you agree to comply with and be bound by these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Service Usage</h2>
          <p>
            ReportIQ provides automated report generation, white-labeling, and analytics for marketing agencies. You agree to use the service in compliance with all applicable laws and API terms of third-party platforms (Google, Meta).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Subscriptions & Billing</h2>
          <p>
            ReportIQ subscription plans are billed periodically (monthly or annually) via Stripe. You may cancel your subscription at any time via your account settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Limitation of Liability</h2>
          <p>
            ReportIQ provides AI insights and performance analytics as an assistance tool. We are not liable for business decisions or campaign modifications made based on generated reports.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Contact Information</h2>
          <p>
            Questions regarding terms should be sent to <span className="text-violet-400">support@reportiq.app</span>.
          </p>
        </section>
      </div>
    </div>
  );
}

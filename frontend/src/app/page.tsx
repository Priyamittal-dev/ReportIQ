'use client';
import Link from 'next/link';
import { Check, Zap, BarChart3, Mail, Globe, Clock, Shield, Brain, ArrowRight, ChevronRight, ShieldCheck, Lock, FileKey } from 'lucide-react';

const features = [
  {
    icon: '🤖',
    color: 'rgba(138,43,226,0.12)',
    title: 'AI-Written Summaries',
    desc: 'GPT-4o reads your metrics and writes professional executive summaries — highlighting wins, explaining anomalies, and suggesting next steps.',
  },
  {
    icon: '📊',
    color: 'rgba(0,229,255,0.1)',
    title: 'Google Analytics Integration',
    desc: 'Connect your GA4 property with OAuth in 60 seconds. Traffic, sessions, conversions — all pulled automatically every reporting cycle.',
  },
  {
    icon: '📄',
    color: 'rgba(16,212,142,0.1)',
    title: 'Branded PDF Export',
    desc: 'Every report is generated as a pixel-perfect PDF with your agency logo, brand colors, and client name — ready to send or download.',
  },
  {
    icon: '⏰',
    color: 'rgba(245,158,11,0.1)',
    title: 'Auto-Scheduled Delivery',
    desc: 'Set it once. Reports are generated and emailed to each client automatically, weekly or monthly, exactly when you want.',
  },
  {
    icon: '🔗',
    color: 'rgba(138,43,226,0.12)',
    title: 'Shareable Web Reports',
    desc: 'Every report gets a unique public link. Clients can view beautiful interactive dashboards in their browser — no PDF needed.',
  },
  {
    icon: '🏷️',
    color: 'rgba(244,63,94,0.1)',
    title: 'White-Label Ready',
    desc: 'Your agency name, your logo, your colors. Clients never see "ReportIQ" — they only see your brand delivering great reports.',
  },
];

const workflow = [
  { title: 'Sign up & add your agency branding', desc: 'Upload your logo, pick your brand colors. Your clients will only ever see your brand.' },
  { title: 'Connect data sources', desc: 'One-click Google Analytics OAuth. Or manually input metrics if not ready to connect.' },
  { title: 'Add your clients', desc: 'Enter each client\'s name, email, and timezone. Add as many as your plan allows.' },
  { title: 'Set a schedule', desc: 'Pick weekly or monthly delivery. Choose the day and time. That\'s it — fully automated from here.' },
  { title: 'AI generates & sends the report', desc: 'ReportIQ pulls data, writes the summary, exports PDF, and emails the branded report to your client.' },
];

const plans = [
  {
    plan: 'Starter',
    price: 'Free',
    priceNote: '',
    desc: 'Perfect to get started',
    features: ['2 clients', '1 integration', 'Manual report send', 'AI summaries', 'PDF export'],
  },
  {
    plan: 'Pro',
    price: '$29',
    priceNote: '/month',
    desc: 'For growing freelancers',
    popular: true,
    features: ['10 clients', '3 integrations', 'Auto-scheduled delivery', 'AI summaries', 'PDF + Web reports', 'Priority support'],
  },
  {
    plan: 'Agency',
    price: '$79',
    priceNote: '/month',
    desc: 'For full-service agencies',
    features: ['Unlimited clients', 'All integrations', 'Auto-scheduled delivery', 'White-label branding', 'Report history', 'Team access'],
  },
  {
    plan: 'White Label',
    price: '$149',
    priceNote: '/month',
    desc: 'Resell as your own product',
    features: ['Custom domain', 'Fully white-labeled', 'API access', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
  },
];

export default function LandingPage() {
  return (
    <main style={{ background: 'var(--bg-0)', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="landing-nav">
        <a href="/" className="landing-logo">Report<span style={{ color: 'var(--accent-2)' }}>IQ</span></a>
        <ul className="landing-nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/auth/login" className="btn btn-secondary btn-sm">Log in</Link>
          <Link href="/auth/signup" className="btn btn-gradient btn-sm">Start free →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="hero-eyebrow">🚀 AI-Powered Reporting Platform</div>
        <h1 className="hero-title">
          Stop spending <span className="gradient-word">6 hours</span> on<br />client reports every week
        </h1>
        <p className="hero-subtitle">
          ReportIQ connects to Google Analytics, generates AI-written summaries, and automatically emails branded reports to every client — on your schedule.
        </p>
        <div className="hero-cta-group">
          <Link href="/auth/signup" className="btn btn-gradient btn-lg">
            Start for free — no card needed
            <ArrowRight size={18} />
          </Link>
          <Link href="/report/bright-digital-may-2024" className="btn btn-secondary btn-lg">
            See sample report →
          </Link>
        </div>
        <div className="hero-social-proof">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="hero-proof-avatars">
              {['#8a2be2', '#06b6d4', '#10d48e', '#f59e0b', '#f43f5e'].map((c, i) => (
                <div key={i} className="hero-proof-avatar" style={{ background: c }}>
                  {['G', 'A', 'M', 'S', 'R'][i]}
                </div>
              ))}
            </div>
            <p className="hero-proof-text"><strong>250+ agencies</strong> already automating their reports</p>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            ⭐⭐⭐⭐⭐ &nbsp;"Saved us 30 hours a month. Best SaaS we've bought this year."
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="section section-center" id="features">
        <span className="section-tag">Features</span>
        <h2 className="section-title">Everything your agency needs</h2>
        <p className="section-subtitle">From data ingestion to branded delivery — fully automated, AI-powered, and white-labeled.</p>
        <div className="feature-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card animate-in" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section section-center" id="how-it-works" style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <span className="section-tag">Workflow</span>
        <h2 className="section-title">Set up once, report forever</h2>
        <p className="section-subtitle">Five simple steps to fully automated client reporting.</p>
        <div className="workflow-steps">
          {workflow.map((step, i) => (
            <div key={i} className="workflow-step animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="workflow-num">{i + 1}</div>
              <div className="workflow-content">
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROI stats */}
      <section className="section section-center">
        <span className="section-tag">ROI</span>
        <h2 className="section-title">The math is simple</h2>
        <div className="card-grid card-grid-4" style={{ maxWidth: 900, margin: '48px auto 0' }}>
          {[
            { value: '6–8h', label: 'saved per week', sub: 'per person' },
            { value: '$1,500', label: 'in labour saved', sub: 'per month avg.' },
            { value: '3x', label: 'client retention', sub: 'vs no reporting' },
            { value: '60s', label: 'to connect GA4', sub: 'via OAuth' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-0.03em', background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="section section-center" style={{ background: 'var(--bg-0)' }}>
        <span className="section-tag" style={{ background: 'rgba(16,212,142,0.1)', color: '#10d48e', border: '1px solid rgba(16,212,142,0.2)' }}>
          Enterprise Security
        </span>
        <h2 className="section-title">Bank-grade security & compliance</h2>
        <p className="section-subtitle" style={{ maxWidth: 700, margin: '0 auto 40px' }}>
          Your client data is your most valuable asset. We treat it that way. ReportIQ is audited and certified to meet the highest global security standards.
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', maxWidth: 1000, margin: '0 auto' }}>
          
          <div className="card" style={{ flex: '1 1 250px', display: 'flex', alignItems: 'center', gap: 16, padding: '24px', background: 'var(--bg-1)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(138,43,226,0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>ISO 27001</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Certified Information Security</div>
            </div>
          </div>

          <div className="card" style={{ flex: '1 1 250px', display: 'flex', alignItems: 'center', gap: 16, padding: '24px', background: 'var(--bg-1)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(0,229,255,0.1)', color: '#00e5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={24} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>SOC 2 Type II</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Audited & Verified Annually</div>
            </div>
          </div>

          <div className="card" style={{ flex: '1 1 250px', display: 'flex', alignItems: 'center', gap: 16, padding: '24px', background: 'var(--bg-1)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(16,212,142,0.1)', color: '#10d48e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileKey size={24} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>GDPR Compliant</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Data Privacy Guaranteed</div>
            </div>
          </div>

        </div>
      </section>

      {/* Pricing */}
      <section className="section section-center" id="pricing" style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <span className="section-tag">Pricing</span>
        <h2 className="section-title">Simple, transparent pricing</h2>
        <p className="section-subtitle">5–6× cheaper than AgencyAnalytics. Cancel anytime.</p>
        <div className="pricing-grid">
          {plans.map((p, i) => (
            <div key={i} className={`pricing-card ${p.popular ? 'popular' : ''}`}>
              <div className="pricing-plan">{p.plan}</div>
              <div className="pricing-price">{p.price}<span>{p.priceNote}</span></div>
              <div className="pricing-desc">{p.desc}</div>
              <div className="pricing-features">
                {p.features.map((f, j) => (
                  <div key={j} className="pricing-feature">
                    <Check size={14} />
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/auth/signup" className={`btn ${p.popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'center' }}>
                {p.price === 'Free' ? 'Get started free' : 'Start 14-day trial'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="section section-center">
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px', background: 'linear-gradient(135deg, rgba(138,43,226,0.1), rgba(0,229,255,0.05))', border: '1px solid var(--border-accent)', borderRadius: 24 }}>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Ready to automate your reporting?</h2>
          <p className="section-subtitle" style={{ marginBottom: 36 }}>Start free today. No credit card. No code. Just connect and report.</p>
          <Link href="/auth/signup" className="btn btn-gradient btn-lg">
            Create your free account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', padding: '40px 20px', background: 'var(--bg-1)', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '1000px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 700, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ReportIQ
            </span>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Contact: 7807221279</p>
            <p style={{ color: 'var(--text-secondary)' }}>Email: <a href="mailto:gargr0109@gmail.com" style={{ color: 'var(--accent-2)' }}>gargr0109@gmail.com</a></p>
          </div>
          
          <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <strong>Product</strong>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <Link href="/auth/login">Login</Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <strong>Preferences</strong>
            <select style={{ background: 'var(--bg-2)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 12px' }}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', width: '100%', maxWidth: '1000px', borderTop: '1px solid var(--border)', paddingTop: '20px', textAlign: 'center' }}>
          © 2024 ReportIQ. Built with ❤️ and AI. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

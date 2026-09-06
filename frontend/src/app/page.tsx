'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Zap, ArrowRight, ShieldCheck, Lock, FileKey, Calendar } from 'lucide-react';
import BookDemoModal from '../components/BookDemoModal';
import FreeTrialModal from '../components/FreeTrialModal';
import TimeTrackingShowcase from '../components/TimeTrackingShowcase';
import RoiCalculator from '../components/RoiCalculator';
import IntegrationsBar from '../components/IntegrationsBar';

const features = [
  {
    icon: '⚡',
    color: 'rgba(138,43,226,0.12)',
    title: 'AI-Written Summaries',
    desc: 'GPT-4o reads your metrics and writes professional executive summaries — highlighting wins, explaining anomalies, and suggesting next steps.',
  },
  {
    icon: '📊',
    color: 'rgba(0,229,255,0.1)',
    title: 'Google Analytics & Time Tracking',
    desc: 'Connect your GA4 property and desktop activity tracker. Sessions, work hours, conversions — all pulled automatically.',
  },
  {
    icon: '📄',
    color: 'rgba(16,212,142,0.1)',
    title: 'Branded PDF Export',
    desc: 'Every report is generated as a pixel-perfect PDF with your agency logo, brand colors, and client name — ready to send.',
  },
  {
    icon: '⏰',
    color: 'rgba(245,158,11,0.1)',
    title: 'Auto-Scheduled Delivery',
    desc: 'Set it once. Reports are generated and emailed to each client automatically, weekly or monthly, exactly when you want.',
  },
  {
    icon: '🌐',
    color: 'rgba(138,43,226,0.12)',
    title: 'Shareable Web Reports',
    desc: 'Every report gets a unique public link. Clients can view beautiful interactive dashboards in their browser — no PDF needed.',
  },
  {
    icon: '🎯',
    color: 'rgba(244,63,94,0.1)',
    title: 'White-Label Ready',
    desc: 'Your agency name, your logo, your colors. Clients never see "ReportIQ" — they only see your brand delivering great reports.',
  },
];

const workflow = [
  { title: 'Sign up & add your agency branding', desc: 'Upload your logo, pick your brand colors. Your clients will only ever see your brand.' },
  { title: 'Connect data sources & desktop tracker', desc: 'One-click GA4 OAuth and automated background time tracking.' },
  { title: 'Add your team & clients', desc: 'Enter employee roles, client names, and timezones.' },
  { title: 'Set a schedule', desc: 'Pick weekly or monthly delivery. Choose the day and time — fully automated from here.' },
  { title: 'AI generates & sends reports', desc: 'ReportIQ pulls data, writes summaries, exports PDF, and emails branded reports to your client.' },
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
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isTrialOpen, setIsTrialOpen] = useState(false);

  return (
    <main style={{ background: 'var(--bg-0)', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="landing-nav">
        <a href="/" className="landing-logo">
          Report<span style={{ color: '#00e5ff' }}>IQ</span>
        </a>
        
        <ul className="landing-nav-links">
          <li>
            <a href="#features" style={{ color: '#ffffff' }}>Features</a>
          </li>
          <li>
            <a href="#time-tracking" style={{ color: '#ffffff' }}>Time Tracking</a>
          </li>
          <li>
            <a href="#how-it-works" style={{ color: '#ffffff' }}>How it works</a>
          </li>
          <li>
            <a href="#pricing" style={{ color: '#ffffff' }}>Pricing</a>
          </li>
        </ul>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => setIsDemoOpen(true)}
            className="btn-nav-demo"
            style={{ gap: 6 }}
          >
            <Calendar size={14} />
            <span>Book a Demo</span>
          </button>

          <button
            onClick={() => setIsTrialOpen(true)}
            className="btn btn-gradient btn-sm"
            style={{ gap: 6, fontWeight: 700, boxShadow: '0 4px 14px rgba(0, 229, 255, 0.35)' }}
          >
            <Zap size={14} />
            <span>Try for Free</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="hero-eyebrow">⚡ AI-Powered Reporting & Time Tracking Platform</div>
        <h1 className="hero-title">
          Stop spending <span className="gradient-word">6 hours</span> on<br />workforce reports every week
        </h1>
        <p className="hero-subtitle">
          ReportIQ connects to Google Analytics and desktop time tracking, generates AI-written summaries, and automatically delivers branded reports to every client.
        </p>
        
        {/* CTAs with Book Demo & Free Trial */}
        <div className="hero-cta-group" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setIsTrialOpen(true)} className="btn btn-gradient btn-lg" style={{ gap: 8 }}>
            <span>Start Free 14-Day Trial</span>
            <ArrowRight size={18} />
          </button>
          <button onClick={() => setIsDemoOpen(true)} className="btn btn-secondary btn-lg" style={{ gap: 8 }}>
            <Calendar size={18} />
            <span>Book a Live Demo</span>
          </button>
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
            <p className="hero-proof-text"><strong>250+ agencies & teams</strong> already automating their work hours</p>
          </div>
        </div>
      </section>

      {/* Integrations Bar */}
      <IntegrationsBar />

      {/* Interactive Time Tracking & Workforce Intelligence Suite (MaxelTracker Model) */}
      <TimeTrackingShowcase
        onOpenDemo={() => setIsDemoOpen(true)}
        onOpenTrial={() => setIsTrialOpen(true)}
      />

      {/* ROI Calculator (MaxelTracker Style) */}
      <RoiCalculator
        onOpenDemo={() => setIsDemoOpen(true)}
      />

      {/* General Features */}
      <section className="section section-center" id="features">
        <span className="section-tag">Features</span>
        <h2 className="section-title">Everything your agency needs</h2>
        <p className="section-subtitle">From data ingestion to branded delivery — fully automated, AI-powered, and white-labeled.</p>
        <div className="feature-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card animate-in" style={{ animationDelay: (i * 0.07) + 's' }}>
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
            <div key={i} className="workflow-step animate-in" style={{ animationDelay: (i * 0.1) + 's' }}>
              <div className="workflow-num">{i + 1}</div>
              <div className="workflow-content">
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
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
          ReportIQ is audited and certified to meet the highest global security standards.
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
        <p className="section-subtitle">Cancel anytime. 14-day free trial on all plans.</p>
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
              <button
                onClick={() => setIsTrialOpen(true)}
                className={`btn ${p.popular ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {p.price === 'Free' ? 'Get started free' : 'Start 14-day trial'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="section section-center">
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px', background: 'linear-gradient(135deg, rgba(138,43,226,0.1), rgba(0,229,255,0.05))', border: '1px solid var(--border-accent)', borderRadius: 24 }}>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Ready to automate your team's tracking & reporting?</h2>
          <p className="section-subtitle" style={{ marginBottom: 36 }}>Start free today or schedule a live demo with our engineers.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setIsTrialOpen(true)} className="btn btn-gradient btn-lg">
              Start Free Trial
              <ArrowRight size={18} />
            </button>
            <button onClick={() => setIsDemoOpen(true)} className="btn btn-secondary btn-lg">
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', padding: '40px 20px', background: 'var(--bg-1)', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '1000px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 700, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ReportIQ
            </span>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Contact: +91 8708095922</p>
            <p style={{ color: 'var(--text-secondary)' }}>Email: <a href="mailto:priya1997mittal@gmail.com" style={{ color: 'var(--accent-2)' }}>priya1997mittal@gmail.com</a></p>
          </div>
          
          <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <strong>Product</strong>
            <a href="#features">Features</a>
            <a href="#time-tracking">Time Tracking</a>
            <a href="#pricing">Pricing</a>
            <button onClick={() => setIsDemoOpen(true)} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}>
              Book Demo
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BookDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />

      <FreeTrialModal
        isOpen={isTrialOpen}
        onClose={() => setIsTrialOpen(false)}
      />
    </main>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Rocket, Users, FileText, Plug, Zap, BarChart3 } from 'lucide-react';

const TOUR_STEPS = [
  {
    title: 'Welcome to ReportIQ! 🚀',
    description: 'Your all-in-one marketing analytics and reporting platform. Let me give you a quick tour of everything you can do.',
    icon: <Rocket size={32} />,
    color: '#8b5cf6',
  },
  {
    title: 'Add Your First Client',
    description: 'Start by adding your clients in the Clients section. Enter their name, email, and website — this is the foundation for generating reports.',
    icon: <Users size={32} />,
    color: '#3b82f6',
    targetNav: '/dashboard/clients',
  },
  {
    title: 'Connect Data Sources',
    description: 'Head to Integrations to connect Google Ads, Meta Ads, Google Analytics, and more. Real-time data flows directly into your reports.',
    icon: <Plug size={32} />,
    color: '#10b981',
    targetNav: '/dashboard/integrations',
  },
  {
    title: 'Generate AI-Powered Reports',
    description: 'Click "Generate Report" to create beautiful, data-driven reports with AI-generated insights. Each report gets a shareable public link.',
    icon: <FileText size={32} />,
    color: '#f59e0b',
    targetNav: '/dashboard/reports',
  },
  {
    title: 'Chat with AI Assistant',
    description: 'Need help analyzing data or crafting strategy? Our AI Assistant is available 24/7 to answer your marketing questions.',
    icon: <Zap size={32} />,
    color: '#ec4899',
    targetNav: '/dashboard/chat',
  },
  {
    title: 'You\'re All Set! 🎉',
    description: 'You now know the basics. Explore the dashboard, build your first report, and wow your clients. Welcome to the future of agency reporting!',
    icon: <BarChart3 size={32} />,
    color: '#8b5cf6',
  },
];

export default function OnboardingTour({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const current = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;
  const isFirst = step === 0;

  const handleFinish = () => {
    localStorage.setItem('riq_onboarding_done', 'true');
    setVisible(false);
    onComplete();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 24,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 520,
        background: 'var(--bg-1, #1a1a2e)',
        border: '1px solid var(--border, #2a2a3e)',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Header gradient */}
        <div style={{
          padding: '48px 40px 32px',
          background: `linear-gradient(135deg, ${current.color}22 0%, transparent 100%)`,
          textAlign: 'center',
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: `${current.color}22`,
            border: `2px solid ${current.color}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: current.color,
          }}>
            {current.icon}
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary, #fff)', marginBottom: 12 }}>
            {current.title}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--text-secondary, #94a3b8)', maxWidth: 400, margin: '0 auto' }}>
            {current.description}
          </p>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '16px 0' }}>
          {TOUR_STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i === step ? current.color : 'var(--border, #333)',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', padding: '16px 40px 32px', gap: 12 }}>
          {!isFirst && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: 12,
                border: '1px solid var(--border, #333)',
                background: 'transparent',
                color: 'var(--text-primary, #fff)',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
          <button
            onClick={isLast ? handleFinish : () => setStep(s => s + 1)}
            style={{
              flex: isFirst ? 1 : 1,
              padding: '14px',
              borderRadius: 12,
              border: 'none',
              background: current.color,
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {isLast ? 'Get Started!' : isFirst ? "Let's Go!" : 'Next'} {!isLast && <ChevronRight size={16} />}
          </button>
        </div>

        {/* Skip */}
        <div style={{ textAlign: 'center', paddingBottom: 20 }}>
          <button
            onClick={handleFinish}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted, #666)',
              fontSize: 13,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Skip tour
          </button>
        </div>
      </div>
    </div>
  );
}

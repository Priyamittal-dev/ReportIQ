'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, Plug, Settings,
  LogOut, BarChart3, Zap, CreditCard, Shield, Code
} from 'lucide-react';
import dynamic from 'next/dynamic';
import OnboardingTour from './OnboardingTour';
import { useTranslation } from '@/components/providers/LanguageProvider';

// Dynamically import heavy components
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });
const CommandPalette = dynamic(() => import('@/components/CommandPalette'), { ssr: false });
const NotificationCenter = dynamic(() => import('@/components/NotificationCenter'), { ssr: false });

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, translationKey: 'nav.overview' },
  { href: '/dashboard/clients', icon: Users, translationKey: 'nav.clients' },
  { href: '/dashboard/reports', icon: FileText, translationKey: 'nav.reports' },
  { href: '/dashboard/templates', icon: FileText, translationKey: 'nav.templates' },
  { href: '/dashboard/integrations', icon: Plug, translationKey: 'nav.integrations' },
  { href: '/dashboard/chat', icon: Zap, translationKey: 'nav.ai_assistant' },
  { href: '/dashboard/team', icon: Users, translationKey: 'nav.team' },
  { href: '/dashboard/audit-logs', icon: FileText, translationKey: 'nav.audit_logs' },
  { href: '/dashboard/tools/scraper', icon: Zap, translationKey: 'nav.competitor' },
  { href: '/dashboard/docs', icon: FileText, translationKey: 'nav.knowledge' },
  { href: '/dashboard/developer', icon: Code, translationKey: 'nav.developer' },
  { href: '/dashboard/billing', icon: CreditCard, translationKey: 'nav.billing' },
  { href: '/dashboard/settings', icon: Settings, translationKey: 'nav.settings' },
  { href: '/admin', icon: Shield, translationKey: 'nav.admin' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const token = localStorage.getItem('riq_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    const stored = localStorage.getItem('riq_user');
    if (stored) setUser(JSON.parse(stored));

    if (!localStorage.getItem('riq_onboarding_done')) {
      setShowOnboarding(true);
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/config`)
      .then(res => res.json())
      .then(data => { if (data.maintenanceMode) setMaintenanceMode(true); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('riq_theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Global ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const logout = () => {
    localStorage.removeItem('riq_token');
    localStorage.removeItem('riq_user');
    router.push('/');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('riq_theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (maintenanceMode && !pathname.startsWith('/admin')) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-0)', textAlign: 'center', padding: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Shield size={40} />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>System Under Maintenance</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500, lineHeight: 1.6, marginBottom: 32 }}>
          We are currently performing scheduled maintenance. ReportIQ will be back online shortly!
        </p>
        <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ padding: '12px 24px' }}>
          Check Status
        </button>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Link href="/dashboard" className="sidebar-logo-text">
            Report<span>IQ</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-label">{t('nav.menu')}</span>
          {navItems.map(({ href, icon: Icon, translationKey }) => (
            <Link
              key={href}
              href={href}
              className={`sidebar-nav-item ${pathname === href ? 'active' : ''}`}
            >
              <Icon size={16} />
              {t(translationKey)}
            </Link>
          ))}

          <span className="sidebar-section-label" style={{ marginTop: 12 }}>{t('nav.quick_actions')}</span>
          <Link href="/dashboard/reports/generate" className="sidebar-nav-item" style={{ background: 'rgba(138,43,226,0.08)', border: '1px solid rgba(138,43,226,0.15)', color: 'var(--accent)' }}>
            <Zap size={16} />
            {t('nav.generate_report')}
          </Link>
        </nav>

        <div className="sidebar-bottom">
          {user && (
            <div style={{ marginBottom: 12, padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.agencyName}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
              <div style={{ marginTop: 8 }}>
                <span className="badge badge-ready">{user.plan || 'STARTER'}</span>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={() => { localStorage.removeItem('riq_onboarding_done'); window.location.reload(); }}
              className="sidebar-nav-item"
              style={{ color: 'var(--text-secondary)' }}
            >
              <FileText size={16} />
              {t('nav.restart_tour')}
            </button>
            <button onClick={logout} className="sidebar-nav-item" style={{ color: 'var(--accent-red)' }}>
              <LogOut size={16} />
              {t('nav.log_out')}
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {/* HEADER */}
        <header style={{ height: 64, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 40px', background: 'var(--bg-0)', position: 'sticky', top: 0, zIndex: 50, gap: 16 }}>
          {/* ⌘K Search Bar */}
          <button
            onClick={() => setCmdOpen(true)}
            style={{
              flex: 1, maxWidth: 420,
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 14px', borderRadius: 10,
              background: 'var(--bg-2)', border: '1px solid var(--border)',
              cursor: 'text', color: 'var(--text-muted)', fontSize: 14,
              transition: 'all 0.2s', textAlign: 'left',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
          >
            <BarChart3 size={16} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>Search commands... (Ctrl+K)</span>
            <kbd style={{ padding: '2px 7px', borderRadius: 5, background: 'var(--bg-0)', border: '1px solid var(--border)', fontSize: 11 }}>⌘K</kbd>
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>

            {/* Notification Center */}
            <NotificationCenter />
          </div>
        </header>

        {children}
      </main>

      {/* Global Floating AI Chatbot */}
      <ChatWidget />

      {/* Command Palette Overlay */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour onComplete={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}

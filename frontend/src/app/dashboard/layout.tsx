'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, Plug, Settings,
  LogOut, BarChart3, Zap, Menu, X, CreditCard
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/clients', icon: Users, label: 'Clients' },
  { href: '/dashboard/reports', icon: FileText, label: 'Reports' },
  { href: '/dashboard/templates', icon: FileText, label: 'Templates Builder' },
  { href: '/dashboard/integrations', icon: Plug, label: 'Integrations' },
  { href: '/dashboard/chat', icon: Zap, label: 'AI Assistant' },
  { href: '/dashboard/team', icon: Users, label: 'Team Management' },
  { href: '/dashboard/audit-logs', icon: FileText, label: 'Audit Logs' },
  { href: '/dashboard/developer', icon: Settings, label: 'Developer APIs' },
  { href: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('riq_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    const stored = localStorage.getItem('riq_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const logout = () => {
    localStorage.removeItem('riq_token');
    localStorage.removeItem('riq_user');
    router.push('/');
  };

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
          <span className="sidebar-section-label">Menu</span>
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`sidebar-nav-item ${pathname === href ? 'active' : ''}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}

          <span className="sidebar-section-label" style={{ marginTop: 12 }}>Quick Actions</span>
          <Link href="/dashboard/reports/generate" className="sidebar-nav-item" style={{ background: 'rgba(138,43,226,0.08)', border: '1px solid rgba(138,43,226,0.15)', color: 'var(--accent)' }}>
            <Zap size={16} />
            Generate Report
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
          <button onClick={logout} className="sidebar-nav-item" style={{ color: 'var(--accent-red)' }}>
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>

      <main className="main-content">
        {/* SPOTLIGHT SEARCH HEADER */}
        <header style={{ height: 64, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 40px', background: 'rgba(6, 8, 16, 0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, position: 'relative' }}>
            <span style={{ color: 'var(--text-muted)' }}>⌘ K</span>
            <input 
              type="text" 
              placeholder="Spotlight Search... (Find reports, clients, agencies)" 
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14, width: '100%', maxWidth: 400 }}
              onChange={async (e) => {
                const q = e.target.value;
                if (q.length > 2) {
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/spotlight/search?q=${q}`);
                    if (res.ok) {
                      const data = await res.json();
                      console.log('Spotlight Results:', data);
                      // In a real app, render a dropdown with these results
                    }
                  } catch(e){}
                }
              }}
            />
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

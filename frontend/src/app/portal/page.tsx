'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, FileText, BarChart2, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { TrafficLineChart } from '@/components/widgets/TrafficLineChart';

export default function PortalDashboard() {
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('riq_client_token');
    const storedUser = localStorage.getItem('riq_client_user');
    
    if (!storedToken || !storedUser) {
      router.push('/portal/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    const fetchReports = async () => {
      try {
        // We'll just fetch all public reports for now, or build a specific endpoint
        // For MVP, if they have a token, we just pretend to fetch their specific ones.
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/reports`, {
          headers: { 'Authorization': `Bearer ${storedToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setReports(data.slice(0, 3)); // Show 3 recent reports
        }
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('riq_client_token');
    localStorage.removeItem('riq_client_user');
    router.push('/portal/login');
  };

  if (!user) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  const agencyTheme = user.agency?.primaryColor || '#8a2be2';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-1)' }}>
      {/* Top Navbar */}
      <nav style={{ background: 'var(--bg-0)', borderBottom: '1px solid var(--border)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: agencyTheme, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user.agency?.name?.charAt(0) || 'A'}
          </div>
          <span style={{ fontWeight: 600, fontSize: 16 }}>{user.agency?.name || 'Agency'} Client Portal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</div>
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>
        
        {/* Welcome Banner */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Live Performance Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Welcome back! Here's a live look at your marketing metrics.</p>
        </div>

        {/* Global KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 32 }}>
          {[
            { title: 'Total Website Traffic', val: '124,592', change: '+14%', color: agencyTheme },
            { title: 'Conversions (Goals)', val: '3,842', change: '+8%', color: '#10b981' },
            { title: 'Cost per Acquisition', val: '$42.50', change: '-5%', color: '#f59e0b' },
          ].map((kpi, i) => (
            <div key={i} className="card" style={{ padding: 24, borderTop: `4px solid ${kpi.color}` }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>{kpi.title}</div>
              <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>{kpi.val}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${kpi.color}15`, color: kpi.color, padding: '4px 8px', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
                <TrendingUp size={14} /> {kpi.change} vs last month
              </div>
            </div>
          ))}
        </div>

        {/* Live Chart */}
        <div className="card" style={{ padding: 32, marginBottom: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Traffic Trends (30 Days)</h3>
          <div style={{ height: 300 }}>
            <TrafficLineChart color={agencyTheme} />
          </div>
        </div>

        {/* Recent Reports */}
        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Your Official Reports</h3>
          </div>
          
          {loading ? (
            <div style={{ color: 'var(--text-muted)' }}>Loading reports...</div>
          ) : reports.length === 0 ? (
            <div style={{ color: 'var(--text-muted)' }}>No reports available yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {reports.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20, border: '1px solid var(--border)', borderRadius: 12, background: 'var(--bg-0)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${agencyTheme}15`, color: agencyTheme, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{r.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {r.period || 'May 2024'}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BarChart2 size={14} /> Comprehensive Summary</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/report/${r.publicSlug}`} target="_blank" className="btn btn-secondary">
                    View Report <ChevronRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

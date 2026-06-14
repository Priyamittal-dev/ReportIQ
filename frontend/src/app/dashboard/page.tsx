'use client';
import { useState, useEffect } from 'react';
import { Users, FileText, Send, Clock, ArrowUpRight, Zap, Plug, BarChart3, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardOverview() {
  const [stats, setStats] = useState({ clientCount: 0, reportCount: 0, sentCount: 0, hoursSaved: 0 });
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('riq_user');
    if (stored) setUser(JSON.parse(stored));

    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('riq_token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [statsRes, reportsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/stats`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, { headers })
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (reportsRes.ok) {
          const data = await reportsRes.json();
          setReports(data.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        padding: '32px 40px',
        background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.08) 50%, rgba(16,185,129,0.06) 100%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
              {greeting}, {user?.agencyName || 'there'}! 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Here's what's happening with your agency today.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/dashboard/clients" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={16} /> Add Client
            </Link>
            <Link href="/dashboard/reports/generate" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={16} /> Generate Report
            </Link>
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* Stats Grid */}
        <div className="card-grid card-grid-4" style={{ marginBottom: 40 }}>
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-label">Total Clients</div>
                <div className="stat-value">{stats.clientCount}</div>
              </div>
              <div className="stat-icon"><Users size={20} /></div>
            </div>
            <div>
              <span className="stat-change up"><ArrowUpRight size={14} /> +2 this month</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-label">Reports Gen.</div>
                <div className="stat-value">{stats.reportCount}</div>
              </div>
              <div className="stat-icon"><FileText size={20} /></div>
            </div>
            <div>
              <span className="stat-change up"><ArrowUpRight size={14} /> +12% vs last month</span>
            </div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-label">Auto Sent</div>
                <div className="stat-value">{stats.sentCount}</div>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(16,212,142,0.12)', color: 'var(--accent-green)' }}><Send size={20} /></div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>via scheduled delivery</div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-label">Hours Saved</div>
                <div className="stat-value">{stats.hoursSaved}h</div>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--accent-yellow)' }}><Clock size={20} /></div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Calculated at 2h per report</div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Recent Reports</h3>
            <Link href="/dashboard/reports" className="btn btn-secondary btn-sm">View all</Link>
          </div>
          
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
          ) : reports.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.03)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' }}>
                <FileText size={32} />
              </div>
              <h4 style={{ fontSize: 16, color: 'var(--text-primary)', marginBottom: 8 }}>No reports yet</h4>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>Connect an integration and generate your first report.</p>
              <Link href="/dashboard/reports/generate" className="btn btn-primary">Generate Report</Link>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report Title</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.title}</td>
                    <td>{r.client?.name || 'Unknown Client'}</td>
                    <td>
                      <span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {r.isPublic && r.publicSlug ? (
                        <a href={`/report/${r.publicSlug}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                          View
                        </a>
                      ) : (
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Internal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Global Client Leaderboard (Pillar 1) */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginTop: 40 }}>
          <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Client Performance Leaderboard (Top 3)</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>MoM Traffic Growth</th>
                <th>MoM Conv. Growth</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Acme Corp</td>
                <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}><ArrowUpRight size={14} style={{ verticalAlign: 'middle' }}/> 14.5%</td>
                <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}><ArrowUpRight size={14} style={{ verticalAlign: 'middle' }}/> 8.2%</td>
                <td><span className="badge badge-sent">Growing</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>TechFlow Software</td>
                <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}><ArrowUpRight size={14} style={{ verticalAlign: 'middle' }}/> 5.1%</td>
                <td style={{ color: 'var(--text-muted)' }}>0.0%</td>
                <td><span className="badge badge-ready">Stable</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Local Coffee Co</td>
                <td style={{ color: 'var(--accent-red)', fontWeight: 600 }}><ArrowUpRight size={14} style={{ verticalAlign: 'middle', transform: 'rotate(90deg)' }}/> -2.4%</td>
                <td style={{ color: 'var(--accent-red)', fontWeight: 600 }}><ArrowUpRight size={14} style={{ verticalAlign: 'middle', transform: 'rotate(90deg)' }}/> -4.1%</td>
                <td><span className="badge badge-failed">At Risk</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

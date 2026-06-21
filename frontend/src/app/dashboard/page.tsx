'use client';
import { useState, useEffect, useRef } from 'react';
import { Users, FileText, Send, Clock, ArrowUpRight, Zap, Plug, BarChart3, Plus, ArrowDownRight, Activity } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

// Count-up hook
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>();
  useEffect(() => {
    if (target === 0) return;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);
  return count;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState({ clientCount: 0, reportCount: 0, sentCount: 0, hoursSaved: 0 });
  const [reports, setReports] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const clientCount = useCountUp(stats.clientCount);
  const reportCount = useCountUp(stats.reportCount);
  const sentCount = useCountUp(stats.sentCount);
  const hoursSaved = useCountUp(stats.hoursSaved);

  useEffect(() => {
    const stored = localStorage.getItem('riq_user');
    if (stored) setUser(JSON.parse(stored));

    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('riq_token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [statsRes, reportsRes, logsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/stats`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/audit-logs`, { headers }),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (reportsRes.ok) {
          const data = await reportsRes.json();
          setReports(data.slice(0, 5));
        }
        if (logsRes.ok) {
          const logs = await logsRes.json();
          setAuditLogs((Array.isArray(logs) ? logs : logs?.data || []).slice(0, 8));
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
    <motion.div initial="hidden" animate="show" variants={containerVariants}>
      {/* Welcome Banner */}
      <motion.div variants={itemVariants} style={{
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
      </motion.div>

      <div className="page-body">
        {/* Stats Grid */}
        <motion.div variants={containerVariants} className="card-grid card-grid-4" style={{ marginBottom: 40 }}>
          
          <motion.div variants={itemVariants} className="stat-card" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-label">Total Clients</div>
                <div className="stat-value" style={{ fontVariantNumeric: 'tabular-nums' }}>{clientCount}</div>
              </div>
              <div className="stat-icon"><Users size={20} /></div>
            </div>
            <div>
              <span className="stat-change up"><ArrowUpRight size={14} /> +2 this month</span>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="stat-card" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-label">Reports Gen.</div>
                <div className="stat-value" style={{ fontVariantNumeric: 'tabular-nums' }}>{reportCount}</div>
              </div>
              <div className="stat-icon"><FileText size={20} /></div>
            </div>
            <div>
              <span className="stat-change up"><ArrowUpRight size={14} /> +12% vs last month</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="stat-card" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-label">Auto Sent</div>
                <div className="stat-value" style={{ fontVariantNumeric: 'tabular-nums' }}>{sentCount}</div>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(16,212,142,0.12)', color: 'var(--accent-green)' }}><Send size={20} /></div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>via scheduled delivery</div>
          </motion.div>

          <motion.div variants={itemVariants} className="stat-card" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-label">Hours Saved</div>
                <div className="stat-value" style={{ fontVariantNumeric: 'tabular-nums' }}>{hoursSaved}h</div>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--accent-yellow)' }}><Clock size={20} /></div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Calculated at 2h per report</div>
          </motion.div>

        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
          {/* Recent Reports */}
          <motion.div variants={itemVariants} className="card" style={{ padding: 0, overflow: 'hidden' }}>
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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.title}</td>
                      <td>{r.client?.name || 'Unknown Client'}</td>
                      <td>
                        <span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span>
                      </td>
                      <td>
                        <Link href={`/dashboard/reports/${r.id}`} className="btn btn-secondary btn-sm">
                          Edit
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>

          {/* Activity Feed */}
          <motion.div variants={itemVariants} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={16} color="var(--accent)" />
                <h3 style={{ fontSize: 16, fontWeight: 600 }}>Activity Feed</h3>
              </div>
              <Link href="/dashboard/audit-logs" className="btn btn-secondary btn-sm">View all</Link>
            </div>
            <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column' }}>
              {loading ? (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Loading activity...</div>
              ) : auditLogs.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No activity yet</div>
              ) : (
                auditLogs.map((log, i) => (
                  <div key={log.id || i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 20px', borderBottom: i < auditLogs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Activity size={14} color="var(--accent)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {log.action?.replace(/_/g, ' ')}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {log.user || 'System'} • {log.createdAt ? new Date(log.createdAt).toLocaleString() : ''}
                      </div>
                    </div>
                    <span className={`badge badge-${log.status === 'SUCCESS' ? 'sent' : 'failed'}`} style={{ flexShrink: 0, fontSize: 10 }}>
                      {log.status || 'INFO'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}

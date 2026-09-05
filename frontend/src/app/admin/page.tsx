'use client';
import { useState, useEffect } from 'react';
import {
  Users, CreditCard, Activity, RefreshCcw, TrendingUp,
  Server, Database, Cpu, Shield, Globe, BarChart3,
  FileText, AlertTriangle, CheckCircle, Clock, Zap,
  Eye, UserX, Mail, Settings, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>({});
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // System health simulation
  const [systemHealth] = useState({
    api: { status: 'healthy', latency: '23ms', uptime: '99.97%' },
    database: { status: 'healthy', connections: 12, maxConnections: 100 },
    redis: { status: 'degraded', memory: '45MB', hitRate: '94.2%' },
    ai: { status: 'warning', model: 'GPT-4o', tokensUsed: '847K/1M' },
  });

  // Activity feed
  const [activities] = useState([
    { type: 'signup', message: 'New agency registered', detail: 'Bright Digital Co.', time: '2m ago', icon: <Users size={14} /> },
    { type: 'report', message: 'Report generated', detail: 'Monthly SEO Report — Acme Corp', time: '15m ago', icon: <FileText size={14} /> },
    { type: 'integration', message: 'Google Ads connected', detail: 'by Growth Agency', time: '32m ago', icon: <Globe size={14} /> },
    { type: 'payment', message: 'Payment received', detail: '$79.00 — Pro Plan', time: '1h ago', icon: <CreditCard size={14} /> },
    { type: 'alert', message: 'API rate limit warning', detail: '85% of daily quota used', time: '2h ago', icon: <AlertTriangle size={14} /> },
    { type: 'signup', message: 'New agency registered', detail: 'Digital Spark Labs', time: '3h ago', icon: <Users size={14} /> },
  ]);

  const [users, setUsers] = useState<any[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('riq_token') : '';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`,
    };
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, { headers: getHeaders() });
      if (res.ok) setUsers(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const updateUser = async (id: string, updates: any) => {
    try {
      await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      fetchUsers();
      fetchData(); // Refresh overall stats
    } catch (e) {
      alert('Failed to update user');
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/config`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setMaintenanceMode(data.maintenanceMode);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleMaintenanceMode = async () => {
    const newValue = !maintenanceMode;
    setMaintenanceMode(newValue);
    try {
      await fetch(`${API_URL}/api/admin/config`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ maintenanceMode: newValue })
      });
    } catch (e) {
      alert('Failed to update config');
      setMaintenanceMode(!newValue); // revert
    }
  };

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, { headers: getHeaders() });
      const data = await res.json();
      setStats(data);
      if (data.recentUsers) setRecentUsers(data.recentUsers);
      await fetchConfig();
    } catch (e) {
      console.error('Failed to load admin stats', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
    fetchUsers();
  }, []);


  const kpiCards = [
    { title: 'Total Users', value: stats.stats?.[0]?.value || '—', change: '+12%', trend: 'up', icon: <Users size={22} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { title: 'Active Subscriptions', value: stats.stats?.[1]?.value || '—', change: '+8%', trend: 'up', icon: <CreditCard size={22} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { title: 'Monthly Revenue', value: stats.stats?.[2]?.value || '—', change: '+23%', trend: 'up', icon: <TrendingUp size={22} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { title: 'Reports Generated', value: '2,847', change: '+31%', trend: 'up', icon: <FileText size={22} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { title: 'API Requests (24h)', value: '142.5K', change: '-3%', trend: 'down', icon: <Activity size={22} />, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
    { title: 'Avg Response Time', value: '127ms', change: '-15%', trend: 'up', icon: <Zap size={22} />, color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
    { id: 'users', label: 'User Management', icon: <Users size={16} /> },
    { id: 'health', label: 'System Health', icon: <Server size={16} /> },
    { id: 'settings', label: 'Configuration', icon: <Settings size={16} /> },
  ];

  const statusColor = (s: string) => s === 'healthy' ? '#10b981' : s === 'degraded' ? '#f59e0b' : '#ef4444';
  const statusLabel = (s: string) => s === 'healthy' ? 'Operational' : s === 'degraded' ? 'Degraded' : 'Warning';

  return (
    <div style={{ padding: '32px 40px', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #ef4444, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} color="white" />
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>Admin Command Center</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginLeft: 52 }}>Monitor platform health, manage users, and configure system settings.</p>
        </div>
        <button onClick={fetchData} disabled={refreshing} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px' }}>
          <RefreshCcw size={16} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {kpiCards.map((card, i) => (
          <div key={i} className="card" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: card.bg, opacity: 0.5 }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, position: 'relative' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{card.title}</span>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                {card.icon}
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, position: 'relative' }}>{card.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: card.trend === 'up' ? '#10b981' : '#ef4444' }}>
              {card.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {card.change} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg-1)', borderRadius: 14, padding: 4, border: '1px solid var(--border)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{
              padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: activeTab === t.id ? 'var(--accent)' : 'transparent',
              color: activeTab === t.id ? 'white' : 'var(--text-secondary)',
              fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.2s',
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
          {/* Recent Users Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Signups</h3>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{recentUsers.length} users</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agency</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length > 0 ? recentUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 700 }}>
                          {(u.agencyName || u.email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{u.agencyName || 'Unnamed Agency'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: u.plan === 'AGENCY' ? 'rgba(139,92,246,0.15)' : 'rgba(59,130,246,0.15)', color: u.plan === 'AGENCY' ? '#8b5cf6' : '#3b82f6' }}>
                        {u.plan || 'STARTER'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Activity Feed */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Live Activity Feed</h3>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {activities.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 12px', borderRadius: 10, transition: 'background 0.2s' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: a.type === 'alert' ? 'rgba(239,68,68,0.1)' : a.type === 'payment' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)',
                    color: a.type === 'alert' ? '#ef4444' : a.type === 'payment' ? '#10b981' : '#3b82f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {a.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{a.message}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{a.detail}</div>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'health' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {Object.entries(systemHealth).map(([key, val]) => (
            <div key={key} className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {key === 'api' && <Server size={20} color={statusColor(val.status)} />}
                  {key === 'database' && <Database size={20} color={statusColor(val.status)} />}
                  {key === 'redis' && <Cpu size={20} color={statusColor(val.status)} />}
                  {key === 'ai' && <Zap size={20} color={statusColor(val.status)} />}
                  <span style={{ fontSize: 16, fontWeight: 700, textTransform: 'capitalize' }}>{key === 'ai' ? 'AI Engine' : key}</span>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: `${statusColor(val.status)}22`, color: statusColor(val.status),
                }}>
                  {statusLabel(val.status)}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Object.entries(val).filter(([k]) => k !== 'status').map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>User Management</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            <div style={{ padding: 20, background: 'rgba(59,130,246,0.05)', borderRadius: 12, border: '1px solid rgba(59,130,246,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#3b82f6' }}>{users.length}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Total Users</div>
            </div>
            <div style={{ padding: 20, background: 'rgba(16,185,129,0.05)', borderRadius: 12, border: '1px solid rgba(16,185,129,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#10b981' }}>{users.filter(u => u.plan === 'PRO' || u.plan === 'AGENCY').length}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Paid Plans</div>
            </div>
            <div style={{ padding: 20, background: 'rgba(245,158,11,0.05)', borderRadius: 12, border: '1px solid rgba(245,158,11,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#f59e0b' }}>{users.filter(u => !u.emailVerified).length}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Unverified</div>
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>User / Agency</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Plan</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clients / Reports</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{u.agencyName || 'Unnamed'}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {u.emailVerified ? 
                      <span style={{ color: '#10b981', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={14}/> Verified</span> : 
                      <span style={{ color: '#f59e0b', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={14}/> Pending</span>
                    }
                  </td>
                  <td style={{ padding: '16px' }}>
                    <select 
                      value={u.plan} 
                      onChange={e => updateUser(u.id, { plan: e.target.value })}
                      style={{ padding: '4px 8px', borderRadius: 6, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13 }}
                    >
                      <option value="STARTER">Starter</option>
                      <option value="PRO">Pro</option>
                      <option value="AGENCY">Agency</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
                    {u._count.clients} / {u._count.reports}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button className="btn btn-secondary btn-sm" style={{ marginRight: 8 }}>Login As</button>
                    <button onClick={() => updateUser(u.id, { emailVerified: true })} className="btn btn-secondary btn-sm">Verify</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>System Configuration</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>API Rate Limit (requests/minute)</label>
              <input type="number" defaultValue={100} style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-0)', color: 'var(--text-primary)', width: '100%', maxWidth: 300, fontSize: 14 }} />
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Maintenance Mode</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontSize: 14, color: 'var(--text-secondary)' }}>
                <input 
                  type="checkbox" 
                  checked={maintenanceMode}
                  onChange={toggleMaintenanceMode}
                  style={{ width: 20, height: 20, accentColor: 'var(--accent)' }} 
                />
                Enable maintenance mode (locks out non-admin users)
              </label>
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Default AI Model</label>
              <select defaultValue="gpt-4o" style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-0)', color: 'var(--text-primary)', width: '100%', maxWidth: 300, fontSize: 14 }}>
                <option value="gpt-4o">GPT-4o (Recommended)</option>
                <option value="gpt-4o-mini">GPT-4o Mini (Faster)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Budget)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Webhook Secret</label>
              <input type="password" defaultValue="whsec_xxxxx" style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-0)', color: 'var(--text-primary)', width: '100%', maxWidth: 400, fontSize: 14 }} />
            </div>
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-primary" style={{ padding: '12px 32px' }}>Save Configuration</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

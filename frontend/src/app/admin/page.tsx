'use client';
import { useState, useEffect } from 'react';
import { Users, CreditCard, Activity, Settings, RefreshCcw } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const [stats, setStats] = useState([
    { title: 'Total Users', value: '...', icon: <Users size={20} className="text-blue-500" /> },
    { title: 'Active Subscriptions', value: '...', icon: <CreditCard size={20} className="text-green-500" /> },
    { title: 'MRR', value: '...', icon: <Activity size={20} className="text-purple-500" /> },
  ]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`)
      .then(res => res.json())
      .then(data => {
        if (data.stats) {
          setStats([
            { title: 'Total Users', value: data.stats[0].value, icon: <Users size={20} color="#3b82f6" /> },
            { title: 'Active Subscriptions', value: data.stats[1].value, icon: <CreditCard size={20} color="#10b981" /> },
            { title: 'MRR', value: data.stats[2].value, icon: <Activity size={20} color="#8b5cf6" /> },
          ]);
        }
        if (data.recentUsers) setRecentUsers(data.recentUsers);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="admin-container" style={{ padding: '40px', background: 'var(--bg-0)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage platform operations and view analytics.</p>
        </div>
        <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCcw size={16} /> Refresh Data
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: '24px', background: 'var(--bg-1)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.title}</span>
              {stat.icon}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ background: 'var(--bg-1)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '20px' }}>
          <button onClick={() => setActiveTab('overview')} style={{ fontWeight: activeTab === 'overview' ? 'bold' : 'normal', color: activeTab === 'overview' ? 'var(--text-primary)' : 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Recent Users</button>
          <button onClick={() => setActiveTab('settings')} style={{ fontWeight: activeTab === 'settings' ? 'bold' : 'normal', color: activeTab === 'settings' ? 'var(--text-primary)' : 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>System Settings</button>
        </div>
        
        <div style={{ padding: '20px' }}>
          {activeTab === 'overview' ? (
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 0' }}>User</th>
                  <th>Agency</th>
                  <th>Plan</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length > 0 ? recentUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px' }}>{user.agencyName || 'N/A'}</td>
                    <td style={{ padding: '16px' }}>{user.email}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 12px', background: 'var(--accent)', color: 'white', borderRadius: '12px', fontSize: '12px' }}>
                        {user.plan}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px' }}>Rahul Garg</td>
                    <td style={{ padding: '16px' }}>gargr0109@gmail.com</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 12px', background: 'var(--accent)', color: 'white', borderRadius: '12px', fontSize: '12px' }}>
                        Admin
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>Active</td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ marginBottom: '8px' }}>Stripe Webhook Secret</h3>
                <input type="password" value="whsec_xxxxx" readOnly style={{ width: '100%', maxWidth: '400px', padding: '10px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <h3 style={{ marginBottom: '8px' }}>Maintenance Mode</h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" /> Enable maintenance mode (Locks out non-admins)
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

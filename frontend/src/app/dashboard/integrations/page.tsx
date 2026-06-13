'use client';
import { useState, useEffect } from 'react';
import { Plug, BarChart, MessageCircle, Globe, CheckCircle } from 'lucide-react';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const token = localStorage.getItem('riq_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/integrations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setIntegrations(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIntegrations();
  }, []);

  const availableIntegrations = [
    {
      id: 'ga4',
      name: 'Google Analytics 4',
      desc: 'Pull traffic, sessions, and conversions automatically.',
      icon: <BarChart size={24} color="#f59e0b" />,
      color: 'rgba(245,158,11,0.1)',
      connected: integrations.some(i => i.type === 'GOOGLE_ANALYTICS')
    },
    {
      id: 'gads',
      name: 'Google Ads',
      desc: 'Import ad spend, CPC, and campaign performance.',
      icon: <Globe size={24} color="#3b82f6" />,
      color: 'rgba(59,130,246,0.1)',
      connected: false
    },
    {
      id: 'meta',
      name: 'Meta Ads',
      desc: 'Sync Facebook & Instagram ad metrics.',
      icon: <MessageCircle size={24} color="#1877f2" />,
      color: 'rgba(24,119,242,0.1)',
      connected: false
    }
  ];

  const handleConnect = (id: string) => {
    if (id === 'ga4') {
      alert('In a real app, this would trigger the Google OAuth flow for Analytics access.');
    } else {
      alert('This integration is coming soon!');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Integrations</h1>
        <p className="page-subtitle">Connect your data sources to fully automate reporting.</p>
      </div>

      <div className="page-body">
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading integrations...</p>
        ) : (
          <div className="card-grid card-grid-3">
            {availableIntegrations.map(int => (
              <div key={int.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: int.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {int.icon}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>{int.name}</h3>
                </div>
                
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', flex: 1, marginBottom: 24 }}>
                  {int.desc}
                </p>

                {int.connected ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-green)', fontSize: 14, fontWeight: 500, padding: '10px 0' }}>
                    <CheckCircle size={18} /> Connected
                  </div>
                ) : (
                  <button onClick={() => handleConnect(int.id)} className="btn btn-secondary" style={{ width: '100%' }}>
                    Connect
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="card" style={{ marginTop: 40, borderStyle: 'dashed', background: 'transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <Plug size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Need another integration?</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>We're constantly adding new data sources. Let us know what you need.</p>
            </div>
            <button className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Request Source</button>
          </div>
        </div>
      </div>
    </div>
  );
}

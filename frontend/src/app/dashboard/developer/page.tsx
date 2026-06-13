'use client';
import { useState } from 'react';
import { Settings, Key, Link2, Copy, Plus } from 'lucide-react';

export default function DeveloperPage() {
  const [keys, setKeys] = useState([
    { id: '1', name: 'Production Dashboard Data', key: 'riq_live_*******************', lastUsed: '2 mins ago' },
  ]);
  const [webhooks, setWebhooks] = useState([
    { id: '1', url: 'https://hooks.zapier.com/hooks/catch/12345/', event: 'report.generated', status: 'Active' }
  ]);

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Settings color="var(--accent)" /> Developer Platform
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Manage API keys and Webhook subscriptions for custom integrations.</p>
      </header>

      {/* API Keys */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={20} /> API Keys
          </h2>
          <button className="btn btn-primary btn-sm"><Plus size={16} /> Generate Key</button>
        </div>
        
        <div className="card" style={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-2)' }}>
              <tr>
                <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Name</th>
                <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Key</th>
                <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Last Used</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500 }}>{k.name}</td>
                  <td style={{ padding: '16px', fontSize: '14px', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {k.key}
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Copy size={14} /></button>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>{k.lastUsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhooks */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link2 size={20} /> Webhooks
          </h2>
          <button className="btn btn-secondary btn-sm"><Plus size={16} /> Add Endpoint</button>
        </div>
        
        <div className="card" style={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-2)' }}>
              <tr>
                <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Endpoint URL</th>
                <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Event</th>
                <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {webhooks.map((w) => (
                <tr key={w.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontFamily: 'monospace' }}>{w.url}</td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>
                    <span style={{ padding: '4px 8px', background: 'var(--bg-2)', borderRadius: '4px', fontSize: '12px' }}>{w.event}</span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent-green)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-green)' }}></span>
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

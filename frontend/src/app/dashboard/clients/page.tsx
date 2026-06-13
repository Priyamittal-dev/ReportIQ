'use client';
import { useState, useEffect } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('riq_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setClients(await res.json());
      } catch (err) {
        console.error('Failed to load clients', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="page-subtitle">Manage your agency's clients and their configurations.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Add Client
        </button>
      </div>

      <div className="page-body">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading clients...</div>
          ) : clients.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <h4 style={{ fontSize: 16, color: 'var(--text-primary)', marginBottom: 8 }}>No clients yet</h4>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Add your first client to start generating reports.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Email</th>
                  <th>Website</th>
                  <th>Timezone</th>
                  <th>Reports</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.website ? <a href={c.website} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Link</a> : '-'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{c.timezone}</td>
                    <td>{c._count?.reports || 0} generated</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-secondary btn-sm" style={{ padding: '6px' }}>
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

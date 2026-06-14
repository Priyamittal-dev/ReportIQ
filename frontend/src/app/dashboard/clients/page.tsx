'use client';
import { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, X, Loader2 } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', website: '', timezone: 'UTC', notes: '' });

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

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('riq_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add client');
      
      // Close modal and refresh list
      setIsModalOpen(false);
      setForm({ name: '', email: '', website: '', timezone: 'UTC', notes: '' });
      fetchClients();
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="page-subtitle">Manage your agency's clients and their configurations.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
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

      {/* Add Client Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 500, padding: 32, position: 'relative' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', right: 24, top: 24, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
            
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Add New Client</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Enter client details to start tracking their performance.</p>
            
            <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Client Name *</label>
                <input type="text" className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Acme Corp" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Contact Email *</label>
                <input type="email" className="form-input" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="client@acmecorp.com" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Website URL</label>
                <input type="url" className="form-input" value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="https://acmecorp.com" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Timezone</label>
                <select className="form-input" value={form.timezone} onChange={e => setForm({...form, timezone: e.target.value})}>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT/BST)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-input" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Monthly budget, specific goals..." style={{ minHeight: 80, resize: 'vertical' }} />
              </div>

              {error && <div style={{ color: 'var(--accent-red)', fontSize: 14 }}>{error}</div>}

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

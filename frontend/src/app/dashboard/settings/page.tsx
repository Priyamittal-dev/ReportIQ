'use client';
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    agencyName: '',
    primaryColor: '#8a2be2',
    accentColor: '#00e5ff'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('riq_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setForm({
        agencyName: parsed.agencyName || '',
        primaryColor: parsed.primaryColor || '#8a2be2',
        accentColor: parsed.accentColor || '#00e5ff'
      });
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('riq_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        localStorage.setItem('riq_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert('Settings saved successfully!');
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your agency profile and white-label branding.</p>
      </div>

      <div className="page-body">
        <div style={{ maxWidth: 600 }}>
          <form onSubmit={handleSave} className="card">
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              Agency Branding
            </h3>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Agency Name</label>
              <input className="form-input" type="text" value={form.agencyName} 
                onChange={e => setForm(p => ({ ...p, agencyName: e.target.value }))} required />
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>This name will appear on all client reports.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
              <div className="form-group">
                <label className="form-label">Primary Color</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <input type="color" value={form.primaryColor} 
                    onChange={e => setForm(p => ({ ...p, primaryColor: e.target.value }))}
                    style={{ width: 40, height: 40, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }} />
                  <input className="form-input" type="text" value={form.primaryColor} 
                    onChange={e => setForm(p => ({ ...p, primaryColor: e.target.value }))} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Accent Color</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <input type="color" value={form.accentColor} 
                    onChange={e => setForm(p => ({ ...p, accentColor: e.target.value }))}
                    style={{ width: 40, height: 40, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }} />
                  <input className="form-input" type="text" value={form.accentColor} 
                    onChange={e => setForm(p => ({ ...p, accentColor: e.target.value }))} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>

          {/* Advanced White Labeling */}
          <div className="card" style={{ marginTop: 24, border: '1px solid var(--border-accent)', background: 'linear-gradient(145deg, rgba(138,43,226,0.05), transparent)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--accent)' }}>Advanced White-Labeling</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>Configure custom domains and email senders for full brand control.</p>
            
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Custom Domain (CNAME)</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <input className="form-input" type="text" placeholder="reports.youragency.com" />
                <button className="btn btn-secondary">Verify</button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Point a CNAME record to <code>cname.reportiq.app</code></p>
            </div>

            <div className="form-group">
              <label className="form-label">Custom Email Sender</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <input className="form-input" type="email" placeholder="reports@youragency.com" />
                <button className="btn btn-secondary">Connect</button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Requires DNS verification via Resend/Sendgrid.</p>
            </div>
          </div>

          <div className="card" style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: 'var(--accent-red)' }}>Danger Zone</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>Permanently delete your agency account and all client data.</p>
            <button type="button" className="btn" style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--accent-red)', border: '1px solid rgba(244,63,94,0.2)' }}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

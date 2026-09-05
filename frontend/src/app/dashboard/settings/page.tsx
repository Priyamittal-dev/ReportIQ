'use client';
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { apiFetch } from '@/lib/api';

export default function SettingsPage() {
  const { t, language, setLanguage } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    agencyName: '',
    primaryColor: '#8a2be2',
    accentColor: '#00e5ff',
    language: 'en',
    customDomain: '',
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
        accentColor: parsed.accentColor || '#00e5ff',
        language: parsed.language || 'en',
        customDomain: parsed.customDomain || '',
      });
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        localStorage.setItem('riq_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Update language provider if changed
        if (form.language !== language) {
          setLanguage(form.language);
        }
        
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
        <h1 className="page-title">{t('settings.title')}</h1>
        <p className="page-subtitle">{t('settings.subtitle')}</p>
      </div>

      <div className="page-body">
        <div style={{ maxWidth: 600 }}>
          <form onSubmit={handleSave} className="card">
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              {t('settings.branding')}
            </h3>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">{t('settings.agency_name')}</label>
              <input className="form-input" type="text" value={form.agencyName} 
                onChange={e => setForm(p => ({ ...p, agencyName: e.target.value }))} required />
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('settings.agency_name_desc')}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">{t('settings.primary_color')}</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <input type="color" value={form.primaryColor} 
                    onChange={e => setForm(p => ({ ...p, primaryColor: e.target.value }))}
                    style={{ width: 40, height: 40, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }} />
                  <input className="form-input" type="text" value={form.primaryColor} 
                    onChange={e => setForm(p => ({ ...p, primaryColor: e.target.value }))} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('settings.accent_color')}</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <input type="color" value={form.accentColor} 
                    onChange={e => setForm(p => ({ ...p, accentColor: e.target.value }))}
                    style={{ width: 40, height: 40, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }} />
                  <input className="form-input" type="text" value={form.accentColor} 
                    onChange={e => setForm(p => ({ ...p, accentColor: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 32 }}>
              <label className="form-label">{t('settings.language')}</label>
              <select className="form-select" value={form.language} onChange={e => setForm(p => ({ ...p, language: e.target.value }))}>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('settings.language_desc')}</p>
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? t('settings.saving') : t('settings.save')}
            </button>
          </form>

          {/* Advanced White Labeling */}
          <div className="card" style={{ marginTop: 24, border: '1px solid var(--border-accent)', background: 'linear-gradient(145deg, rgba(138,43,226,0.05), transparent)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--accent)' }}>Advanced White-Labeling</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>Configure custom domains and email senders for full brand control.</p>
            
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Custom Domain (CNAME)</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <input className="form-input" type="text" placeholder="reports.youragency.com" 
                  value={form.customDomain}
                  onChange={e => setForm(p => ({ ...p, customDomain: e.target.value }))}
                />
                <button type="button" className="btn btn-secondary" onClick={() => alert('Domain verification requires DNS propagation. Check back in 15 minutes.')}>Verify</button>
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

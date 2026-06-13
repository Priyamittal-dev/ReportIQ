'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GenerateReportPage() {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  const [form, setForm] = useState({
    clientId: '',
    period: 'May 1–31, 2024',
    sessions: '3500',
    pageViews: '12000',
    conversions: '150',
    conversionRate: '4.2',
    revenue: '5400',
    bounceRate: '45.5',
    previousSessions: '3000',
    previousConversions: '120',
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('riq_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setClients(data);
          if (data.length > 0) {
            setForm(prev => ({ ...prev, clientId: data[0].id }));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId) return alert('Please select a client');
    
    setGenerating(true);
    try {
      const token = localStorage.getItem('riq_token');
      
      const metricsData = {
        period: form.period,
        sessions: parseInt(form.sessions, 10),
        pageViews: parseInt(form.pageViews, 10),
        conversions: parseInt(form.conversions, 10),
        conversionRate: parseFloat(form.conversionRate),
        revenue: parseInt(form.revenue, 10),
        bounceRate: parseFloat(form.bounceRate),
        previousSessions: parseInt(form.previousSessions, 10),
        previousConversions: parseInt(form.previousConversions, 10),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          clientId: form.clientId,
          metricsData,
        }),
      });
      
      if (!res.ok) throw new Error('Generation failed');
      const report = await res.json();
      
      router.push(`/dashboard/reports`);
      // Or open report in new tab: window.open(`/report/${report.publicSlug}`, '_blank');
    } catch (err: any) {
      alert(err.message);
      setGenerating(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <Link href="/dashboard/reports" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none', marginBottom: 24, transition: 'color var(--t-fast)' }}>
          <ArrowLeft size={14} /> Back to reports
        </Link>
        <h1 className="page-title">Generate Report</h1>
        <p className="page-subtitle">Input data to let AI generate a performance summary.</p>
      </div>

      <div className="page-body" style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          
          <form onSubmit={handleGenerate} className="card" style={{ flex: 1, maxWidth: 600 }}>
            {loading ? (
              <p>Loading clients...</p>
            ) : clients.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <p>You need to add a client first.</p>
                <Link href="/dashboard/clients" className="btn btn-secondary" style={{ marginTop: 12 }}>Add Client</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                <div className="form-group">
                  <label className="form-label">Client</label>
                  <select className="form-select" value={form.clientId} onChange={(e) => setForm(p => ({ ...p, clientId: e.target.value }))}>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Reporting Period</label>
                  <input className="form-input" type="text" value={form.period} onChange={(e) => setForm(p => ({ ...p, period: e.target.value }))} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Sessions</label>
                    <input className="form-input" type="number" value={form.sessions} onChange={(e) => setForm(p => ({ ...p, sessions: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Previous Sessions</label>
                    <input className="form-input" type="number" value={form.previousSessions} onChange={(e) => setForm(p => ({ ...p, previousSessions: e.target.value }))} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Conversions</label>
                    <input className="form-input" type="number" value={form.conversions} onChange={(e) => setForm(p => ({ ...p, conversions: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Previous Conversions</label>
                    <input className="form-input" type="number" value={form.previousConversions} onChange={(e) => setForm(p => ({ ...p, previousConversions: e.target.value }))} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Conv. Rate (%)</label>
                    <input className="form-input" type="number" step="0.1" value={form.conversionRate} onChange={(e) => setForm(p => ({ ...p, conversionRate: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Revenue ($)</label>
                    <input className="form-input" type="number" value={form.revenue} onChange={(e) => setForm(p => ({ ...p, revenue: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bounce Rate (%)</label>
                    <input className="form-input" type="number" step="0.1" value={form.bounceRate} onChange={(e) => setForm(p => ({ ...p, bounceRate: e.target.value }))} />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, marginTop: 8 }}>
                  <button type="submit" className="btn btn-gradient" style={{ width: '100%', padding: '14px' }} disabled={generating}>
                    <Sparkles size={18} />
                    {generating ? 'Generating AI Report...' : 'Generate AI Report'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="card" style={{ flex: 1, background: 'linear-gradient(145deg, rgba(138,43,226,0.05), rgba(0,229,255,0.02))', border: '1px solid var(--border-accent)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--accent)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} /> How this works
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
              ReportIQ takes your raw metrics and uses GPT-4o to write a professional executive summary for your client.
            </p>
            <ul style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 16 }}>
              <li>Calculates growth trends (e.g. month-over-month)</li>
              <li>Highlights key wins in organic traffic or conversions</li>
              <li>Generates 3 actionable insights for the next period</li>
              <li>Creates a branded public link for the client</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

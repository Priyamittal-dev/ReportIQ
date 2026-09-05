'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, ExternalLink, Sparkles, Plus, Trash2, Smartphone, Presentation, Send, Swords } from 'lucide-react';
import ClientPortalPreview from '@/components/ClientPortalPreview';
import SlideDeckModal from '@/components/SlideDeckModal';
import MultiChannelDispatchModal from '@/components/MultiChannelDispatchModal';
import CompetitorBenchmarkWidget from '@/components/CompetitorBenchmarkWidget';
import { apiFetch } from '@/lib/api';

export default function InternalReportDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [saving, setSaving] = useState(false);
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [slideDeckOpen, setSlideDeckOpen] = useState(false);
  const [dispatchOpen, setDispatchOpen] = useState(false);

  // Editable content state
  const [aiSummary, setAiSummary] = useState('');
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [actionPlan, setActionPlan] = useState<{ plan: string, actionItems: any[] }>({ plan: '', actionItems: [] });

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const res = await apiFetch(`/api/reports/${id}`);
      if (res.ok) {
        const data = await res.json();
        setReport(data);
        setStatus(data.status);
        
        // Initialize editable states
        setAiSummary(data.aiSummary || '');
        
        try {
          const parsedInsights = typeof data.aiInsights === 'string' ? JSON.parse(data.aiInsights) : data.aiInsights;
          setAiInsights(Array.isArray(parsedInsights) ? parsedInsights : []);
        } catch { setAiInsights([]); }
        
        try {
          let parsedPlan = typeof data.aiActionPlan === 'string' ? JSON.parse(data.aiActionPlan) : data.aiActionPlan;
          if (!parsedPlan) parsedPlan = { plan: '', actionItems: [] };
          setActionPlan(parsedPlan);
        } catch { setActionPlan({ plan: '', actionItems: [] }); }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        status,
        newComment,
        aiSummary,
        aiInsights: JSON.stringify(aiInsights),
        aiActionPlan: JSON.stringify(actionPlan)
      };

      const res = await apiFetch(`/api/reports/${id}/workflow`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setNewComment('');
        fetchReport(); // Reload to get updated comments
      } else {
        alert('Failed to update report workflow.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>Loading report details...</div>;
  if (!report) return <div style={{ padding: 60, textAlign: 'center' }}>Report not found.</div>;

  let comments = [];
  try { comments = report.internalNotes ? JSON.parse(report.internalNotes) : []; } catch (e) { comments = []; }

  const isEditable = status === 'DRAFT' || status === 'PENDING_REVIEW';

  return (
    <div>
      <ClientPortalPreview 
        open={simulatorOpen} 
        onClose={() => setSimulatorOpen(false)} 
        reportSlug={report?.publicSlug} 
      />
      <SlideDeckModal
        open={slideDeckOpen}
        onClose={() => setSlideDeckOpen(false)}
        reportId={report?.id}
        reportTitle={report?.title}
        clientName={report?.client?.name}
      />
      <MultiChannelDispatchModal
        open={dispatchOpen}
        onClose={() => setDispatchOpen(false)}
        reportId={report?.id}
        reportTitle={report?.title}
        clientName={report?.client?.name}
        clientEmail={report?.client?.email}
      />
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-0)', position: 'sticky', top: 64, zIndex: 40, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
        <div>
          <Link href="/dashboard/reports" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, marginBottom: 12 }}>
            <ArrowLeft size={14} /> Back to Reports
          </Link>
          <h1 className="page-title">{report.title}</h1>
          <p className="page-subtitle">Client: {report.client?.name}</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => setSlideDeckOpen(true)} className="btn btn-secondary" style={{ background: 'rgba(138, 43, 226, 0.12)', border: '1px solid rgba(138, 43, 226, 0.3)', color: '#c084fc' }}>
            <Presentation size={16} /> Slide Deck Mode
          </button>
          <button onClick={() => setDispatchOpen(true)} className="btn btn-secondary" style={{ background: 'rgba(0, 229, 255, 0.12)', border: '1px solid rgba(0, 229, 255, 0.3)', color: '#22d3ee' }}>
            <Send size={16} /> Dispatch Alerts
          </button>
          {report.isPublic && (
            <button onClick={() => setSimulatorOpen(true)} className="btn btn-secondary">
              <Smartphone size={16} /> Preview Client View
            </button>
          )}
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            {saving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="page-body" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 32 }}>
        
        {/* Left Col: Editor & Benchmarking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <CompetitorBenchmarkWidget clientName={report?.client?.name} clientWebsite={report?.client?.website} />
          
          <div className="card" style={{ border: '1px solid var(--border-accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: 'var(--accent)' }}>
              <Sparkles size={18} />
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Interactive Report Editor</h3>
            </div>
            
            {!isEditable && (
              <div style={{ padding: 12, background: 'rgba(245,158,11,0.1)', color: 'var(--accent-yellow)', borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
                This report is currently <strong>{status}</strong>. To edit content, change status back to DRAFT or PENDING_REVIEW.
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Executive Summary</label>
              <textarea 
                className="form-input" 
                rows={5} 
                value={aiSummary} 
                onChange={e => setAiSummary(e.target.value)}
                disabled={!isEditable}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Key Insights
                {isEditable && (
                  <button type="button" onClick={() => setAiInsights([...aiInsights, ''])} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                    <Plus size={12} /> Add Insight
                  </button>
                )}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {aiInsights.map((insight, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8 }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={insight} 
                      disabled={!isEditable}
                      onChange={e => {
                        const newInsights = [...aiInsights];
                        newInsights[i] = e.target.value;
                        setAiInsights(newInsights);
                      }} 
                    />
                    {isEditable && (
                      <button type="button" onClick={() => setAiInsights(aiInsights.filter((_, idx) => idx !== i))} className="btn btn-secondary" style={{ padding: 8 }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Action Plan Overview</label>
              <textarea 
                className="form-input" 
                rows={2} 
                value={actionPlan.plan} 
                disabled={!isEditable}
                onChange={e => setActionPlan({ ...actionPlan, plan: e.target.value })}
                style={{ marginBottom: 16 }}
              />
              
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Action Items
                {isEditable && (
                  <button type="button" onClick={() => setActionPlan({ ...actionPlan, actionItems: [...actionPlan.actionItems, { task: '', priority: 'Medium' }] })} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                    <Plus size={12} /> Add Task
                  </button>
                )}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {actionPlan.actionItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Task description"
                        value={item.task} 
                        disabled={!isEditable}
                        onChange={e => {
                          const items = [...actionPlan.actionItems];
                          items[i].task = e.target.value;
                          setActionPlan({ ...actionPlan, actionItems: items });
                        }} 
                      />
                      <select 
                        className="form-select" 
                        value={item.priority} 
                        disabled={!isEditable}
                        onChange={e => {
                          const items = [...actionPlan.actionItems];
                          items[i].priority = e.target.value;
                          setActionPlan({ ...actionPlan, actionItems: items });
                        }}
                      >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </select>
                    </div>
                    {isEditable && (
                      <button type="button" onClick={() => {
                        const items = actionPlan.actionItems.filter((_, idx) => idx !== i);
                        setActionPlan({ ...actionPlan, actionItems: items });
                      }} className="btn btn-secondary" style={{ padding: 8 }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Col: Workflow & Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Created</span>
                <span style={{ color: 'var(--text-primary)', fontSize: 14 }}>{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Period</span>
                <span style={{ color: 'var(--text-primary)', fontSize: 14 }}>{report.period || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Client ID</span>
                <span style={{ color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-mono)' }}>{report.clientId.slice(0,8)}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Approval Workflow</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'SENT'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  style={{
                    padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 600, transition: 'var(--t-fast)', textAlign: 'left',
                    background: status === s ? 'rgba(138,43,226,0.1)' : 'var(--bg-1)',
                    border: `1px solid ${status === s ? 'var(--accent)' : 'var(--border)'}`,
                    color: status === s ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
            
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Team Comments</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, maxHeight: 300, overflowY: 'auto' }}>
              {comments.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No internal comments yet.</div>
              ) : (
                comments.map((c: any, i: number) => (
                  <div key={i} style={{ padding: 12, borderRadius: 8, background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-2)' }}>{c.author}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(c.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{c.text}</div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Add comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="form-input"
                style={{ flex: 1, fontSize: 13, padding: '8px 12px' }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

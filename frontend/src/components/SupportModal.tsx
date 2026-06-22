'use client';
import { useState } from 'react';
import { X, Send, LifeBuoy, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SupportModal({ open, onClose }: Props) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onClose();
        setTimeout(() => {
          setStatus('idle');
          setSubject('');
          setMessage('');
          setPriority('Normal');
        }, 300);
      }, 2000);
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999999,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20
    }}>
      <div style={{
        background: 'var(--bg-1)', border: '1px solid var(--border)',
        borderRadius: 24, width: '100%', maxWidth: 500, overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        animation: 'modal-pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(138,43,226,0.1), transparent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LifeBuoy size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Contact Support</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>We typically reply within 2 hours.</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-2)', border: 'none', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        {status === 'success' ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Ticket Submitted!</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Our support team has received your request and will be in touch shortly via email.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: 24 }}>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Subject</label>
              <input type="text" className="form-input" placeholder="What do you need help with?" required value={subject} onChange={e => setSubject(e.target.value)} disabled={status === 'sending'} />
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Priority Level</label>
              <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)} disabled={status === 'sending'}>
                <option value="Low">Low - General Question</option>
                <option value="Normal">Normal - Standard Issue</option>
                <option value="High">High - Blocking my work</option>
                <option value="Critical">Critical - Platform Outage</option>
              </select>
              {priority === 'Critical' && (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: '#ef4444', fontSize: 12, marginTop: 6, padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 6 }}>
                  <AlertCircle size={14} /> Critical issues page engineers immediately.
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Message details</label>
              <textarea className="form-input" placeholder="Please describe the issue in detail..." rows={5} required value={message} onChange={e => setMessage(e.target.value)} disabled={status === 'sending'} style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" disabled={status === 'sending'}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={status === 'sending' || !subject || !message}>
                {status === 'sending' ? 'Sending...' : <><Send size={16} /> Submit Ticket</>}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @keyframes modal-pop {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

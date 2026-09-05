'use client';
import { useState } from 'react';
import { CheckCircle2, AlertCircle, ShieldCheck, DollarSign, Send, ThumbsUp, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface ClientApprovalCardProps {
  reportId: string;
  initialStatus?: string;
  clientName?: string;
  recommendedBudget?: number;
}

export default function ClientApprovalCard({
  reportId,
  initialStatus = 'READY',
  clientName = 'Valued Client',
  recommendedBudget = 4500
}: ClientApprovalCardProps) {
  const [status, setStatus] = useState(initialStatus);
  const [signatoryName, setSignatoryName] = useState('');
  const [budgetApproved, setBudgetApproved] = useState(recommendedBudget);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  const isApproved = status === 'APPROVED';

  const handleDecision = async (decision: 'APPROVED' | 'REVISIONS_REQUESTED') => {
    if (!signatoryName.trim()) {
      alert('Please enter your name as digital signature.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports/${reportId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          signatoryName: signatoryName.trim(),
          budgetApproved,
          notes
        })
      });
      if (res.ok) {
        setStatus(decision);
        setSubmittedData({
          signatoryName,
          budgetApproved,
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (isApproved || submittedData) {
    return (
      <div
        style={{
          marginTop: 32,
          padding: 28,
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(0, 229, 255, 0.08) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
              Strategy & Budget Approved
            </h4>
            <p style={{ fontSize: 13, color: '#cbd5e1' }}>
              Signed by <strong>{submittedData?.signatoryName || signatoryName || clientName}</strong> on {submittedData?.timestamp || 'Today'} • Budget: <strong>${(submittedData?.budgetApproved || budgetApproved).toLocaleString()}</strong>
            </p>
          </div>
        </div>
        <div style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: 12, fontWeight: 700 }}>
          ✓ Verified Client Sign-Off
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: 36,
        padding: 32,
        borderRadius: 16,
        background: 'var(--bg-1, #161b22)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ padding: 8, borderRadius: 10, background: 'rgba(138, 43, 226, 0.15)', color: '#c084fc' }}>
          <ThumbsUp size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
            Client Strategy & Budget Sign-Off
          </h3>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>
            Confirm next month's tactical execution plan and advertising spend allocation.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, color: '#cbd5e1', fontWeight: 500, marginBottom: 6 }}>
            Authorized Signatory Name *
          </label>
          <input
            type="text"
            value={signatoryName}
            onChange={(e) => setSignatoryName(e.target.value)}
            placeholder="e.g. Alex Morgan, VP Marketing"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              fontSize: 14,
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, color: '#cbd5e1', fontWeight: 500, marginBottom: 6 }}>
            Proposed Monthly Ad Budget ($ USD)
          </label>
          <input
            type="number"
            value={budgetApproved}
            onChange={(e) => setBudgetApproved(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              fontSize: 14,
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 13, color: '#cbd5e1', fontWeight: 500, marginBottom: 6 }}>
          Optional Feedback or Strategy Notes
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any specific goals or feedback for the agency team..."
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff',
            fontSize: 13,
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14 }}>
        <button
          onClick={() => handleDecision('REVISIONS_REQUESTED')}
          disabled={submitting}
          style={{
            padding: '10px 18px',
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#cbd5e1',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Request Revisions
        </button>
        <button
          onClick={() => handleDecision('APPROVED')}
          disabled={submitting}
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            background: 'linear-gradient(135deg, #10b981 0%, #00e5ff 100%)',
            border: 'none',
            color: '#052e16',
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <CheckCircle2 size={16} />
          {submitting ? 'Signing...' : 'Approve Strategy & Budget'}
        </button>
      </div>
    </div>
  );
}

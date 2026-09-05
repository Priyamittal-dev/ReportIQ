'use client';
import { useState } from 'react';
import { X, Send, MessageSquare, Mail, Hash, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface MultiChannelDispatchModalProps {
  open: boolean;
  onClose: () => void;
  reportId: string;
  reportTitle?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}

export default function MultiChannelDispatchModal({
  open,
  onClose,
  reportId,
  reportTitle,
  clientName,
  clientEmail,
  clientPhone
}: MultiChannelDispatchModalProps) {
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'slack' | 'email'>('whatsapp');
  const [target, setTarget] = useState(clientPhone || '+14155238886');
  const [customMessage, setCustomMessage] = useState(
    `Hi ${clientName || 'there'}, your latest performance report "${reportTitle || 'Monthly Report'}" is ready! Review the executive summary & approve next month's strategy here.`
  );
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!open) return null;

  const handleChannelChange = (ch: 'whatsapp' | 'slack' | 'email') => {
    setSelectedChannel(ch);
    setResult(null);
    if (ch === 'whatsapp') setTarget(clientPhone || '+14155238886');
    else if (ch === 'slack') setTarget('https://hooks.slack.com/services/T00/B00/X00');
    else if (ch === 'email') setTarget(clientEmail || 'client@example.com');
  };

  const handleDispatch = async () => {
    setSending(true);
    setResult(null);
    try {
      const res = await apiFetch(`/api/reports/${reportId}/dispatch`, {
        method: 'POST',
        body: JSON.stringify({
          channel: selectedChannel,
          target,
          message: customMessage
        })
      });
      const data = await res.json();
      if (res.ok) {
        setResult({
          success: true,
          message: data.message || `Successfully dispatched via ${selectedChannel.toUpperCase()}!`
        });
      } else {
        setResult({
          success: false,
          message: data.message || 'Dispatch failed. Check credentials.'
        });
      }
    } catch (err: any) {
      setResult({ success: false, message: err.message || 'Network error during dispatch.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 7, 15, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 580,
          background: 'var(--bg-1, #161b22)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 16,
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
              Multi-Channel Report Dispatch
            </h3>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>
              Deliver report alerts directly to your client via their favorite channels.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          {/* Channel Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            <button
              onClick={() => handleChannelChange('whatsapp')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 14px',
                borderRadius: 10,
                cursor: 'pointer',
                background: selectedChannel === 'whatsapp' ? 'rgba(37, 211, 102, 0.15)' : 'rgba(255,255,255,0.03)',
                border: selectedChannel === 'whatsapp' ? '1px solid #25d366' : '1px solid rgba(255,255,255,0.08)',
                color: selectedChannel === 'whatsapp' ? '#25d366' : '#cbd5e1',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              <MessageSquare size={16} /> WhatsApp
            </button>

            <button
              onClick={() => handleChannelChange('slack')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 14px',
                borderRadius: 10,
                cursor: 'pointer',
                background: selectedChannel === 'slack' ? 'rgba(224, 30, 90, 0.15)' : 'rgba(255,255,255,0.03)',
                border: selectedChannel === 'slack' ? '1px solid #e01e5a' : '1px solid rgba(255,255,255,0.08)',
                color: selectedChannel === 'slack' ? '#f43f5e' : '#cbd5e1',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              <Hash size={16} /> Slack Webhook
            </button>

            <button
              onClick={() => handleChannelChange('email')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 14px',
                borderRadius: 10,
                cursor: 'pointer',
                background: selectedChannel === 'email' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                border: selectedChannel === 'email' ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
                color: selectedChannel === 'email' ? '#60a5fa' : '#cbd5e1',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              <Mail size={16} /> Direct Email
            </button>
          </div>

          {/* Target Input */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>
              {selectedChannel === 'whatsapp' ? 'Recipient WhatsApp Phone Number' : selectedChannel === 'slack' ? 'Incoming Slack Webhook URL' : 'Recipient Email Address'}
            </label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={selectedChannel === 'whatsapp' ? '+14155238886' : selectedChannel === 'slack' ? 'https://hooks.slack.com/services/...' : 'client@company.com'}
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

          {/* Message Input */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>
              Notification Message Preview
            </label>
            <textarea
              rows={3}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                fontSize: 13,
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Status Message */}
          {result && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                background: result.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: result.success ? '1px solid #10b981' : '1px solid #ef4444',
                color: result.success ? '#34d399' : '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              {result.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {result.message}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDispatch}
              disabled={sending}
              style={{
                padding: '10px 22px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #8a2be2 0%, #00e5ff 100%)',
                border: 'none',
                color: '#fff',
                cursor: sending ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                opacity: sending ? 0.6 : 1,
              }}
            >
              <Send size={16} />
              {sending ? 'Dispatching...' : `Send via ${selectedChannel.toUpperCase()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

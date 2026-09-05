'use client';
import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FreeTrialModal({ isOpen, onClose }: FreeTrialModalProps) {
  const [subdomain, setSubdomain] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isProvisioned, setIsProvisioned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleStartTrial = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsProvisioned(true);
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10, 15, 26, 0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        background: 'var(--bg-1)', border: '1px solid var(--border)',
        borderRadius: 24, width: '100%', maxWidth: 500, padding: 32,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 20, background: 'var(--bg-2)',
            border: 'none', borderRadius: '50%', width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)', cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {!isProvisioned ? (
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 999, background: 'rgba(16,212,142,0.1)',
              color: 'var(--accent-green)', fontSize: 12, fontWeight: 700, marginBottom: 8
            }}>
              <Zap size={14} />
              <span>14-Day Free Enterprise Trial • No Card Required</span>
            </div>

            <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
              Create Your ReportIQ Cloud Workspace
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
              Instantly deploy your team's workspace for automated time tracking and reporting.
            </p>

            <form onSubmit={handleStartTrial} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Work Email</label>
                <input
                  type="email"
                  required
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="rachel@company.com"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Workspace Subdomain</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                  <input
                    type="text"
                    required
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="myteam"
                    style={{ flex: 1, padding: '10px 14px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-mono)', outline: 'none' }}
                  />
                  <span style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.05)', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    .reportiq.io
                  </span>
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--text-primary)' }}>
                  <ShieldCheck size={14} color="var(--accent-green)" />
                  <span>Enterprise Guarantee</span>
                </div>
                <span>• 100% Free for 14 days with full features unlocked.</span>
                <span>• No payment details required. Instant activation.</span>
              </div>

              <button type="submit" disabled={isLoading} className="btn btn-gradient" style={{ width: '100%', justifyContent: 'center' }}>
                <span>{isLoading ? 'Spinning up workspace...' : 'Launch Free Workspace Instantly'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,212,142,0.15)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Workspace Deployed!</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
              Your 14-day instance is live and ready for your team:
            </p>

            <div style={{ padding: 14, borderRadius: 12, background: 'var(--bg-2)', border: '1px solid var(--border)', fontSize: 14, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
              https://{subdomain || 'myteam'}.reportiq.io
            </div>

            <Link href="/dashboard" onClick={onClose} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Go to ReportIQ Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

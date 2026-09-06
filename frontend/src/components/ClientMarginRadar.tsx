'use client';
import React, { useState } from 'react';
import { DollarSign, AlertCircle, ArrowUpRight, TrendingUp, Sparkles, Clock, Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ClientMarginRadar() {
  const [clients, setClients] = useState([
    { id: 1, name: 'Apex Digital Apparel', retainer: 5000, hours: 22, cost: 1540, margin: 69.2, status: 'HEALTHY' },
    { id: 2, name: 'PureLife Wellness', retainer: 4200, hours: 19, cost: 1330, margin: 68.3, status: 'HEALTHY' },
    { id: 3, name: 'Velocity Motors', retainer: 3500, hours: 41, cost: 2870, margin: 18.0, status: 'WARNING' },
    { id: 4, name: 'Urban Sound Co.', retainer: 2500, hours: 39, cost: 2730, margin: -9.2, status: 'CRITICAL' },
  ]);

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [extraHours, setExtraHours] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);

  const totalRetainer = clients.reduce((acc, c) => acc + c.retainer, 0);
  const totalCost = clients.reduce((acc, c) => acc + c.cost, 0);
  const agencyNetMargin = Math.round(((totalRetainer - totalCost) / totalRetainer) * 100);

  const handleLogHours = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !extraHours) return;
    const added = parseFloat(extraHours);
    if (isNaN(added)) return;

    setClients(prev => prev.map(c => {
      if (c.id === selectedClient.id) {
        const newHours = c.hours + added;
        const newCost = newHours * 70;
        const newMargin = Math.round(((c.retainer - newCost) / c.retainer) * 100 * 10) / 10;
        return {
          ...c,
          hours: newHours,
          cost: newCost,
          margin: newMargin,
          status: newMargin > 40 ? 'HEALTHY' : newMargin > 10 ? 'WARNING' : 'CRITICAL'
        };
      }
      return c;
    }));

    setShowLogModal(false);
    setExtraHours('');
  };

  return (
    <div className="card" style={{ padding: 24, background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
              <DollarSign size={16} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Client Profitability & Retainer Margin Radar
            </h3>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            Real-time margin calculation comparing monthly client retainers against team hours ($70/hr labor cost).
          </p>
        </div>

        {/* Agency Overall Margin Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg-2)', padding: '10px 16px', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Blended Agency Margin</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: agencyNetMargin > 40 ? 'var(--accent-green)' : 'var(--accent-yellow)' }}>
              {agencyNetMargin}%
            </div>
          </div>
          <div style={{ height: 24, width: 1, background: 'var(--border)' }} />
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Net Agency Profit</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
              ${(totalRetainer - totalCost).toLocaleString()}/mo
            </div>
          </div>
        </div>
      </div>

      {/* Client List Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {clients.map(c => (
          <div 
            key={c.id} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '14px 18px', 
              borderRadius: 12, 
              background: 'var(--bg-2)', 
              border: `1px solid ${c.status === 'CRITICAL' ? 'rgba(244,63,94,0.3)' : 'var(--border)'}`,
              flexWrap: 'wrap',
              gap: 12
            }}
          >
            <div style={{ minWidth: 200 }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Retainer: <strong style={{ color: 'var(--text-secondary)' }}>${c.retainer.toLocaleString()}/mo</strong> � {c.hours} hrs logged (${c.cost.toLocaleString()})
              </div>
            </div>

            {/* Profit Margin Bar */}
            <div style={{ flex: 1, minWidth: 160, maxWidth: 280 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                <span style={{ color: 'var(--text-muted)' }}>Net Margin</span>
                <span style={{ fontWeight: 700, color: c.margin > 40 ? 'var(--accent-green)' : c.margin > 10 ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>
                  {c.margin > 0 ? `+${c.margin}%` : `${c.margin}%`}
                </span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${Math.max(5, Math.min(100, c.margin))}%`, 
                  background: c.margin > 40 ? 'var(--accent-green)' : c.margin > 10 ? 'var(--accent-yellow)' : 'var(--accent-red)' 
                }} />
              </div>
            </div>

            {/* Status Badge & Action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                padding: '4px 8px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                background: c.status === 'HEALTHY' ? 'rgba(16,212,142,0.1)' : c.status === 'WARNING' ? 'rgba(245,158,11,0.1)' : 'rgba(244,63,94,0.1)',
                color: c.status === 'HEALTHY' ? 'var(--accent-green)' : c.status === 'WARNING' ? 'var(--accent-yellow)' : 'var(--accent-red)'
              }}>
                {c.status === 'HEALTHY' ? '? HEALTHY' : c.status === 'WARNING' ? '? OVER-SERVICED' : '? BLEEDING CASH'}
              </span>

              <button 
                onClick={() => { setSelectedClient(c); setShowLogModal(true); }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: 11, padding: '4px 10px', height: 'auto' }}
              >
                + Log Hours
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Log Hours Modal */}
      {showLogModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'var(--bg-1)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 400,
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
              Log Billable Hours for {selectedClient?.name}
            </h4>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 16px' }}>
              Adjust logged account manager / media buyer hours to recalculate agency net margin.
            </p>

            <form onSubmit={handleLogHours} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Additional Hours Spent:
                </label>
                <input 
                  type="number" 
                  step="0.5" 
                  placeholder="e.g. 5" 
                  value={extraHours} 
                  onChange={e => setExtraHours(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--bg-2)',
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowLogModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Update Margin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

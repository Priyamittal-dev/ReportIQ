'use client';
import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  MessageSquare, 
  Copy, 
  ExternalLink,
  Users,
  PieChart
} from 'lucide-react';

interface TimeTrackingShowcaseProps {
  onOpenDemo: () => void;
  onOpenTrial: () => void;
}

export default function TimeTrackingShowcase({ onOpenDemo, onOpenTrial }: TimeTrackingShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'profitability' | 'ai_narrative' | 'pacing' | 'dispatch'>('profitability');
  const [copied, setCopied] = useState(false);

  const sampleClients = [
    { name: 'Apex Digital Apparel', retainer: 5000, hours: 24, cost: 1680, margin: 66.4, status: 'HIGH_MARGIN', roas: 4.8 },
    { name: 'Velocity Motors', retainer: 3500, hours: 42, cost: 2940, margin: 16.0, status: 'AT_RISK', roas: 2.9 },
    { name: 'PureLife Wellness', retainer: 4200, hours: 20, cost: 1400, margin: 66.7, status: 'HIGH_MARGIN', roas: 5.2 },
    { name: 'Urban Sound Co.', retainer: 2500, hours: 38, cost: 2660, margin: -6.4, status: 'UNPROFITABLE', roas: 3.1 },
  ];

  const handleCopy = () => {
    navigator.clipboard?.writeText(
      "?? Monthly Performance Executive Summary for Apex Digital Apparel:\n\n� Blended ROAS scaled to 4.8x (+28% MoM) driven by Creative Angle #3 on Meta Ads.\n� Cost Per Acquisition (CPA) decreased from $34.20 to $26.80.\n� Google Search captured 412 high-intent conversions with 18.4% conversion rate.\n\nRecommended Sprint Action: Scale Top-Funnel Advantage+ budget by +$1,200/week while CPA remains under $28."
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="section section-center" id="profitability-intelligence" style={{ background: 'var(--bg-0)', position: 'relative' }}>
      <span className="section-tag" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent)', border: '1px solid rgba(139,92,246,0.2)' }}>
        Agency Competitive Edge
      </span>
      <h2 className="section-title">Client Profitability & Retainer Margin Intelligence</h2>
      <p className="section-subtitle">
        Stop losing money on "vampire accounts." Track true client net margins, automate executive AI narratives, and protect ad budgets in real time.
      </p>

      {/* Interactive Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', margin: '32px 0 24px' }}>
        {[
          { id: 'profitability', label: 'Client Margin & Retainer ROI', icon: <DollarSign size={16} /> },
          { id: 'ai_narrative', label: 'GPT-4 Executive Narratives', icon: <Sparkles size={16} /> },
          { id: 'pacing', label: 'Ad Budget Pacing Radar', icon: <AlertTriangle size={16} /> },
          { id: 'dispatch', label: 'WhatsApp & Slack Dispatch', icon: <Send size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: 8, fontSize: 13, padding: '10px 18px' }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Interactive Showcase Card */}
      <div className="card" style={{ maxWidth: 1020, margin: '0 auto', padding: 36, textAlign: 'left', background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
        
        {/* TAB 1: CLIENT PROFITABILITY & RETAINER ROI */}
        {activeTab === 'profitability' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Agency Profitability Engine
                </span>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 8px' }}>
                  Real-Time Net Margin per Client Account
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, maxWidth: 640 }}>
                  Compare monthly retainers against team hours logged ($70/hr labor cost). Automatically flag over-serviced clients before they erode agency EBITDA.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ padding: '10px 16px', borderRadius: 12, background: 'rgba(16,212,142,0.1)', border: '1px solid rgba(16,212,142,0.2)', textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Average Agency Margin</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-green)' }}>54.2%</div>
                </div>
              </div>
            </div>

            {/* Live Client Margin Table */}
            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '14px 16px' }}>Client / Account</th>
                    <th style={{ padding: '14px 16px' }}>Retainer Fee</th>
                    <th style={{ padding: '14px 16px' }}>Team Hours Spent</th>
                    <th style={{ padding: '14px 16px' }}>Labor Cost ($70/h)</th>
                    <th style={{ padding: '14px 16px' }}>Net Profit Margin</th>
                    <th style={{ padding: '14px 16px' }}>Health Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleClients.map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontWeight: 700 }}>${c.retainer.toLocaleString()}/mo</td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{c.hours} hrs</td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>${c.cost.toLocaleString()}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ 
                          fontWeight: 800, 
                          color: c.margin > 40 ? 'var(--accent-green)' : c.margin > 0 ? 'var(--accent-yellow)' : 'var(--accent-red)' 
                        }}>
                          {c.margin > 0 ? `+${c.margin}%` : `${c.margin}%`}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          background: c.status === 'HIGH_MARGIN' ? 'rgba(16,212,142,0.1)' : c.status === 'AT_RISK' ? 'rgba(245,158,11,0.1)' : 'rgba(244,63,94,0.1)',
                          color: c.status === 'HIGH_MARGIN' ? 'var(--accent-green)' : c.status === 'AT_RISK' ? 'var(--accent-yellow)' : 'var(--accent-red)',
                          border: `1px solid ${c.status === 'HIGH_MARGIN' ? 'rgba(16,212,142,0.2)' : c.status === 'AT_RISK' ? 'rgba(245,158,11,0.2)' : 'rgba(244,63,94,0.2)'}`
                        }}>
                          {c.status === 'HIGH_MARGIN' ? '? HEALTHY' : c.status === 'AT_RISK' ? '? OVER-SERVICED' : '? BLEEDING CASH'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-2)', padding: '14px 20px', borderRadius: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                ?? <strong>Agency Insight:</strong> Urban Sound Co. consumed 38 hours on a $2.5k retainer. Suggest converting to a $4,500/mo tier or scoping deliverables.
              </span>
              <button onClick={onOpenTrial} className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                Adjust Retainer Rates
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: AI EXECUTIVE NARRATIVES */}
        {activeTab === 'ai_narrative' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28, alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Automated Client Communication
              </span>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 12px' }}>
                Zero-Prompt Executive Summaries
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Account managers spend 5+ hours every month manually writing client commentary. ReportIQ analyzes ad shifts, identifies key growth drivers, and generates human-grade executive briefs.
              </p>

              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--text-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                  <span>Explains "Why" metrics moved, not just numbers</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                  <span>Provides actionable sprint recommendations for clients</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                  <span>Fully editable with 1-click client copy or export</span>
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <button onClick={onOpenDemo} className="btn btn-primary" style={{ gap: 8 }}>
                  <Sparkles size={16} /> Try Live AI Generator
                </button>
              </div>
            </div>

            {/* Live AI Preview Box */}
            <div style={{ background: '#0a0f1d', borderRadius: 16, padding: 24, border: '1px solid rgba(139,92,246,0.3)', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={16} color="#8a2be2" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>ReportIQ AI Narrative Generator</span>
                </div>
                <button 
                  onClick={handleCopy}
                  style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#cbd5e1', padding: '6px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Copy size={12} />
                  <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                </button>
              </div>

              <div style={{ padding: '16px 0', fontSize: 13, lineHeight: 1.7, color: '#cbd5e1' }}>
                <p style={{ margin: '0 0 10px' }}><strong style={{ color: '#fff' }}>Executive Briefing:</strong> Blended ROAS scaled to <strong style={{ color: '#10d48e' }}>4.8x (+28% MoM)</strong> driven by creative angle #3 on Meta Ads.</p>
                <p style={{ margin: '0 0 10px' }}>� <strong>CPA Efficiency:</strong> Cost Per Acquisition dropped from $34.20 to $26.80.</p>
                <p style={{ margin: '0 0 10px' }}>� <strong>Google Ads Search:</strong> High-intent conversion rate hit 18.4%.</p>
                <div style={{ background: 'rgba(139,92,246,0.15)', borderLeft: '3px solid #8a2be2', padding: '8px 12px', borderRadius: '0 8px 8px 0', marginTop: 12 }}>
                  <span style={{ fontSize: 12, color: '#e0e7ff', fontWeight: 600 }}>
                    Recommended Next Action: Reallocate +$1,200 to Meta Advantage+ shopping while CPA stays below $28.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AD BUDGET PACING RADAR */}
        {activeTab === 'pacing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Proactive Budget Pacing & Anomaly Radar</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>Hourly health monitoring across Meta, Google, and TikTok Ads.</p>
              </div>
              <span style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-green)' }} /> 4 Connectors Synced
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div style={{ padding: 20, borderRadius: 14, background: 'var(--bg-2)', border: '1px solid rgba(244,63,94,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldAlert size={16} /> PACING ALERT (OVERSPEND)
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Velocity Motors</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Google Ads Daily Cap Exceeded (+42%)</div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '6px 0 12px' }}>
                  Campaign "PMax_USA_Q3" spent $1,280 against planned daily target of $900.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-danger btn-sm" style={{ fontSize: 11 }}>Auto-Throttle Spend</button>
                  <button className="btn btn-secondary btn-sm" style={{ fontSize: 11 }}>Dismiss</button>
                </div>
              </div>

              <div style={{ padding: 20, borderRadius: 14, background: 'var(--bg-2)', border: '1px solid rgba(16,212,142,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <TrendingUp size={16} /> ROAS BREAKTHROUGH
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Apex Digital Apparel</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Meta ROAS Hit 5.4x (Threshold: 3.5x)</div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '6px 0 12px' }}>
                  Reels Retargeting creative surged in conversion velocity over the last 48 hours.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary btn-sm" style={{ fontSize: 11 }}>Increase Budget +20%</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WHATSAPP & SLACK DISPATCH */}
        {activeTab === 'dispatch' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Frictionless Client Reporting
              </span>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 12px' }}>
                Direct WhatsApp & Slack KPI Snapshots
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Busy CEOs rarely log into client portals or read 20-page PDFs. Deliver automated 3-bullet KPI summaries straight to their WhatsApp or company Slack channel every Monday morning.
              </p>
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--text-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                  <span>Twilio WhatsApp Business API integration</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                  <span>Slack Webhook & Channel Bot Support</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                  <span>1-click link to full white-labeled interactive portal</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Mock Message Bubble */}
            <div style={{ background: '#0b141a', borderRadius: 18, padding: 20, color: '#e9edef', border: '1px solid #202c33', maxWidth: 360, margin: '0 auto', boxShadow: '0 12px 30px rgba(0,0,0,0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #202c33', paddingBottom: 12, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>
                  RQ
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>ReportIQ Agency Bot</div>
                  <div style={{ fontSize: 10, color: '#8696a0' }}>Verified WhatsApp Business</div>
                </div>
              </div>

              <div style={{ background: '#005c4b', padding: '12px 14px', borderRadius: '12px 12px 2px 12px', fontSize: 13, lineHeight: 1.5, color: '#e9edef' }}>
                <p style={{ margin: '0 0 6px', fontWeight: 700 }}>?? Weekly Pulse for Sarah (CEO, Apex Apparel):</p>
                <p style={{ margin: '0 0 4px' }}>� Total Ad Spend: <strong>$8,420</strong></p>
                <p style={{ margin: '0 0 4px' }}>� Revenue Generated: <strong>$40,416 (4.8x ROAS)</strong></p>
                <p style={{ margin: '0 0 8px' }}>� Top Performer: <strong>Meta Advantage+ Campaign</strong></p>
                <div style={{ fontSize: 11, background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: 6 }}>
                  ?? <a href="#" style={{ color: '#53bdeb', textDecoration: 'none' }}>View live dashboard & creatives &rarr;</a>
                </div>
                <div style={{ textAlign: 'right', fontSize: 10, color: '#8696a0', marginTop: 4 }}>09:00 AM ??</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

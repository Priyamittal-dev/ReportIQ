'use client';
import React, { useState, useEffect } from 'react';
import { Play, Pause, Clock, Activity, BarChart3, FileSpreadsheet, DollarSign, CheckCircle2 } from 'lucide-react';

interface TimeTrackingShowcaseProps {
  onOpenDemo: () => void;
  onOpenTrial: () => void;
}

export default function TimeTrackingShowcase({ onOpenDemo, onOpenTrial }: TimeTrackingShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'tracking' | 'insights' | 'timesheets' | 'billing'>('tracking');
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [seconds, setSeconds] = useState(14520); // 4h 2m

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section className="section section-center" id="time-tracking" style={{ background: 'var(--bg-0)' }}>
      <span className="section-tag" style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--accent-2)', border: '1px solid rgba(0,229,255,0.2)' }}>
        Workforce Intelligence
      </span>
      <h2 className="section-title">Automated Employee Time Tracking & Activity</h2>
      <p className="section-subtitle">
        Everything you need to track work hours, measure real-time focus, and automate client payroll.
      </p>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', margin: '32px 0 24px' }}>
        {[
          { id: 'tracking', label: 'Automatic Time Tracking', icon: <Clock size={16} /> },
          { id: 'insights', label: 'Productivity & Focus Scoring', icon: <Activity size={16} /> },
          { id: 'timesheets', label: 'Timesheets & Payroll', icon: <FileSpreadsheet size={16} /> },
          { id: 'billing', label: 'Project Budget & Billables', icon: <DollarSign size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: 8, fontSize: 13 }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Card */}
      <div className="card" style={{ maxWidth: 960, margin: '0 auto', padding: 36, textAlign: 'left' }}>
        {activeTab === 'tracking' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Desktop & Background Monitoring
              </span>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 12px' }}>
                Precision Clock-In & Idle Detection
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                ReportIQ detects keyboard and mouse movements to pause time automatically during idle periods. Guarantees 100% accurate client billable hours without manual timer start/stops.
              </p>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--text-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                  <span>Silent tracking or interactive desktop agent client</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                  <span>Smart idle prompts for offline client meetings</span>
                </div>
              </div>
            </div>

            {/* Live Timer Widget */}
            <div style={{ background: '#0a0f1d', borderRadius: 16, padding: 24, color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-mono)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12, fontSize: 11 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: isTimerRunning ? '#10d48e' : '#f59e0b' }} />
                  <span style={{ color: '#94a3b8' }}>ReportIQ Agent v2.4</span>
                </div>
                <span style={{ color: isTimerRunning ? '#10d48e' : '#f59e0b' }}>
                  {isTimerRunning ? 'STATUS: ACTIVE' : 'STATUS: PAUSED'}
                </span>
              </div>

              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: '0.05em' }}>{formatTimer(seconds)}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>Task: Backend API Redis Optimization</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  style={{
                    padding: '8px 20px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    background: isTimerRunning ? '#f59e0b' : '#10d48e', color: '#0a0f1d', border: 'none', display: 'flex', alignItems: 'center', gap: 6
                  }}
                >
                  {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isTimerRunning ? 'Pause Timer' : 'Resume Timer'}</span>
                </button>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 18, paddingTop: 12, fontSize: 11, color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                <span>Active App: VS Code</span>
                <span style={{ color: '#10d48e', fontWeight: 700 }}>98% Productive</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Productivity Scores & App Categorization
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
              ReportIQ classifies applications and web URLs into Productive, Communication, and Unproductive categories.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                  <span>Core Work (VS Code, GitHub, Figma, Jira)</span>
                  <span style={{ color: 'var(--accent-green)' }}>82% (6h 34m)</span>
                </div>
                <div style={{ height: 8, width: '100%', background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: '82%', height: '100%', background: 'var(--accent-green)' }} />
                </div>
              </div>

              <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                  <span>Communication (Slack, Google Meet, Zoom)</span>
                  <span style={{ color: 'var(--accent-2)' }}>14% (1h 08m)</span>
                </div>
                <div style={{ height: 8, width: '100%', background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: '14%', height: '100%', background: 'var(--accent-2)' }} />
                </div>
              </div>

              <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                  <span>Unproductive / Social Browsing</span>
                  <span style={{ color: 'var(--accent-red)' }}>4% (18m)</span>
                </div>
                <div style={{ height: 8, width: '100%', background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: '4%', height: '100%', background: 'var(--accent-red)' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timesheets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Weekly Timesheet Approvals</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>1-click approvals for manager sign-off and payroll export.</p>
              </div>
              <button onClick={onOpenTrial} className="btn btn-secondary btn-sm">Export Timesheet CSV</button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 0' }}>Developer</th>
                    <th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th>
                    <th>Total</th><th>Status</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-primary)' }}>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 0', fontWeight: 700 }}>Rahul Garg (Lead Architect)</td>
                    <td style={{ textAlign: 'center' }}>8.2h</td><td style={{ textAlign: 'center' }}>8.5h</td><td style={{ textAlign: 'center' }}>8.0h</td><td style={{ textAlign: 'center' }}>8.4h</td><td style={{ textAlign: 'center' }}>7.8h</td>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent)' }}>40.9h</td>
                    <td style={{ textAlign: 'center' }}><span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(16,212,142,0.1)', color: 'var(--accent-green)', fontSize: 11, fontWeight: 700 }}>APPROVED</span></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 0', fontWeight: 700 }}>Frontend Engineer #1</td>
                    <td style={{ textAlign: 'center' }}>7.8h</td><td style={{ textAlign: 'center' }}>8.0h</td><td style={{ textAlign: 'center' }}>8.1h</td><td style={{ textAlign: 'center' }}>7.9h</td><td style={{ textAlign: 'center' }}>8.0h</td>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent)' }}>39.8h</td>
                    <td style={{ textAlign: 'center' }}><span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(16,212,142,0.1)', color: 'var(--accent-green)', fontSize: 11, fontWeight: 700 }}>APPROVED</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ padding: 24, borderRadius: 16, background: 'var(--bg-2)', textAlign: 'center', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Billable Hours Ratio</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0' }}>94.8%</div>
              <div style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 700 }}>164.5 hrs tracked</div>
            </div>
            <div style={{ padding: 24, borderRadius: 16, background: 'var(--bg-2)', textAlign: 'center', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Project Budget Burn</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent)', margin: '8px 0' }}>68.2%</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>On track for sprint delivery</div>
            </div>
            <div style={{ padding: 24, borderRadius: 16, background: 'var(--bg-2)', textAlign: 'center', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Invoicing Ready</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-green)', margin: '8px 0' }}>$8,225</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>QuickBooks ready</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

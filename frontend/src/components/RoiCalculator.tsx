'use client';
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface RoiCalculatorProps {
  onOpenDemo: () => void;
}

export default function RoiCalculator({ onOpenDemo }: RoiCalculatorProps) {
  const [teamSize, setTeamSize] = useState(25);
  const [hourlySalary, setHourlySalary] = useState(35);

  const hoursSavedPerWeekPerEmp = 4.5;
  const weeklyHoursSaved = teamSize * hoursSavedPerWeekPerEmp;
  const annualSavings = Math.round(weeklyHoursSaved * hourlySalary * 48); // 48 working weeks

  return (
    <section className="section section-center" style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <span className="section-tag">ROI Calculator</span>
      <h2 className="section-title">Calculate Your Organization's Payroll Recovery</h2>
      <p className="section-subtitle">
        See how many billable hours and lost payroll dollars ReportIQ recovers for your team every year.
      </p>

      <div className="card" style={{ maxWidth: 880, margin: '36px auto 0', padding: 36, textAlign: 'left' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 36, alignItems: 'center' }}>
          
          {/* Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                <span>Team Members:</span>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{teamSize} Employees</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                <span>5</span><span>125</span><span>250+</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                <span>Average Hourly Cost:</span>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>${hourlySalary} / hr</span>
              </div>
              <input
                type="range"
                min="15"
                max="150"
                step="5"
                value={hourlySalary}
                onChange={(e) => setHourlySalary(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                <span>$15/hr</span><span>$80/hr</span><span>$150/hr</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 18, borderRadius: 14, background: 'var(--bg-2)', textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Weekly Hours Saved</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                  {Math.round(weeklyHoursSaved)} hrs
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>~4.5 hrs / employee</div>
              </div>

              <div style={{ padding: 18, borderRadius: 14, background: 'var(--bg-2)', textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Productivity Boost</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-green)', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                  +22%
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Verified average</div>
              </div>
            </div>

            <div style={{ padding: 24, borderRadius: 16, background: 'var(--gradient-brand)', color: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
                Annual Payroll Recovery
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, fontFamily: 'var(--font-mono)', margin: '6px 0' }}>
                ${new Intl.NumberFormat('en-US').format(annualSavings)} / year
              </div>
              <button
                onClick={onOpenDemo}
                style={{
                  marginTop: 12, padding: '10px 20px', borderRadius: 10, background: '#fff',
                  color: 'var(--text-primary)', border: 'none', fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6
                }}
              >
                <span>Book Demo to Lock In These Savings</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

'use client';
import React from 'react';

export default function IntegrationsBar() {
  const tools = [
    { name: 'Jira', category: 'Sprint Tracking' },
    { name: 'ClickUp', category: 'Task Sync' },
    { name: 'Slack', category: 'Live Status Alerts' },
    { name: 'GitHub', category: 'PR & Commit Links' },
    { name: 'Google Analytics', category: 'GA4 Data Ingestion' },
    { name: 'QuickBooks', category: 'Automated Payroll' },
  ];

  return (
    <div style={{ padding: '32px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-1)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
          Works seamlessly with your existing workflow tools
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 18 }}>
          {tools.map((t, idx) => (
            <div key={idx} style={{ padding: '8px 16px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <strong style={{ color: 'var(--text-primary)' }}>{t.name}</strong>
              <span style={{ color: 'var(--text-muted)' }}>• {t.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

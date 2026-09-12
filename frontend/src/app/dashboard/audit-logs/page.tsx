'use client';
import { useState, useEffect } from 'react';
import { FileText, Search, Filter } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/api/audit-logs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          console.error('Expected array of logs, got:', data);
          setLogs([]);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText color="var(--accent)" /> Audit Logs
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Track system events and user activity for security and compliance.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary">
            <Filter size={16} /> Filter
          </button>
        </div>
      </header>

      <div className="card" style={{ padding: '16px', marginBottom: '24px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={20} color="var(--text-secondary)" />
        <input 
          type="text" 
          placeholder="Search logs by user, action, or IP address..." 
          style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, color: 'var(--text-primary)' }}
        />
      </div>

      <div className="card" style={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-2)' }}>
            <tr>
              <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Timestamp</th>
              <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Action</th>
              <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>User</th>
              <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Details</th>
              <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px', fontSize: '14px' }}>{new Date(log.timestamp).toLocaleString()}</td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500 }}>{log.action}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{log.user}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {log.ip ? `IP: ${log.ip}` : log.target ? `Target: ${log.target}` : log.plan ? `Plan: ${log.plan}` : '-'}
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, background: log.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: log.status === 'SUCCESS' ? '#10b981' : '#ef4444' }}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

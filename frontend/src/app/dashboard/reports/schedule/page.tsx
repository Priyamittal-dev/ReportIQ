'use client';
import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Settings } from 'lucide-react';

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock schedules for now
    setTimeout(() => {
      setSchedules([
        { id: 1, clientName: 'Acme Corp', frequency: 'WEEKLY', nextRun: 'Next Monday at 9:00 AM', status: 'ACTIVE' },
        { id: 2, clientName: 'TechFlow', frequency: 'MONTHLY', nextRun: '1st of month at 8:00 AM', status: 'ACTIVE' }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Automated Schedules</h1>
          <p className="page-subtitle">Set up recurring reports so you never have to send them manually again.</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Add schedule dialog would open here.')}>
          <Plus size={16} /> New Schedule
        </button>
      </div>

      <div className="page-body">
        <div className="card">
          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading schedules...</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Frequency</th>
                  <th>Next Run Time</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.clientName}</td>
                    <td>
                      <span className="badge badge-sent">{s.frequency}</span>
                    </td>
                    <td style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={14} color="var(--text-muted)" /> {s.nextRun}
                    </td>
                    <td>
                      <span style={{ color: 'var(--accent-green)', fontWeight: 500, fontSize: 13 }}>{s.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-secondary btn-sm"><Settings size={14} /> Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

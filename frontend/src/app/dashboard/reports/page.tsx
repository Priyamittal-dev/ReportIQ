'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, ExternalLink } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('riq_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setReports(await res.json());
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">View past reports and generate new ones.</p>
        </div>
        <Link href="/dashboard/reports/generate" className="btn btn-primary">
          <Plus size={16} /> Generate Report
        </Link>
      </div>

      <div className="page-body">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading reports...</div>
          ) : reports.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.03)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' }}>
                <FileText size={32} />
              </div>
              <h4 style={{ fontSize: 16, color: 'var(--text-primary)', marginBottom: 8 }}>No reports generated</h4>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>You haven't generated any reports yet.</p>
              <Link href="/dashboard/reports/generate" className="btn btn-primary">Generate your first report</Link>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report Title</th>
                  <th>Client</th>
                  <th>Period</th>
                  <th>Status</th>
                  <th>Generated Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.title}</td>
                    <td>{r.client?.name || 'Unknown'}</td>
                    <td>{r.period || 'N/A'}</td>
                    <td>
                      <span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {r.isPublic && r.publicSlug && (
                        <a href={`/report/${r.publicSlug}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                          <ExternalLink size={14} /> View Public
                        </a>
                      )}
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

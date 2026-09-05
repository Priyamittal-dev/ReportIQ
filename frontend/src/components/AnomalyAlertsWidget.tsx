'use client';
import { useEffect, useState } from 'react';
import { AlertCircle, TrendingDown, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface AnomalyAlert {
  id: string;
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metricName: string;
  metricValue: number;
  isRead: boolean;
  createdAt: string;
}

export default function AnomalyAlertsWidget() {
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await apiFetch('/api/users/me/alerts');
        if (res.ok) {
          const data = await res.json();
          setAlerts(data);
        }
      } catch (err) {
        console.error('Failed to fetch alerts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'var(--accent-red)';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return 'var(--accent-yellow)';
      case 'LOW': return 'var(--accent-green)';
      default: return 'var(--text-secondary)';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'rgba(244,63,94,0.1)';
      case 'HIGH': return 'rgba(249,115,22,0.1)';
      case 'MEDIUM': return 'rgba(245,158,11,0.1)';
      case 'LOW': return 'rgba(16,212,142,0.1)';
      default: return 'var(--bg-2)';
    }
  };

  if (loading) return <div className="card" style={{ padding: 24, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading AI Radar...</div>;

  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ position: 'relative', display: 'flex', width: 12, height: 12 }}>
              <span style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: 'var(--accent-red)', opacity: 0.75 }}></span>
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: 12, width: 12, background: 'var(--accent-red)' }}></span>
            </span>
            AI Anomaly Radar
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Live tracking of significant metric shifts.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, overflowY: 'auto' }}>
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <CheckCircle size={32} style={{ margin: '0 auto 12px' }} />
            <p>No anomalies detected right now.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} style={{ display: 'flex', gap: 16, padding: 16, borderRadius: 12, background: 'var(--bg-0)', border: '1px solid var(--border)' }}>
              <div style={{ 
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: getSeverityBg(alert.severity), color: getSeverityColor(alert.severity),
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {alert.severity === 'CRITICAL' ? <AlertCircle size={20} /> : alert.severity === 'HIGH' ? <AlertTriangle size={20} /> : alert.metricValue > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{alert.title}</span>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: getSeverityBg(alert.severity), color: getSeverityColor(alert.severity), fontWeight: 700, letterSpacing: '0.05em' }}>
                    {alert.severity}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{alert.message}</p>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                  {new Date(alert.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

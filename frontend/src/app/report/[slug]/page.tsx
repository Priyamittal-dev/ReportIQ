'use client';
import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Sparkles, Download, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { TrafficLineChart } from '@/components/widgets/TrafficLineChart';
import { SourceBarChart } from '@/components/widgets/SourceBarChart';

// Same default as the builder
const DEFAULT_LAYOUT = [
  { id: 'w-header', type: 'header', title: 'Executive Summary' },
  { id: 'w-ai-summary', type: 'ai-summary', title: 'AI Insights' },
  { id: 'w-metrics', type: 'metrics-grid', title: 'KPI Grid' },
  { id: 'w-chart-1', type: 'traffic-chart', title: 'Traffic Over Time' },
];

export default function PublicReportPage({ params }: { params: { slug: string } }) {
  const [report, setReport] = useState<any>(null);
  const [layout, setLayout] = useState<any[]>(DEFAULT_LAYOUT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to load the custom layout from the agency's storage to simulate dynamic templates
    const customLayout = localStorage.getItem('riq_custom_layout');
    if (customLayout) {
      setLayout(JSON.parse(customLayout));
    }

    const fetchReport = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/public/${params.slug}`);
        if (res.ok) setReport(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [params.slug]);

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>Loading dynamic report...</div>;
  if (!report) return <div style={{ padding: 60, textAlign: 'center' }}>Report not found or is not public.</div>;

  const m = report.metricsData || {};
  const c = report.user || { primaryColor: '#8a2be2', accentColor: '#00e5ff', agencyName: 'Agency' };

  return (
    <div className="report-page">
      <div className="report-container">
        
        {/* Dynamic Header (Always pinned top) */}
        <div className="report-agency-header" style={{ flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: c.primaryColor, marginBottom: 8, fontWeight: 700 }}>
              Performance Report
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              {report.client?.name || 'Client'}
            </h1>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {report.period || 'Period N/A'}
            </div>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
            {c.logo ? (
              <img src={c.logo} alt={c.agencyName} height={40} style={{ borderRadius: 8 }} />
            ) : (
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{c.agencyName}</div>
            )}
            <button className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
              <Download size={14} /> Export PDF
            </button>
          </div>
        </div>

        {/* Dynamic Template Renderer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginTop: 40 }}>
          {layout.map((widget) => (
            <div key={widget.id} className="animate-in">
              <WidgetRenderer type={widget.type} title={widget.title} report={report} m={m} c={c} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 80, padding: 24, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Report generated securely via <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>ReportIQ</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// THE DYNAMIC RENDERER
function WidgetRenderer({ type, title, report, m, c }: any) {
  switch (type) {
    case 'header':
      return (
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', borderBottom: `2px solid ${c.primaryColor}40`, paddingBottom: 12 }}>
          {title}
        </h2>
      );
      
    case 'ai-summary':
      return (
        <div className="report-ai-block" style={{ borderLeft: `4px solid ${c.primaryColor}`, margin: 0 }}>
          <div className="report-ai-label" style={{ color: c.primaryColor }}>
            <Sparkles size={14} /> AI Insights
          </div>
          <div className="report-ai-summary">
            {report.aiSummary || 'No summary available for this period.'}
          </div>
          {report.aiInsights && report.aiInsights.length > 0 && (
            <div className="report-insights">
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Trends</div>
              {report.aiInsights.map((insight: string, i: number) => (
                <div key={i} className="report-insight">{insight}</div>
              ))}
            </div>
          )}
        </div>
      );
      
    case 'metrics-grid':
      return (
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>{title}</h3>
          {/* Mobile swipeable container */}
          <div style={{ display: 'flex', overflowX: 'auto', gap: 16, paddingBottom: 16, scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            <MetricCard label="Sessions" value={m.sessions?.toLocaleString() || 'N/A'} prevValue={m.previousSessions} currValue={m.sessions} />
            <MetricCard label="Conversions" value={m.conversions?.toLocaleString() || 'N/A'} prevValue={m.previousConversions} currValue={m.conversions} />
            <MetricCard label="Conv. Rate" value={m.conversionRate ? `${m.conversionRate}%` : 'N/A'} />
            <MetricCard label="Revenue" value={m.revenue ? `$${m.revenue.toLocaleString()}` : 'N/A'} />
            <MetricCard label="Bounce Rate" value={m.bounceRate ? `${m.bounceRate}%` : 'N/A'} />
          </div>
        </div>
      );
      
    case 'traffic-chart':
      return (
        <div className="card">
          <TrafficLineChart color={c.primaryColor} />
        </div>
      );
      
    case 'source-chart':
      return (
        <div className="card">
          <SourceBarChart color={c.accentColor} />
        </div>
      );
      
    default:
      return null;
  }
}

// COMPONENT for Mobile Swipeable Metric Card
function MetricCard({ label, value, prevValue, currValue }: { label: string, value: string, prevValue?: number, currValue?: number }) {
  let changeHtml = null;
  if (prevValue && currValue) {
    const diff = currValue - prevValue;
    const pct = Math.round((diff / prevValue) * 100);
    const isUp = pct >= 0;
    changeHtml = (
      <div className={`stat-change ${isUp ? 'up' : 'down'}`} style={{ marginTop: 8 }}>
        {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {Math.abs(pct)}%
      </div>
    );
  }

  return (
    <div className="report-metric-card" style={{ minWidth: 160, flex: '0 0 auto', scrollSnapAlign: 'start' }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ marginTop: 8 }}>{value}</div>
      {changeHtml}
    </div>
  );
}

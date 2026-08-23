'use client';
import { useState, useEffect, use } from 'react';
import { ArrowUpRight, ArrowDownRight, Sparkles, Download, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { TrafficLineChart } from '@/components/widgets/TrafficLineChart';
import { SourceBarChart } from '@/components/widgets/SourceBarChart';
import { ForecastChart } from '@/components/widgets/ForecastChart';
import { BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

// Same default as the builder
const DEFAULT_LAYOUT = [
  { id: 'w-header', type: 'header', title: 'Executive Summary' },
  { id: 'w-ai-summary', type: 'ai-summary', title: 'AI Insights' },
  { id: 'w-metrics', type: 'metrics-grid', title: 'KPI Grid' },
  { id: 'w-chart-1', type: 'traffic-chart', title: 'Traffic Over Time' },
];

const staggerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } }
};

export default function PublicReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/public/${slug}`);
        if (res.ok) setReport(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [slug]);

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>Loading dynamic report...</div>;
  if (!report) return <div style={{ padding: 60, textAlign: 'center' }}>Report not found or is not public.</div>;

  let m = {};
  try {
    m = typeof report.metricsData === 'string' ? JSON.parse(report.metricsData) : (report.metricsData || {});
  } catch (e) {
    m = report.metricsData || {};
  }

  let parsedInsights = [];
  try {
    parsedInsights = typeof report.aiInsights === 'string' ? JSON.parse(report.aiInsights) : (report.aiInsights || []);
  } catch (e) {
    parsedInsights = Array.isArray(report.aiInsights) ? report.aiInsights : [];
  }
  report.aiInsights = parsedInsights;

  let parsedActionPlan = null;
  if (report.aiActionPlan) {
    try {
      parsedActionPlan = typeof report.aiActionPlan === 'string' ? JSON.parse(report.aiActionPlan) : report.aiActionPlan;
    } catch (e) {
      console.error('Failed to parse aiActionPlan', e);
    }
  }
  report.actionPlan = parsedActionPlan;
  const c = report.user || { primaryColor: '#8a2be2', accentColor: '#00e5ff', agencyName: 'Agency' };

  return (
    <div className="report-page print:bg-white print:p-0">
      <motion.div initial="hidden" animate="show" variants={staggerVariants} className="report-container print:shadow-none print:max-w-none print:m-0 print:border-none">
        
        {/* Dynamic Header (Always pinned top) */}
        <motion.div variants={fadeUpVariants} className="report-agency-header print:break-inside-avoid" style={{ flexWrap: 'wrap', gap: 16 }}>
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
            <button className="btn btn-secondary btn-sm print:hidden" style={{ whiteSpace: 'nowrap' }} onClick={() => window.print()}>
              <Download size={14} /> Export PDF
            </button>
          </div>
        </motion.div>

        {/* Dynamic Template Renderer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginTop: 40 }}>
          {layout.map((widget) => (
            <motion.div key={widget.id} variants={fadeUpVariants} className="print:break-inside-avoid">
              <WidgetRenderer type={widget.type} title={widget.title} report={report} m={m} c={c} />
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div variants={fadeUpVariants} style={{ textAlign: 'center', marginTop: 80, padding: 24, borderTop: '1px solid var(--border)' }} className="print:mt-12">
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Report generated securely via <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>ReportIQ</Link>
          </p>
        </motion.div>
      </motion.div>
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
      
    case 'predictive-forecast':
      return (
        <div className="card">
          <ForecastChart color={c.accentColor} />
        </div>
      );
      
    case 'action-plan':
      return (
        <div style={{ background: `linear-gradient(135deg, ${c.accentColor}15, transparent)`, border: `1px solid ${c.accentColor}40`, padding: 24, borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: c.accentColor, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <BrainCircuit size={14} /> AI Action Plan
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
            {report.actionPlan?.plan || "Based on this month's performance, here are recommended actions to improve metrics."}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(report.actionPlan?.actionItems || []).length > 0 ? (
              report.actionPlan.actionItems.map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 16, background: 'var(--bg-1)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ 
                    padding: '4px 8px', 
                    borderRadius: 6, 
                    fontSize: 10, 
                    fontWeight: 700, 
                    background: item.priority === 'High' ? 'rgba(244, 63, 94, 0.1)' : item.priority === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 212, 142, 0.1)',
                    color: item.priority === 'High' ? 'var(--accent-red)' : item.priority === 'Medium' ? 'var(--accent-yellow)' : 'var(--accent-green)'
                  }}>
                    {item.priority}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5 }}>{item.task}</div>
                </div>
              ))
            ) : (
              <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)' }}>Action plan generating...</div>
            )}
          </div>
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

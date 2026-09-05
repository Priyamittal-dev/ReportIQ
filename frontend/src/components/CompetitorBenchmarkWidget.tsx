'use client';
import { useState } from 'react';
import { Swords, Globe, Search, ArrowUpRight, TrendingUp, Sparkles, Check, AlertTriangle } from 'lucide-react';

interface CompetitorBenchmarkWidgetProps {
  clientName?: string;
  clientWebsite?: string;
}

export default function CompetitorBenchmarkWidget({ clientName = 'Your Client', clientWebsite = 'clientbrand.com' }: CompetitorBenchmarkWidgetProps) {
  const [competitor1, setCompetitor1] = useState('rivalagency.io');
  const [competitor2, setCompetitor2] = useState('growthleader.com');
  const [analyzing, setAnalyzing] = useState(false);
  const [data, setData] = useState({
    client: {
      name: clientName,
      domain: clientWebsite,
      da: 42,
      keywords: '3,840',
      traffic: '28.4K',
      speedScore: 92,
      activeAds: 8,
      status: 'winner'
    },
    comp1: {
      name: 'Competitor A',
      domain: 'rivalagency.io',
      da: 48,
      keywords: '5,210',
      traffic: '36.1K',
      speedScore: 71,
      activeAds: 14,
      status: 'neutral'
    },
    comp2: {
      name: 'Competitor B',
      domain: 'growthleader.com',
      da: 35,
      keywords: '2,190',
      traffic: '14.8K',
      speedScore: 64,
      activeAds: 4,
      status: 'lagging'
    }
  });

  const handleRunComparison = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setData((prev) => ({
        ...prev,
        comp1: { ...prev.comp1, domain: competitor1 },
        comp2: { ...prev.comp2, domain: competitor2 }
      }));
    }, 1200);
  };

  return (
    <div className="card" style={{ border: '1px solid rgba(255, 255, 255, 0.12)', background: 'var(--bg-1)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ padding: 8, borderRadius: 8, background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
            <Swords size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Automated Competitor Benchmarking</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Real-time domain authority, keyword footprint, and ad intelligence gap analysis</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={competitor1}
            onChange={(e) => setCompetitor1(e.target.value)}
            placeholder="competitor1.com"
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: 12,
              width: 140
            }}
          />
          <input
            type="text"
            value={competitor2}
            onChange={(e) => setCompetitor2(e.target.value)}
            placeholder="competitor2.com"
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: 12,
              width: 140
            }}
          />
          <button
            onClick={handleRunComparison}
            disabled={analyzing}
            className="btn btn-secondary"
            style={{ padding: '6px 14px', fontSize: 12 }}
          >
            {analyzing ? 'Scraping...' : <><Search size={13} /> Compare</>}
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
              <th style={{ padding: '12px 16px' }}>Domain / Entity</th>
              <th style={{ padding: '12px 16px' }}>Domain Authority (DA)</th>
              <th style={{ padding: '12px 16px' }}>Organic Keywords</th>
              <th style={{ padding: '12px 16px' }}>Est. Monthly Traffic</th>
              <th style={{ padding: '12px 16px' }}>Mobile PageSpeed</th>
              <th style={{ padding: '12px 16px' }}>Active Ad Creatives</th>
            </tr>
          </thead>
          <tbody>
            {/* Client Row */}
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(138, 43, 226, 0.08)' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ padding: '2px 8px', borderRadius: 4, background: '#8a2be2', color: '#fff', fontSize: 11, fontWeight: 700 }}>YOU</span>
                {data.client.name} <span style={{ color: '#94a3b8', fontSize: 11 }}>({data.client.domain})</span>
              </td>
              <td style={{ padding: '14px 16px', color: '#38bdf8', fontWeight: 700 }}>{data.client.da} / 100</td>
              <td style={{ padding: '14px 16px', color: '#e2e8f0' }}>{data.client.keywords}</td>
              <td style={{ padding: '14px 16px', color: '#e2e8f0', fontWeight: 600 }}>{data.client.traffic}</td>
              <td style={{ padding: '14px 16px', color: '#34d399', fontWeight: 700 }}>{data.client.speedScore}/100 ⚡</td>
              <td style={{ padding: '14px 16px', color: '#e2e8f0' }}>{data.client.activeAds} ads</td>
            </tr>

            {/* Competitor 1 */}
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>
                {data.comp1.name} <span style={{ color: '#64748b', fontSize: 11 }}>({data.comp1.domain})</span>
              </td>
              <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{data.comp1.da} / 100</td>
              <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{data.comp1.keywords}</td>
              <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{data.comp1.traffic}</td>
              <td style={{ padding: '14px 16px', color: '#f59e0b' }}>{data.comp1.speedScore}/100</td>
              <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{data.comp1.activeAds} ads</td>
            </tr>

            {/* Competitor 2 */}
            <tr>
              <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>
                {data.comp2.name} <span style={{ color: '#64748b', fontSize: 11 }}>({data.comp2.domain})</span>
              </td>
              <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{data.comp2.da} / 100</td>
              <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{data.comp2.keywords}</td>
              <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{data.comp2.traffic}</td>
              <td style={{ padding: '14px 16px', color: '#ef4444' }}>{data.comp2.speedScore}/100</td>
              <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{data.comp2.activeAds} ads</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* AI Benchmark Gap Recommendation */}
      <div
        style={{
          marginTop: 16,
          padding: '12px 16px',
          borderRadius: 8,
          background: 'rgba(0, 229, 255, 0.08)',
          border: '1px solid rgba(0, 229, 255, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: '#22d3ee',
          fontSize: 13,
        }}
      >
        <Sparkles size={16} style={{ flexShrink: 0 }} />
        <span>
          <strong>AI Opportunity Gap:</strong> {data.client.name} outperforms competitors in Core Web Vitals (+21 pts) but lags {data.comp1.name} in commercial keywords. Targeting their top 14 shared keyword clusters can unlock an estimated +8,500 monthly organic visits.
        </span>
      </div>
    </div>
  );
}

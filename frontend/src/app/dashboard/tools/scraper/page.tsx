'use client';
import { useState } from 'react';
import { Search, Loader2, Globe, FileText, Tag, Link as LinkIcon, BarChart } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function ScraperPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleScrape = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await apiFetch('/api/scraper/analyze', {
        method: 'POST',
        body: JSON.stringify({ url })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to scrape URL');
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Competitor Analysis & Scraper</h1>
        <p className="page-subtitle">Extract SEO metadata, headings, and structure from any website.</p>
      </div>

      <div className="page-body">
        <div className="card" style={{ padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Globe size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="https://competitor.com"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScrape()}
                style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-0)', fontSize: 16, color: 'var(--text-primary)' }}
              />
            </div>
            <button onClick={handleScrape} disabled={loading} className="btn btn-primary" style={{ padding: '0 32px', fontSize: 16 }}>
              {loading ? <Loader2 size={20} className="animate-spin" /> : <><Search size={20} /> Analyze</>}
            </button>
          </div>
          {error && <p style={{ color: 'var(--accent-red)', marginTop: 16 }}>{error}</p>}
        </div>

        {data && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="card-grid card-grid-4">
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', marginBottom: 12 }}><FileText size={18} /> Word Count</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{data.wordCount.toLocaleString()}</div>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', marginBottom: 12 }}><BarChart size={18} /> H1 / H2 Tags</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{data.h1Count} / {data.h2Count}</div>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', marginBottom: 12 }}><LinkIcon size={18} /> Ext. Links</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{data.externalLinks}</div>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', marginBottom: 12 }}><Tag size={18} /> Keywords</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{data.keywords ? 'Found' : 'None'}</div>
              </div>
            </div>

            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>SEO Meta Data</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <strong style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)' }}>Title Tag</strong>
                  <div style={{ padding: 16, background: 'var(--bg-0)', borderRadius: 8, border: '1px solid var(--border)' }}>{data.title || <span style={{ color: 'var(--text-muted)' }}>Missing</span>}</div>
                </div>
                <div>
                  <strong style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)' }}>Meta Description</strong>
                  <div style={{ padding: 16, background: 'var(--bg-0)', borderRadius: 8, border: '1px solid var(--border)' }}>{data.description || <span style={{ color: 'var(--text-muted)' }}>Missing</span>}</div>
                </div>
                {data.keywords && (
                  <div>
                    <strong style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)' }}>Meta Keywords</strong>
                    <div style={{ padding: 16, background: 'var(--bg-0)', borderRadius: 8, border: '1px solid var(--border)' }}>{data.keywords}</div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 24 }}>
              <div className="card" style={{ flex: 1, padding: 32 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>Primary Headings (H1/H2)</h3>
                <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {data.h1s.map((h: string, i: number) => <li key={`h1-${i}`}><strong>{h}</strong></li>)}
                  {data.h2s.map((h: string, i: number) => <li key={`h2-${i}`} style={{ color: 'var(--text-secondary)' }}>{h}</li>)}
                  {data.h1s.length === 0 && data.h2s.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No headings found.</p>}
                </ul>
              </div>

              <div className="card" style={{ flex: 1, padding: 32 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>Sample Links</h3>
                <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {data.sampleLinks.map((l: any, i: number) => (
                    <li key={`link-${i}`}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                        {l.text || l.href}
                      </a>
                    </li>
                  ))}
                  {data.sampleLinks.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No external links found.</p>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

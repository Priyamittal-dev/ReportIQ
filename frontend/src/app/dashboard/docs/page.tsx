'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Book, Plug, MessageSquare, Zap, PlayCircle, FileText, ChevronRight } from 'lucide-react';
import SupportModal from '@/components/SupportModal';

const categories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    desc: 'Learn the basics of ReportIQ and set up your agency profile.',
    icon: <PlayCircle size={24} color="#8b5cf6" />,
    color: 'rgba(139, 92, 246, 0.1)',
    articles: ['Welcome to ReportIQ', 'Setting up your first client', 'Inviting team members']
  },
  {
    id: 'integrations',
    title: 'Integrations',
    desc: 'Connect Google Ads, Meta Ads, GA4, and other data sources.',
    icon: <Plug size={24} color="#3b82f6" />,
    color: 'rgba(59, 130, 246, 0.1)',
    articles: ['Connecting Google Ads', 'Troubleshooting Meta OAuth', 'Adding Custom Data Sources']
  },
  {
    id: 'reporting',
    title: 'Reporting & Dashboards',
    desc: 'Create beautiful, automated reports and custom templates.',
    icon: <FileText size={24} color="#10b981" />,
    color: 'rgba(16, 185, 129, 0.1)',
    articles: ['Using the Template Builder', 'Scheduling automated emails', 'Exporting to PDF']
  },
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    desc: 'Leverage AI to write insights and analyze campaign performance.',
    icon: <Zap size={24} color="#f59e0b" />,
    color: 'rgba(245, 158, 11, 0.1)',
    articles: ['How the AI generates summaries', 'Chatting with your data', 'Customizing AI tone']
  }
];

export default function DocumentationPage() {
  const [search, setSearch] = useState('');
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <div>
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
      {/* Hero Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', 
        padding: '64px 40px', 
        borderRadius: '0 0 24px 24px',
        color: 'white',
        marginBottom: 40,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Abstract shapes */}
        <div style={{ position: 'absolute', right: -50, top: -50, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', left: '20%', bottom: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>How can we help you today?</h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 32 }}>Search our knowledge base or browse categories below to master ReportIQ.</p>
          
          <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
            <Search size={24} color="#94a3b8" style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search guides, tutorials, and FAQs..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '20px 24px 20px 60px',
                borderRadius: 16,
                border: 'none',
                fontSize: 16,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      <div className="page-body" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Browse Categories</h2>
        
        <div className="card-grid card-grid-2">
          {categories.map(cat => (
            <div key={cat.id} className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {cat.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{cat.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.5 }}>{cat.desc}</p>
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 'auto' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {cat.articles.map((article, i) => (
                    <li key={i}>
                      <Link href={`/dashboard/docs/${cat.id}/${article.toLowerCase().replace(/ /g, '-')}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', textDecoration: 'none', fontSize: 15, fontWeight: 500, transition: 'color 0.2s' }} className="doc-link">
                        <Book size={16} color="var(--text-muted)" />
                        {article}
                        <ChevronRight size={16} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={`/dashboard/docs/${cat.id}`} style={{ display: 'inline-block', marginTop: 16, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
                  View all {cat.title.toLowerCase()} articles →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="card" style={{ marginTop: 40, padding: 40, background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(139,92,246,0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: 'var(--bg-0)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={32} color="var(--accent)" />
            </div>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Still need help?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Our support team is available 24/7 to help you resolve any issues.</p>
            </div>
          </div>
          <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: 16 }} onClick={() => setSupportOpen(true)}>Contact Support</button>
        </div>

      </div>

      <style jsx>{`
        .doc-link:hover {
          color: var(--accent) !important;
        }
        .doc-link:hover > svg {
          color: var(--accent) !important;
        }
      `}</style>
    </div>
  );
}

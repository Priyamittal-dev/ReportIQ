'use client';
import { use } from 'react';
import Link from 'next/link';
import { Book, ChevronRight, ArrowLeft } from 'lucide-react';

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);

  // Mock articles for the category
  const articles = [
    'Connecting Google Ads',
    'Troubleshooting Meta OAuth',
    'Adding Custom Data Sources',
    'Understanding API Limits',
    'Setting up Webhooks',
  ];

  const title = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
      <Link href="/dashboard/docs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: 32 }}>
        <ArrowLeft size={16} /> Back to Knowledge Base
      </Link>
      
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>{title} Articles</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 40 }}>Browse all articles related to {title}.</p>

      <div className="card" style={{ padding: 0 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {articles.map((article, i) => (
            <li key={i} style={{ borderBottom: i < articles.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <Link href={`/dashboard/docs/${category}/${article.toLowerCase().replace(/ /g, '-')}`} style={{ display: 'flex', alignItems: 'center', padding: '24px', color: 'var(--text-primary)', textDecoration: 'none', transition: 'background 0.2s' }} className="article-hover">
                <Book size={20} color="var(--accent)" style={{ marginRight: 16 }} />
                <span style={{ fontSize: 16, fontWeight: 500 }}>{article}</span>
                <ChevronRight size={20} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .article-hover:hover {
          background: var(--bg-0);
        }
      `}</style>
    </div>
  );
}

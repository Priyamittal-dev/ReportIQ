'use client';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, ThumbsUp, ThumbsDown } from 'lucide-react';
import Link from 'next/link';

export default function DocArticlePage() {
  const params = useParams();
  const router = useRouter();
  
  const category = params.category as string;
  const slug = params.slug as string;

  // Format slug back to title case for display purposes
  const title = slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Article Not Found';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px' }}>
      
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
        <Link href="/dashboard/docs" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}>
          <BookOpen size={16} /> Knowledge Base
        </Link>
        <span>/</span>
        <span style={{ textTransform: 'capitalize' }}>{category?.replace(/-/g, ' ')}</span>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>{title}</span>
      </div>

      <button onClick={() => router.back()} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24, padding: 0, fontSize: 14, fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card" style={{ padding: '48px', minHeight: '50vh' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24, color: 'var(--text-primary)' }}>
          {title}
        </h1>
        
        <div style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p>
            Welcome to the guide on <strong>{title}</strong>. This documentation article will help you understand how to use this feature effectively within ReportIQ.
          </p>
          
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginTop: 24, marginBottom: 16 }}>Overview</h2>
          <p>
            ReportIQ provides enterprise-grade tools to automate your agency's reporting workflow. When working with {title.toLowerCase()}, you can expect seamless integration, high performance, and AI-driven insights out of the box.
          </p>

          <div style={{ background: 'rgba(59,130,246,0.05)', borderLeft: '4px solid #3b82f6', padding: '16px 20px', borderRadius: '0 8px 8px 0', margin: '24px 0' }}>
            <strong style={{ color: '#1e3a8a', display: 'block', marginBottom: 8 }}>Pro Tip:</strong>
            <span style={{ color: '#1e40af' }}>Always ensure you have connected the appropriate integrations before attempting to generate automated reports with this feature.</span>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginTop: 24, marginBottom: 16 }}>Step-by-Step Instructions</h2>
          <ol style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <li>Navigate to the relevant section in your sidebar menu.</li>
            <li>Click the primary action button (usually in the top right).</li>
            <li>Fill out the required configuration fields.</li>
            <li>Click "Save" or "Generate" to apply your changes.</li>
          </ol>
          
          <p style={{ marginTop: 24 }}>
            If you experience any issues, please check our <Link href="/dashboard/docs/integrations/troubleshooting" style={{ color: 'var(--accent)', textDecoration: 'none' }}>troubleshooting guide</Link> or contact support.
          </p>
        </div>

        {/* Feedback Section */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 500 }}>Was this article helpful?</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" style={{ padding: '8px 16px' }}><ThumbsUp size={16} /> Yes</button>
            <button className="btn btn-secondary" style={{ padding: '8px 16px' }}><ThumbsDown size={16} /> No</button>
          </div>
        </div>

      </div>
    </div>
  );
}

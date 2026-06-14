'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function IntegrationCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const provider = params.provider; // 'google' or 'meta'
  const code = searchParams.get('code');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!code || !provider) {
      setStatus('error');
      return;
    }

    const endpoint = provider === 'google' ? '/api/integrations/google-ads/callback' : '/api/integrations/meta-ads/callback';
    const token = localStorage.getItem('riq_token');

    fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ code })
    })
    .then(res => {
      if (res.ok) {
        setStatus('success');
        setTimeout(() => router.push('/dashboard/integrations'), 2000);
      } else {
        setStatus('error');
      }
    })
    .catch(() => setStatus('error'));

  }, [code, provider, router]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '60vh' }}>
      <div className="card" style={{ padding: 40, textAlign: 'center', maxWidth: 400 }}>
        {status === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <Loader2 size={48} className="animate-spin" color="var(--accent)" />
            <h2>Connecting Account...</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Please wait while we secure your connection.</p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <CheckCircle size={48} color="var(--accent-green)" />
            <h2>Integration Connected!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Redirecting back to integrations...</p>
          </div>
        )}

        {status === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <XCircle size={48} color="var(--accent-red)" />
            <h2>Connection Failed</h2>
            <p style={{ color: 'var(--text-secondary)' }}>We couldn't connect your account. The authorization may have failed or expired.</p>
            <button onClick={() => router.push('/dashboard/integrations')} className="btn btn-secondary">
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

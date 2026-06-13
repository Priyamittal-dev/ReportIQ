'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function VerifyContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/verify?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.accessToken) {
          localStorage.setItem('riq_token', data.accessToken);
          localStorage.setItem('riq_user', JSON.stringify(data.user));
          setStatus('success');
          setTimeout(() => router.push('/dashboard'), 2000);
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [searchParams, router]);

  return (
    <div style={{ textAlign: 'center' }}>
      {status === 'loading' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Loader2 size={48} className="animate-spin" color="var(--accent)" />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Verifying your email...</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Please wait while we verify your account.</p>
        </div>
      )}

      {status === 'success' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <CheckCircle size={48} color="var(--accent-green)" />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Email Verified!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Your account has been verified. Redirecting to dashboard...</p>
        </div>
      )}

      {status === 'error' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <XCircle size={48} color="var(--accent-red)" />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Verification Failed</h2>
          <p style={{ color: 'var(--text-secondary)' }}>The link is invalid or has expired.</p>
          <Link href="/auth/login" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Return to Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-0)', color: 'var(--text-primary)' }}>
      <div className="card" style={{ padding: '40px', maxWidth: '400px', width: '100%', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <Suspense fallback={<Loader2 size={48} className="animate-spin" color="var(--accent)" />}>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}

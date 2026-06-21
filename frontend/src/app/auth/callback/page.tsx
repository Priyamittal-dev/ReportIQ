'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      router.push('/auth/login?error=MissingToken');
      return;
    }

    // Save the JWT token
    localStorage.setItem('riq_token', token);

    // Fetch user details to save to local storage
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(user => {
      localStorage.setItem('riq_user', JSON.stringify(user));
      // Redirect to dashboard on success
      router.push('/dashboard');
    })
    .catch(err => {
      console.error('Failed to fetch user:', err);
      router.push('/auth/login?error=FetchUserFailed');
    });

  }, [token, router]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-0)' }}>
      <Loader2 size={48} className="animate-spin" color="var(--accent)" style={{ marginBottom: 24 }} />
      <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>Signing you in...</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Securing your session and loading the dashboard.</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-0)' }}>
        <Loader2 size={48} className="animate-spin" color="var(--accent)" style={{ marginBottom: 24 }} />
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>Loading...</h2>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}

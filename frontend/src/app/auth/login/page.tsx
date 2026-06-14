'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, BarChart, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('riq_token', data.accessToken);
      localStorage.setItem('riq_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 50%, #e0f2fe 100%)', 
      color: '#1e293b',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* Left Column - Benefits & Branding */}
      <div style={{ flex: 1, padding: '60px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <BarChart size={24} />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: 0 }}>ReportIQ</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 450 }}>
          {[
            'Welcome back to your dashboard',
            'View real-time client performance',
            'Connect new ad platforms',
            'Download and send PDF reports instantly'
          ].map((benefit, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <CheckCircle2 size={24} color="#0ea5e9" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 18, color: '#334155', margin: 0, lineHeight: 1.5 }}>{benefit}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 80, display: 'flex', alignItems: 'center', gap: 24 }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
             <strong style={{ fontSize: 16, color: '#0f172a' }}>★ Trustpilot</strong>
             <span style={{ fontSize: 14, color: '#64748b' }}>★★★★★</span>
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
             <strong style={{ fontSize: 16, color: '#0f172a' }}>G2 Crowd</strong>
             <span style={{ fontSize: 14, color: '#64748b' }}>★★★★★</span>
           </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: 24, 
          padding: '48px', 
          width: '100%', 
          maxWidth: 480, 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 24
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0, textAlign: 'center' }}>Welcome back</h2>

          <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 12, 
            border: '1px solid #e2e8f0', 
            borderRadius: 12, 
            padding: '14px', 
            textDecoration: 'none', 
            color: '#334155',
            fontWeight: 600,
            transition: 'background 0.2s',
            cursor: 'pointer'
          }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <img src="https://www.google.com/favicon.ico" alt="Google" width={20} height={20} />
            Sign in with Google
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '8px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 13, color: '#64748b' }}>Or sign in with email</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <input 
                type="email" 
                placeholder="Work Email*" 
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 15, outline: 'none' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type={show ? 'text' : 'password'} 
                placeholder="Password*" 
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
                style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 15, outline: 'none', paddingRight: 48 }}
              />
              <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 16, top: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div style={{ color: '#ef4444', fontSize: 14, padding: '8px 12px', background: '#fef2f2', borderRadius: 8 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              background: loading ? '#cbd5e1' : '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              marginTop: 8
            }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p style={{ marginTop: 24, fontSize: 15, color: '#475569' }}>
          Don't have an account? <Link href="/auth/signup" style={{ color: '#0f172a', fontWeight: 700, textDecoration: 'none' }}>Sign up</Link>
        </p>
      </div>

    </div>
  );
}

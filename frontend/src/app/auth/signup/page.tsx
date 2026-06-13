'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [form, setForm] = useState({ agencyName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      if (data.requiresVerification) {
        setSuccessMessage(data.message);
        setLoading(false);
      } else {
        localStorage.setItem('riq_token', data.accessToken);
        localStorage.setItem('riq_user', JSON.stringify(data.user));
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg-0)', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(138,43,226,0.12), transparent)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none', transition: 'color var(--t-fast)' }}>
          <ArrowLeft size={14} /> Back to home
        </Link>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {/* Form */}
          <div className="card" style={{ flex: 1, minWidth: 300, padding: 36 }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 24, fontWeight: 800, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>ReportIQ</div>
              <h1 style={{ fontSize: 21, fontWeight: 700, color: 'var(--text-primary)' }}>Create your agency account</h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Free forever. No credit card required.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Agency Name</label>
                <input className="form-input" type="text" placeholder="Grow Digital Agency" value={form.agencyName}
                  onChange={e => setForm(p => ({ ...p, agencyName: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Work Email</label>
                <input className="form-input" type="email" placeholder="you@agency.com" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">Password</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input className="form-input" type={showPassword ? 'text' : 'password'} placeholder="Minimum 8 characters" value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={8} style={{ paddingRight: '40px', width: '100%' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '35px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f43f5e' }}>
                  {error}
                </div>
              )}

              {successMessage && (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#10b981' }}>
                  {successMessage}
                </div>
              )}

              <button className="btn btn-gradient" type="submit" disabled={loading || !!successMessage} style={{ width: '100%', marginTop: 4 }}>
                {loading ? 'Creating account...' : successMessage ? 'Check your email' : 'Create free account →'}
              </button>

              <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>
                  <span>🔗</span> Continue with Google
                </a>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Already have an account?{' '}
                  <Link href="/auth/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Log in</Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* What you get */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {['2 clients free', 'AI summaries', 'PDF export', 'No credit card'].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
              <Check size={14} color="var(--accent-green)" />
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Eye, EyeOff, BarChart } from 'lucide-react';

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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 50%, #e0f2fe 100%)', // Subtle gradient resembling klipfolio light feel
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
            'Build and distribute highly-customizable dashboards and reports',
            'Automate data retrieval for real-time updates',
            'Integrate with Google Ads, Meta Ads, GA4 and more',
            '14-day free trial, no credit card required'
          ].map((benefit, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <CheckCircle2 size={24} color="#0ea5e9" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 18, color: '#334155', margin: 0, lineHeight: 1.5 }}>{benefit}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 80, display: 'flex', alignItems: 'center', gap: 24 }}>
           {/* Placeholder for Trust Badges */}
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
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0, textAlign: 'center' }}>Create your account</h2>

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
            Sign up with Google
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '8px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 13, color: '#64748b' }}>Or sign up with email</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <input 
                type="text" 
                placeholder="Agency Name*" 
                value={form.agencyName}
                onChange={e => setForm(p => ({ ...p, agencyName: e.target.value }))}
                required
                style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 15, outline: 'none' }}
              />
            </div>
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
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password*" 
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
                minLength={8}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 15, outline: 'none', paddingRight: 48 }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 16, top: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div style={{ color: '#ef4444', fontSize: 14, padding: '8px 12px', background: '#fef2f2', borderRadius: 8 }}>
                {error}
              </div>
            )}
            
            {successMessage && (
              <div style={{ color: '#10b981', fontSize: 14, padding: '8px 12px', background: '#ecfdf5', borderRadius: 8 }}>
                {successMessage}
              </div>
            )}

            <button type="submit" disabled={loading || !!successMessage} style={{
              background: loading || !!successMessage ? '#cbd5e1' : '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: loading || !!successMessage ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              marginTop: 8
            }}>
              {loading ? 'Creating account...' : successMessage ? 'Check your email' : 'Create account'}
            </button>
            
            <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 8 }}>
              By creating an account, you agree to our Terms of Service.
            </p>
          </form>
        </div>

        <p style={{ marginTop: 24, fontSize: 15, color: '#475569' }}>
          Already have an account? <Link href="/auth/login" style={{ color: '#0f172a', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>

    </div>
  );
}

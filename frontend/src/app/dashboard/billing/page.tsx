'use client';
import { useState } from 'react';
import { CreditCard, Check, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (plan: string) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({ plan }),
      });
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to initiate checkout.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error initiating checkout.');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Billing & Subscription</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your plan, free trial, and payment methods.</p>
      </header>

      {/* Free Trial Alert */}
      <div className="card" style={{ padding: '20px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <AlertCircle color="#f59e0b" size={24} />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontWeight: 600, color: '#f59e0b' }}>Free Trial Active</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>You have 12 days left on your Pro trial. Add a payment method to ensure uninterrupted reporting.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Pro Plan */}
        <div className="card" style={{ padding: '32px', border: '1px solid var(--border)', borderRadius: '16px', background: 'var(--bg-1)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Pro Plan</h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '16px 0' }}>$29<span style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/mo</span></div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>For growing freelancers</p>
          
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {['10 clients', '3 integrations', 'Auto-scheduled delivery', 'AI summaries', 'PDF + Web reports'].map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <Check size={16} color="var(--accent-green)" /> {f}
              </li>
            ))}
          </ul>
          
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleCheckout('Pro')} disabled={loading}>
            {loading ? 'Processing...' : 'Subscribe to Pro'}
          </button>
        </div>

        {/* Agency Plan */}
        <div className="card" style={{ padding: '32px', border: '2px solid var(--accent)', borderRadius: '16px', background: 'var(--bg-1)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', right: '24px', background: 'var(--gradient-brand)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
            RECOMMENDED
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Agency Plan</h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '16px 0' }}>$79<span style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/mo</span></div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>For full-service agencies</p>
          
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {['Unlimited clients', 'All integrations', 'White-label branding', 'Report history', 'Team access'].map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <Check size={16} color="var(--accent-green)" /> {f}
              </li>
            ))}
          </ul>
          
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleCheckout('Agency')} disabled={loading}>
            {loading ? 'Processing...' : 'Subscribe to Agency'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '48px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Payment Methods</h3>
        <div className="card" style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: 48, height: 32, background: '#1a1f36', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <CreditCard size={20} />
            </div>
            <div>
              <p style={{ fontWeight: 500 }}>•••• •••• •••• 4242</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Expires 12/26</p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm">Update</button>
        </div>
      </div>
    </div>
  );
}

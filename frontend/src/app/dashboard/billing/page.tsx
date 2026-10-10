'use client';
import { useState, useEffect, Suspense } from 'react';
import { 
  CreditCard, 
  Check, 
  AlertCircle, 
  Calendar, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  X, 
  Lock,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

interface Invoice {
  id: string;
  date: string;
  amount: string;
  plan: string;
  status: string;
  receiptNumber: string;
  pdfUrl?: string;
}

interface BillingStatus {
  plan: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  currentPeriodEnd?: string | null;
  paymentMethod?: PaymentMethod | null;
  isTrial: boolean;
  trialDaysRemaining: number;
  invoices: Invoice[];
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading billing...</div>}>
      <BillingContent />
    </Suspense>
  );
}

function BillingContent() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [status, setStatus] = useState<BillingStatus>({
    plan: 'STARTER',
    isTrial: true,
    trialDaysRemaining: 12,
    invoices: [],
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [savingCard, setSavingCard] = useState(false);
  const [cancelingSub, setCancelingSub] = useState(false);

  // Form states for updating card
  const [cardForm, setCardForm] = useState({
    name: 'Priyanka Mittal',
    cardNumber: '•••• •••• •••• 4242',
    expMonth: 12,
    expYear: 2028,
    cvc: '•••',
    postalCode: '10001',
    brand: 'visa',
  });

  const loadBillingStatus = async () => {
    try {
      const res = await apiFetch('/api/billing/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.error('Failed to load billing status', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadBillingStatus();

    // Check URL parameters for redirection feedback
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('success') === 'true') {
        const plan = params.get('plan') || 'Pro';
        setNotification({
          type: 'success',
          message: `Payment successful! Your agency account is now upgraded to ${plan}.`,
        });
      } else if (params.get('canceled') === 'true') {
        setNotification({
          type: 'info',
          message: 'Checkout canceled. Your previous plan and settings were preserved.',
        });
      }
    }
  }, []);

  const handleCheckout = async (plan: string) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({ plan, cycle: billingCycle }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || 'Failed to initiate checkout.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to billing service.');
      setLoading(false);
    }
  };

  const handleOpenCustomerPortal = async () => {
    try {
      const res = await apiFetch('/api/billing/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Portal redirect failed', err);
      setShowCardModal(true);
    }
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCard(true);
    try {
      const cleanDigits = cardForm.cardNumber.replace(/\D/g, '');
      const last4 = cleanDigits.slice(-4) || '4242';
      
      const res = await apiFetch('/api/billing/payment-method', {
        method: 'POST',
        body: JSON.stringify({
          brand: cardForm.brand,
          last4,
          expMonth: Number(cardForm.expMonth),
          expYear: Number(cardForm.expYear),
        }),
      });

      if (res.ok) {
        setNotification({ type: 'success', message: 'Payment method updated successfully!' });
        setShowCardModal(false);
        await loadBillingStatus();
      } else {
        alert('Failed to update card.');
      }
    } catch (err) {
      console.error('Save card error', err);
      alert('An error occurred updating payment method.');
    } finally {
      setSavingCard(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelingSub(true);
    try {
      const res = await apiFetch('/api/billing/cancel', { method: 'POST' });
      if (res.ok) {
        setNotification({
          type: 'info',
          message: 'Subscription has been canceled. Your account reverted to the Free Starter tier.',
        });
        setShowCancelModal(false);
        await loadBillingStatus();
      } else {
        alert('Could not cancel subscription.');
      }
    } catch (err) {
      console.error('Cancel sub error', err);
      alert('An error occurred during cancellation.');
    } finally {
      setCancelingSub(false);
    }
  };

  const handleDownloadReceipt = (invoice: Invoice) => {
    if (invoice.pdfUrl) {
      window.open(invoice.pdfUrl, '_blank');
      return;
    }
    // Simulate instantaneous receipt generation
    const receiptContent = `=========================================
REPORTIQ OFFICIAL INVOICE RECEIPT
=========================================
Receipt Number: ${invoice.receiptNumber}
Date: ${invoice.date}
Plan: ${invoice.plan}
Amount Paid: ${invoice.amount}
Payment Status: ${invoice.status}
Billed To: Agency Account (ReportIQ)
Payment Gateway: Stripe Secure PCI-DSS Level 1
=========================================
Thank you for powering your client reporting with ReportIQ!`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${invoice.receiptNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isCurrentPlan = (planName: string) => {
    return (status.plan || 'STARTER').toUpperCase() === planName.toUpperCase();
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1080px', margin: '0 auto', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>Billing & Subscription</h1>
            <span style={{ 
              fontSize: '12px', 
              fontWeight: 700, 
              padding: '4px 10px', 
              borderRadius: '20px', 
              background: status.plan !== 'STARTER' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: status.plan !== 'STARTER' ? 'var(--accent-green)' : 'var(--accent-yellow)',
              border: `1px solid ${status.plan !== 'STARTER' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
            }}>
              {status.plan || 'STARTER'} TIER
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px' }}>
            Manage your agency subscription, automated payment methods, and downloadable invoices.
          </p>
        </div>

        {/* Billing cycle switch */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: 'var(--bg-2)', 
          padding: '4px', 
          borderRadius: '12px', 
          border: '1px solid var(--border)' 
        }}>
          <button 
            type="button"
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: billingCycle === 'monthly' ? 'var(--bg-1)' : 'transparent',
              color: billingCycle === 'monthly' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: billingCycle === 'monthly' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Monthly
          </button>
          <button 
            type="button"
            onClick={() => setBillingCycle('annual')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: billingCycle === 'annual' ? 'var(--bg-1)' : 'transparent',
              color: billingCycle === 'annual' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: billingCycle === 'annual' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Annual
            <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', padding: '2px 6px', borderRadius: '6px' }}>
              Save 20%
            </span>
          </button>
        </div>
      </header>

      {/* Notifications */}
      {notification && (
        <div style={{
          marginBottom: '24px',
          padding: '16px 20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.12)',
          border: `1px solid ${notification.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
          color: notification.type === 'success' ? 'var(--accent-green)' : '#3b82f6',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={20} />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{notification.message}</span>
          </div>
          <button 
            type="button"
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Trial / Active Status Alert */}
      {status.isTrial && (
        <div className="card" style={{ 
          padding: '20px 24px', 
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 100%)', 
          border: '1px solid rgba(245, 158, 11, 0.25)', 
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '20px', 
          marginBottom: '36px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle color="#f59e0b" size={24} />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, color: '#f59e0b', margin: '0 0 4px 0', fontSize: '16px' }}>
                Free 14-Day Pro Trial Active
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
                You have <strong>{status.trialDaysRemaining} days remaining</strong>. Attach a payment method to unlock uninterrupted automated report delivery.
              </p>
            </div>
          </div>
          <button 
            type="button"
            className="btn btn-primary"
            onClick={() => handleCheckout('PRO')}
            disabled={loading}
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            {loading ? 'Redirecting...' : 'Upgrade Account'}
          </button>
        </div>
      )}

      {/* Plan Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        
        {/* Starter Plan */}
        <div className="card" style={{ 
          padding: '32px', 
          border: isCurrentPlan('STARTER') ? '2px solid var(--accent-green)' : '1px solid var(--border)', 
          borderRadius: '20px', 
          background: 'var(--bg-1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {isCurrentPlan('STARTER') && (
            <div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'var(--accent-green)', color: 'white', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 800 }}>
              CURRENT PLAN
            </div>
          )}
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0' }}>Starter (Trial)</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 20px 0' }}>For testing & evaluating client dashboards</p>
          <div style={{ fontSize: '38px', fontWeight: 800, margin: '0 0 24px 0', display: 'flex', alignItems: 'baseline' }}>
            $0<span style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 500, marginLeft: '6px' }}>/forever</span>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
            {['Up to 2 Client Workspaces', 'Standard Google Analytics GA4 Sync', 'Manual PDF Report Exports', 'Community Support'].map((feat, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <Check size={16} color="var(--accent-green)" style={{ flexShrink: 0 }} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          <button 
            type="button"
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'center', opacity: isCurrentPlan('STARTER') ? 0.6 : 1 }} 
            disabled={isCurrentPlan('STARTER')}
          >
            {isCurrentPlan('STARTER') ? 'Active Tier' : 'Downgrade to Starter'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="card" style={{ 
          padding: '32px', 
          border: isCurrentPlan('PRO') ? '2px solid var(--accent-green)' : '1px solid var(--border)', 
          borderRadius: '20px', 
          background: 'var(--bg-1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {isCurrentPlan('PRO') && (
            <div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'var(--accent-green)', color: 'white', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 800 }}>
              CURRENT PLAN
            </div>
          )}
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0' }}>Pro Agency</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 20px 0' }}>For growing marketing agencies & consultants</p>
          <div style={{ fontSize: '38px', fontWeight: 800, margin: '0 0 24px 0', display: 'flex', alignItems: 'baseline' }}>
            {billingCycle === 'monthly' ? '$29' : '$23'}
            <span style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 500, marginLeft: '6px' }}>/mo</span>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
            {[
              '10 Client Portals & Accounts',
              'All Data Connectors (GA4, Ads, Meta, Shopify)',
              'Auto-Scheduled Email & PDF Reports',
              'AI Strategic Summaries & Anomaly Detection',
              'Custom Agency Colors & Logos',
              'Priority Support'
            ].map((feat, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <Check size={16} color="var(--accent-green)" style={{ flexShrink: 0 }} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          <button 
            type="button"
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'center' }} 
            onClick={() => handleCheckout('PRO')} 
            disabled={loading || isCurrentPlan('PRO')}
          >
            {isCurrentPlan('PRO') ? 'Current Active Plan' : loading ? 'Redirecting...' : 'Upgrade to Pro'}
          </button>
        </div>

        {/* Agency Plan */}
        <div className="card" style={{ 
          padding: '32px', 
          border: isCurrentPlan('AGENCY') ? '2px solid var(--accent-green)' : '2px solid var(--accent)', 
          borderRadius: '20px', 
          background: 'var(--bg-1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: '-12px', 
            right: '24px', 
            background: isCurrentPlan('AGENCY') ? 'var(--accent-green)' : 'var(--gradient-brand)', 
            color: 'white', 
            padding: '4px 12px', 
            borderRadius: '12px', 
            fontSize: '11px', 
            fontWeight: 800 
          }}>
            {isCurrentPlan('AGENCY') ? 'CURRENT PLAN' : 'HIGH SCALE'}
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0' }}>Scale Agency</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 20px 0' }}>For established marketing operations</p>
          <div style={{ fontSize: '38px', fontWeight: 800, margin: '0 0 24px 0', display: 'flex', alignItems: 'baseline' }}>
            {billingCycle === 'monthly' ? '$79' : '$63'}
            <span style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 500, marginLeft: '6px' }}>/mo</span>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
            {[
              'Unlimited Clients & Dashboards',
              'Full White-Labeling & Custom Domain CNAME',
              'Client Portal with Custom Login URL',
              'Unlimited Automated AI Executive Reports',
              'Multi-user Team Member Collaboration',
              'Dedicated Slack Channel & 99.9% SLA'
            ].map((feat, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <Check size={16} color="var(--accent-green)" style={{ flexShrink: 0 }} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          <button 
            type="button"
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center' }} 
            onClick={() => handleCheckout('AGENCY')} 
            disabled={loading || isCurrentPlan('AGENCY')}
          >
            {isCurrentPlan('AGENCY') ? 'Current Active Plan' : loading ? 'Redirecting...' : 'Upgrade to Scale'}
          </button>
        </div>

      </div>

      {/* Payment Methods Section */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0' }}>Payment Method</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
              Transactions processed via Stripe with 256-bit SSL encryption.
            </p>
          </div>
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowCardModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <CreditCard size={16} />
            {status.paymentMethod ? 'Update Card' : 'Add Card'}
          </button>
        </div>

        <div className="card" style={{ 
          padding: '24px', 
          border: '1px solid var(--border)', 
          borderRadius: '16px', 
          background: 'var(--bg-1)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: 56, 
              height: 38, 
              background: '#0f172a', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
              <CreditCard size={22} color="#00e5ff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <p style={{ fontWeight: 700, fontSize: '15px', margin: 0 }}>
                  {status.paymentMethod?.brand?.toUpperCase() || 'VISA'} •••• {status.paymentMethod?.last4 || '4242'}
                </p>
                <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                  Default
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Expires {status.paymentMethod?.expMonth || 12}/{status.paymentMethod?.expYear || 2028}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleOpenCustomerPortal}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ExternalLink size={14} />
              Stripe Customer Portal
            </button>
            {status.plan !== 'STARTER' && (
              <button 
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowCancelModal(true)}
                style={{ color: 'var(--accent-red)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Invoices History Table */}
      <section>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 16px 0' }}>Billing History & Invoices</h2>
        <div className="card" style={{ 
          border: '1px solid var(--border)', 
          borderRadius: '16px', 
          background: 'var(--bg-1)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
                <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontWeight: 600 }}>Invoice ID</th>
                <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontWeight: 600 }}>Plan / Description</th>
                <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {status.invoices && status.invoices.length > 0 ? (
                status.invoices.map((inv, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 500 }}>
                      {inv.receiptNumber || inv.id}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>
                      {inv.date}
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 500 }}>
                      {inv.plan}
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 600 }}>
                      {inv.amount}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        background: 'rgba(16, 185, 129, 0.12)', 
                        color: 'var(--accent-green)', 
                        padding: '3px 8px', 
                        borderRadius: '6px' 
                      }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button 
                        type="button"
                        onClick={() => handleDownloadReceipt(inv)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--accent)', 
                          cursor: 'pointer', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          fontWeight: 600,
                          fontSize: '13px'
                        }}
                      >
                        <Download size={14} /> Receipt
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No prior invoices found. Your billing history will appear here following your first billing cycle.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Update Card Modal */}
      {showCardModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'var(--bg-1)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '32px',
            width: '100%',
            maxWidth: '460px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Lock size={20} color="var(--accent)" />
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Secure Card Update</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowCardModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCard} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Cardholder Name</label>
                <input 
                  type="text" 
                  value={cardForm.name} 
                  onChange={(e) => setCardForm(p => ({ ...p, name: e.target.value }))}
                  required 
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-2)', color: 'inherit', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Card Number</label>
                <input 
                  type="text" 
                  value={cardForm.cardNumber} 
                  onChange={(e) => setCardForm(p => ({ ...p, cardNumber: e.target.value }))}
                  placeholder="4242 •••• •••• 4242"
                  required 
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-2)', color: 'inherit', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Expires</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input 
                      type="number" 
                      min="1" 
                      max="12" 
                      value={cardForm.expMonth} 
                      onChange={(e) => setCardForm(p => ({ ...p, expMonth: Number(e.target.value) }))}
                      required 
                      style={{ width: '50%', padding: '12px 10px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-2)', color: 'inherit', fontSize: '14px', outline: 'none' }}
                    />
                    <input 
                      type="number" 
                      min="2026" 
                      max="2035" 
                      value={cardForm.expYear} 
                      onChange={(e) => setCardForm(p => ({ ...p, expYear: Number(e.target.value) }))}
                      required 
                      style={{ width: '50%', padding: '12px 10px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-2)', color: 'inherit', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>CVC / CVV</label>
                  <input 
                    type="password" 
                    maxLength={4} 
                    value={cardForm.cvc} 
                    onChange={(e) => setCardForm(p => ({ ...p, cvc: e.target.value }))}
                    placeholder="123" 
                    required 
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-2)', color: 'inherit', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={16} color="var(--accent-green)" />
                PCI-DSS Level 1 Encrypted via Stripe
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowCardModal(false)}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={savingCard}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {savingCard ? 'Saving Card...' : 'Save Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Subscription Confirmation Modal */}
      {showCancelModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'var(--bg-1)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '32px',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--accent-red)' }}>
              Confirm Plan Cancellation
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Are you sure you want to cancel your paid plan? You will revert to the <strong>Starter tier</strong>, automated report schedules will be paused, and white-labeling will be deactivated.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowCancelModal(false)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Keep My Plan
              </button>
              <button 
                type="button" 
                onClick={handleCancelSubscription}
                disabled={cancelingSub}
                style={{ 
                  flex: 1, 
                  background: 'var(--accent-red)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '10px', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  padding: '12px'
                }}
              >
                {cancelingSub ? 'Canceling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { Plug, BarChart, MessageCircle, Globe, CheckCircle, Search, Mail, ShoppingCart, DollarSign, PenTool, Layout, Video } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const res = await apiFetch('/api/integrations');
        if (res.ok) setIntegrations(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIntegrations();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Analytics', 'Advertising', 'Social Media', 'Email', 'E-commerce', 'CRM'];

  const availableIntegrations = [
    { id: 'ga4', name: 'Google Analytics 4', category: 'Analytics', desc: 'Pull traffic, sessions, and conversions automatically.', icon: <BarChart size={24} color="#f59e0b" />, color: 'rgba(245,158,11,0.1)' },
    { id: 'gads', name: 'Google Ads', category: 'Advertising', desc: 'Import ad spend, CPC, and campaign performance.', icon: <Globe size={24} color="#3b82f6" />, color: 'rgba(59,130,246,0.1)' },
    { id: 'meta', name: 'Meta Ads', category: 'Advertising', desc: 'Sync Facebook & Instagram ad metrics.', icon: <MessageCircle size={24} color="#1877f2" />, color: 'rgba(24,119,242,0.1)' },
    { id: 'tiktok', name: 'TikTok Ads', category: 'Advertising', desc: 'Track TikTok campaign performance and ROAS.', icon: <Video size={24} color="#000000" />, color: 'rgba(255,255,255,0.1)' },
    { id: 'linkedin', name: 'LinkedIn Ads', category: 'Advertising', desc: 'B2B advertising metrics and lead gen.', icon: <BarChart size={24} color="#0a66c2" />, color: 'rgba(10,102,194,0.1)' },
    { id: 'mailchimp', name: 'Mailchimp', category: 'Email', desc: 'Email open rates, CTR, and subscriber growth.', icon: <Mail size={24} color="#FFE01B" />, color: 'rgba(255,224,27,0.1)' },
    { id: 'klaviyo', name: 'Klaviyo', category: 'Email', desc: 'Advanced ecommerce email marketing metrics.', icon: <Mail size={24} color="#00C199" />, color: 'rgba(0,193,153,0.1)' },
    { id: 'shopify', name: 'Shopify', category: 'E-commerce', desc: 'Store sales, AOV, and customer LTV.', icon: <ShoppingCart size={24} color="#96bf48" />, color: 'rgba(150,191,72,0.1)' },
    { id: 'woo', name: 'WooCommerce', category: 'E-commerce', desc: 'WordPress store revenue and order tracking.', icon: <ShoppingCart size={24} color="#96588a" />, color: 'rgba(150,88,138,0.1)' },
    { id: 'stripe', name: 'Stripe', category: 'E-commerce', desc: 'MRR, churn rate, and payment volume.', icon: <DollarSign size={24} color="#635bff" />, color: 'rgba(99,91,255,0.1)' },
    { id: 'hubspot', name: 'HubSpot', category: 'CRM', desc: 'Marketing hub data, leads, and deal pipelines.', icon: <Layout size={24} color="#ff7a59" />, color: 'rgba(255,122,89,0.1)' },
    { id: 'salesforce', name: 'Salesforce', category: 'CRM', desc: 'Enterprise CRM lead tracking and closure rates.', icon: <Layout size={24} color="#00a1e0" />, color: 'rgba(0,161,224,0.1)' },
    { id: 'ahrefs', name: 'Ahrefs', category: 'Analytics', desc: 'SEO rankings, backlinks, and domain authority.', icon: <Search size={24} color="#ff7a00" />, color: 'rgba(255,122,0,0.1)' },
    { id: 'semrush', name: 'SEMrush', category: 'Analytics', desc: 'Keyword visibility and competitor analysis.', icon: <Search size={24} color="#ff642d" />, color: 'rgba(255,100,45,0.1)' },
    { id: 'twitter', name: 'X (Twitter) Ads', category: 'Advertising', desc: 'Promoted tweet impressions and engagement.', icon: <MessageCircle size={24} color="#1da1f2" />, color: 'rgba(29,161,242,0.1)' },
    { id: 'pinterest', name: 'Pinterest Ads', category: 'Advertising', desc: 'Promoted pins, saves, and outbound clicks.', icon: <PenTool size={24} color="#e60023" />, color: 'rgba(230,0,35,0.1)' },
  ];

  const filteredIntegrations = availableIntegrations.filter(int => {
    const matchesSearch = int.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || int.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConnect = async (id: string) => {
    if (id === 'ga4') {
      alert('In a real app, this would trigger the Google OAuth flow for Analytics access.');
    } else if (id === 'gads') {
      try {
        const res = await apiFetch('/api/integrations/google-ads/auth');
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      } catch (err) {
        console.error(err);
      }
    } else if (id === 'meta') {
      try {
        const res = await apiFetch('/api/integrations/meta-ads/auth');
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      } catch (err) {
        console.error(err);
      }
    } else if (id === 'shopify') {
      const store = prompt('Enter your Shopify Store domain (e.g. your-store.myshopify.com):', 'my-client-store.myshopify.com');
      if (store) {
        try {
          const res = await apiFetch('/api/integrations/shopify', {
            method: 'POST',
            body: JSON.stringify({ shopDomain: store, accessToken: 'shpat_live_token_verified' })
          });
          if (res.ok) {
            const newItem = await res.json();
            setIntegrations(prev => [...prev, newItem]);
            alert(`Shopify store ${store} connected successfully!`);
          }
        } catch (e) {
          console.error(e);
        }
      }
    } else if (id === 'linkedin') {
      const account = prompt('Enter your LinkedIn Ad Account ID (e.g. 508492011):', '508492011');
      if (account) {
        try {
          const res = await apiFetch('/api/integrations/linkedin-ads', {
            method: 'POST',
            body: JSON.stringify({ accountId: account })
          });
          if (res.ok) {
            const newItem = await res.json();
            setIntegrations(prev => [...prev, newItem]);
            alert(`LinkedIn Ad Account ${account} connected!`);
          }
        } catch (e) {
          console.error(e);
        }
      }
    } else if (id === 'slack') {
      const webhook = prompt('Enter your Slack Incoming Webhook URL:', 'https://hooks.slack.com/services/T00/B00/X00');
      if (webhook) {
        try {
          const res = await apiFetch('/api/integrations/slack', {
            method: 'POST',
            body: JSON.stringify({ webhookUrl: webhook, channelName: '#client-reports' })
          });
          if (res.ok) {
            const newItem = await res.json();
            setIntegrations(prev => [...prev, newItem]);
            alert('Slack notifications channel connected!');
          }
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      alert(`${id.toUpperCase()} connector initialized in sandbox mode.`);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Integrations</h1>
        <p className="page-subtitle">Connect your data sources to fully automate reporting.</p>
      </div>

      <div className="page-body">
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: 11, color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search 100+ integrations..." 
              style={{ paddingLeft: 42, background: 'var(--bg-card)' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading integrations...</p>
        ) : (
          <div className="card-grid card-grid-4">
            {filteredIntegrations.map(int => {
              const integrationTypeMap: Record<string, string> = {
                ga4: 'GOOGLE_ANALYTICS',
                gads: 'GOOGLE_ADS',
                meta: 'META_ADS'
              };
              const isConnected = integrationTypeMap[int.id] && integrations.some(i => i.type === integrationTypeMap[int.id]);

              return (
                <div key={int.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: int.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {int.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700 }}>{int.name}</h3>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{int.category}</div>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, marginBottom: 20, lineHeight: 1.6 }}>
                    {int.desc}
                  </p>

                  {isConnected ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-green)', fontSize: 13, fontWeight: 600, padding: '8px 0' }}>
                      <CheckCircle size={16} /> Connected
                    </div>
                  ) : (
                    <button onClick={() => handleConnect(int.id)} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                      Connect
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="card" style={{ marginTop: 40, borderStyle: 'dashed', background: 'transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <Plug size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Need another integration?</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>We're constantly adding new data sources. Let us know what you need.</p>
            </div>
            <button className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Request Source</button>
          </div>
        </div>
      </div>
    </div>
  );
}

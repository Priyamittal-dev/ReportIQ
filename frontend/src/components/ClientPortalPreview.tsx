'use client';
import { X, ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  reportSlug: string;
}

export default function ClientPortalPreview({ open, onClose, reportSlug }: Props) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!open) return null;

  const publicUrl = `http://localhost:3000/report/${reportSlug}`;

  const getWidth = () => {
    switch(device) {
      case 'mobile': return 375;
      case 'tablet': return 768;
      default: return '100%';
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999999,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column'
    }}>
      {/* Top Bar */}
      <div style={{ height: 60, background: '#111', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600 }}>Client Portal Simulator</h2>
          <div style={{ display: 'flex', background: '#222', padding: 4, borderRadius: 8, gap: 4 }}>
            <button onClick={() => setDevice('desktop')} style={{ background: device === 'desktop' ? '#444' : 'transparent', border: 'none', color: 'white', padding: 6, borderRadius: 6, cursor: 'pointer' }}><Monitor size={16} /></button>
            <button onClick={() => setDevice('tablet')} style={{ background: device === 'tablet' ? '#444' : 'transparent', border: 'none', color: 'white', padding: 6, borderRadius: 6, cursor: 'pointer' }}><Tablet size={16} /></button>
            <button onClick={() => setDevice('mobile')} style={{ background: device === 'mobile' ? '#444' : 'transparent', border: 'none', color: 'white', padding: 6, borderRadius: 6, cursor: 'pointer' }}><Smartphone size={16} /></button>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href={publicUrl} target="_blank" rel="noreferrer" style={{ color: '#aaa', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ExternalLink size={14} /> Open in new tab
          </a>
          <button onClick={onClose} style={{ background: '#333', border: 'none', color: 'white', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, overflow: 'hidden' }}>
        <div style={{ 
          width: getWidth(), 
          height: '100%', 
          background: 'white', 
          borderRadius: device === 'desktop' ? 8 : 24, 
          overflow: 'hidden',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: device === 'desktop' ? 'none' : '12px solid #222'
        }}>
          {reportSlug ? (
            <iframe 
              src={publicUrl} 
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Client Portal Preview"
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
              No report slug provided.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

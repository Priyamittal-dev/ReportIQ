'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, Users, Plug, Settings, BarChart3, CreditCard, Zap, Shield, ArrowRight } from 'lucide-react';

const COMMANDS = [
  { id: 'dash', label: 'Dashboard Overview', icon: BarChart3, href: '/dashboard', category: 'Navigate' },
  { id: 'clients', label: 'Clients', icon: Users, href: '/dashboard/clients', category: 'Navigate' },
  { id: 'reports', label: 'Reports', icon: FileText, href: '/dashboard/reports', category: 'Navigate' },
  { id: 'integrations', label: 'Integrations', icon: Plug, href: '/dashboard/integrations', category: 'Navigate' },
  { id: 'billing', label: 'Billing & Plans', icon: CreditCard, href: '/dashboard/billing', category: 'Navigate' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings', category: 'Navigate' },
  { id: 'admin', label: 'Admin Panel', icon: Shield, href: '/admin', category: 'Navigate' },
  { id: 'gen-report', label: 'Generate New Report', icon: Zap, href: '/dashboard/reports/generate', category: 'Actions' },
  { id: 'add-client', label: 'Add New Client', icon: Users, href: '/dashboard/clients?action=new', category: 'Actions' },
  { id: 'ai-chat', label: 'Open AI Assistant', icon: Zap, href: '/dashboard/chat', category: 'Actions' },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase())
  );

  const grouped = ['Navigate', 'Actions'].reduce((acc, cat) => {
    const items = filtered.filter(c => c.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {} as Record<string, typeof COMMANDS>);

  const flatFiltered = filtered;

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelected(s => Math.min(s + 1, flatFiltered.length - 1));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setSelected(s => Math.max(s - 1, 0));
      e.preventDefault();
    } else if (e.key === 'Enter' && flatFiltered[selected]) {
      handleSelect(flatFiltered[selected].href);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '12vh',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: 560,
          background: 'var(--bg-1)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          animation: 'palette-in 0.18s cubic-bezier(.175,.885,.32,1.275)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
          <Search size={20} color="var(--text-muted)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 16 }}
          />
          <kbd style={{ padding: '3px 7px', borderRadius: 6, background: 'var(--bg-2)', border: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)' }}>ESC</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 380, overflowY: 'auto', padding: '8px 0' }}>
          {Object.keys(grouped).length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              No commands found
            </div>
          ) : (
            Object.entries(grouped).map(([cat, items]) => {
              let globalIdx = flatFiltered.indexOf(items[0]);
              return (
                <div key={cat}>
                  <div style={{ padding: '8px 20px 4px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                    {cat}
                  </div>
                  {items.map((item, localIdx) => {
                    const idx = flatFiltered.indexOf(item);
                    const isSelected = selected === idx;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.href)}
                        onMouseEnter={() => setSelected(idx)}
                        style={{
                          width: '100%',
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '12px 20px',
                          border: 'none', cursor: 'pointer',
                          background: isSelected ? 'rgba(138,43,226,0.12)' : 'transparent',
                          color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                          textAlign: 'left',
                          transition: 'all 0.1s',
                        }}
                      >
                        <div style={{
                          width: 34, height: 34, borderRadius: 10,
                          background: isSelected ? 'rgba(138,43,226,0.15)' : 'var(--bg-2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <item.icon size={16} />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                        {isSelected && <ArrowRight size={16} style={{ marginLeft: 'auto' }} />}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 16 }}>
          {[['↑↓', 'Navigate'], ['↵', 'Select'], ['Esc', 'Close']].map(([key, desc]) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
              <kbd style={{ padding: '2px 6px', borderRadius: 4, background: 'var(--bg-2)', border: '1px solid var(--border)', fontSize: 11 }}>{key}</kbd>
              {desc}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes palette-in {
          from { opacity: 0; transform: translateY(-16px) scale(0.97); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

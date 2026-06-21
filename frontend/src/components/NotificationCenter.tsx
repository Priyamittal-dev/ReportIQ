'use client';
import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, Zap, Users, Plug, CreditCard, X, Check } from 'lucide-react';

interface Notification {
  id: string;
  type: 'report' | 'client' | 'integration' | 'billing' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const TYPE_CONFIG = {
  report: { icon: Zap, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  client: { icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  integration: { icon: Plug, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  billing: { icon: CreditCard, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  system: { icon: CheckCircle, color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
};

function timeAgo(isoStr: string) {
  const diff = (Date.now() - new Date(isoStr).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const STORAGE_KEY = 'riq_notifications';

const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'system', title: 'Welcome to ReportIQ!', body: 'Start by adding your first client and generating a report.', time: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false },
  { id: '2', type: 'report', title: 'Report Ready', body: 'Your AI-generated report is ready to review and send.', time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false },
];

export function useNotifications() {
  const getNotifications = (): Notification[] => {
    if (typeof window === 'undefined') return DEFAULT_NOTIFICATIONS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS;
    } catch { return DEFAULT_NOTIFICATIONS; }
  };

  const addNotification = (n: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const notifs = getNotifications();
    const newNotif: Notification = { ...n, id: Date.now().toString(), time: new Date().toISOString(), read: false };
    const updated = [newNotif, ...notifs].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('riq-notification'));
  };

  return { getNotifications, addNotification };
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const load = () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setNotifications(stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS);
    } catch { setNotifications(DEFAULT_NOTIFICATIONS); }
  };

  useEffect(() => {
    load();
    window.addEventListener('riq-notification', load);
    return () => window.removeEventListener('riq-notification', load);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const markRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const dismiss = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      <button
        onClick={() => { setOpen(o => !o); if (!open) load(); }}
        style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'var(--bg-2)', border: '1px solid var(--border)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-secondary)', position: 'relative', transition: 'all 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: '#ef4444', color: 'white',
            borderRadius: '50%', width: 18, height: 18,
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--bg-0)',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '120%',
          width: 360, maxHeight: 480,
          background: 'var(--bg-1)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          overflow: 'hidden',
          zIndex: 1000,
          animation: 'notif-in 0.18s ease-out',
        }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Notifications</h3>
              {unreadCount > 0 && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{unreadCount} unread</p>}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Check size={14} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', maxHeight: 400 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                <Bell size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => {
                const cfg = TYPE_CONFIG[n.type];
                return (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    style={{
                      display: 'flex', gap: 12, padding: '14px 20px',
                      borderBottom: '1px solid var(--border)',
                      background: n.read ? 'transparent' : 'rgba(138,43,226,0.04)',
                      cursor: 'pointer', position: 'relative',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-2)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = n.read ? 'transparent' : 'rgba(138,43,226,0.04)'}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <cfg.icon size={16} color={cfg.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: n.read ? 500 : 700, color: 'var(--text-primary)' }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>{n.body}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{timeAgo(n.time)}</div>
                    </div>
                    {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 4 }} />}
                    <button
                      onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                      style={{ position: 'absolute', top: 10, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', opacity: 0, transition: 'opacity 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0'}
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes notif-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

'use client';
import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Sparkles, Loader2, ChevronDown } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  'Generate a report summary',
  'How do I add a client?',
  'What integrations are available?',
  'How to schedule reports?',
];

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n• /g, '<br/>• ')
    .replace(/\n(\d+)\. /g, '<br/>$1. ')
    .replace(/\\n/g, '<br/>');
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! 👋 I'm your ReportIQ AI assistant. How can I help you right now?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!open) {
      // Count messages after initial greeting
      const newAssistantMsgs = messages.filter(m => m.role === 'assistant').length - 1;
      setUnreadCount(newAssistantMsgs > 0 ? newAssistantMsgs : 0);
    } else {
      setUnreadCount(0);
    }
  }, [open, messages]);

  const handleSend = async (text?: string) => {
    const msgText = text || input;
    if (!msgText.trim() || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msgText }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('riq_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: msgText }),
      });

      if (res.ok) {
        let data = await res.text();
        try { data = JSON.parse(data); } catch { }
        setMessages(prev => [...prev, { role: 'assistant', content: typeof data === 'string' ? data : JSON.stringify(data) }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't reach the AI service. Please try again." }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 8px 32px rgba(139,92,246,0.5)',
            zIndex: 9999,
            transition: 'all 0.3s cubic-bezier(.175,.885,.32,1.275)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.12)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          title="Open AI Assistant"
        >
          <Bot size={26} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: -2, right: -2,
              background: '#ef4444', color: 'white',
              borderRadius: '50%', width: 20, height: 20,
              fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--bg-0)',
            }}>
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            width: 380,
            height: minimized ? 64 : 560,
            borderRadius: 20,
            background: 'var(--bg-1)',
            border: '1px solid var(--border)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 9999,
            transition: 'height 0.3s cubic-bezier(.175,.885,.32,1.275)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>ReportIQ AI</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} /> Online
              </div>
            </div>
            <button onClick={() => setMinimized(m => !m)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4, opacity: 0.75 }}>
              <ChevronDown size={18} style={{ transform: minimized ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4, opacity: 0.75 }}>
              <X size={18} />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-end',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    maxWidth: '90%',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}>
                    {msg.role === 'assistant' && (
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Bot size={14} color="white" />
                      </div>
                    )}
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-2)',
                      color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                      border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                      fontSize: 13,
                      lineHeight: 1.6,
                    }}
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                    />
                  </div>
                ))}

                {loading && (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={14} color="white" />
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: '14px 14px 14px 4px', background: 'var(--bg-2)', border: '1px solid var(--border)', display: 'flex', gap: 4 }}>
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block', animation: `chatdot 1.2s ${delay}s ease-in-out infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts (only at start) */}
              {messages.length <= 1 && (
                <div style={{ padding: '0 16px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {QUICK_PROMPTS.map((p, i) => (
                    <button key={i} onClick={() => handleSend(p)} style={{
                      padding: '6px 12px', borderRadius: 20, border: '1px solid var(--border)',
                      background: 'var(--bg-0)', color: 'var(--text-secondary)', cursor: 'pointer',
                      fontSize: 12, transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div style={{ padding: '10px 16px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--bg-0)', borderRadius: 12, border: '1px solid var(--border)', padding: '6px 6px 6px 14px' }}>
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything..."
                    disabled={loading}
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13 }}
                  />
                  <button onClick={() => handleSend()} disabled={loading || !input.trim()} style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: input.trim() ? 'var(--accent)' : 'var(--bg-2)',
                    border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                    transition: 'all 0.2s',
                  }}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes chatdot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}

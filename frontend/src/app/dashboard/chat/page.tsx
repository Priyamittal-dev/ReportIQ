'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, MessageSquare, Zap, BarChart3, Target } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { icon: <BarChart3 size={16} />, text: 'How do I create a report?' },
  { icon: <Target size={16} />, text: 'Tips for improving conversion rates' },
  { icon: <Zap size={16} />, text: 'How to connect Google Ads?' },
  { icon: <MessageSquare size={16} />, text: 'What SEO metrics should I track?' },
];

function renderMarkdown(text: string) {
  // Simple markdown renderer for bold, bullets, numbered lists, newlines
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n• /g, '<br/>• ')
    .replace(/\n(\d+)\. /g, '<br/>$1. ')
    .replace(/\\n/g, '<br/>');
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! 👋 I\'m your ReportIQ AI assistant. I can help you with creating reports, marketing strategy, data analysis, and navigating the platform. What would you like help with?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || loading) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('riq_token')}`
        },
        body: JSON.stringify({ message: text })
      });
      
      if (res.ok) {
        const data = await res.text();
        // Clean up JSON wrapping if present
        let cleanData = data;
        try { cleanData = JSON.parse(data); } catch {}
        setMessages(prev => [...prev, { role: 'assistant', content: typeof cleanData === 'string' ? cleanData : JSON.stringify(cleanData) }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't reach the AI service right now. Please try again." }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "An error occurred while connecting to the AI." }]);
    } finally {
      setLoading(false);
    }
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', background: 'var(--bg-0)' }}>
      
      {/* Header */}
      <div style={{ padding: '24px 40px', borderBottom: '1px solid var(--border)', background: 'var(--bg-1)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={22} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>ReportIQ AI Assistant</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Powered by GPT-4o • Always available</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
          <span style={{ fontSize: 13, color: '#10b981', fontWeight: 500 }}>Online</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            maxWidth: '85%',
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: msg.role === 'user' ? 'var(--accent)' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0,
            }}>
              {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div style={{
              padding: '14px 18px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-1)',
              color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
              fontSize: 15,
              lineHeight: 1.7,
            }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
            />
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            }}>
              <Bot size={18} />
            </div>
            <div style={{
              padding: '16px 24px', borderRadius: '16px 16px 16px 4px',
              background: 'var(--bg-1)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <div className="typing-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1.4s infinite ease-in-out' }} />
              <div className="typing-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1.4s 0.2s infinite ease-in-out' }} />
              <div className="typing-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1.4s 0.4s infinite ease-in-out' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      {showSuggestions && (
        <div style={{ padding: '0 40px 16px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {SUGGESTED_PROMPTS.map((p, i) => (
            <button key={i} onClick={() => handleSend(p.text)}
              style={{
                padding: '10px 16px', borderRadius: 12, border: '1px solid var(--border)',
                background: 'var(--bg-1)', color: 'var(--text-secondary)', cursor: 'pointer',
                fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'var(--accent)'; (e.target as HTMLElement).style.color = 'var(--accent)'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--border)'; (e.target as HTMLElement).style.color = 'var(--text-secondary)'; }}
            >
              {p.icon} {p.text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '16px 40px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-1)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg-0)', borderRadius: 16, border: '1px solid var(--border)', padding: '4px 4px 4px 20px' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask me about reports, marketing strategy, SEO..."
            disabled={loading}
            style={{ flex: 1, padding: '14px 0', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: 15, outline: 'none' }}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            style={{
              width: 48, height: 48, borderRadius: 12,
              background: input.trim() ? 'var(--accent)' : 'var(--bg-2)',
              border: 'none', cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', transition: 'all 0.2s',
            }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

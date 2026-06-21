'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, MessageSquare, Zap, BarChart3, Target, ChevronDown, X, Download, Trash2 } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { icon: <BarChart3 size={16} />, text: 'Analyze this client\'s performance and suggest improvements' },
  { icon: <Target size={16} />, text: 'What are the best strategies to improve conversion rates?' },
  { icon: <Zap size={16} />, text: 'How do I automate my monthly reporting workflow?' },
  { icon: <MessageSquare size={16} />, text: 'What SEO metrics should I track for an e-commerce client?' },
];

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:var(--bg-2);padding:1px 5px;border-radius:4px;font-size:0.9em">$1</code>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n• /g, '<br/>• ')
    .replace(/\n(\d+)\. /g, '<br/>$1. ')
    .replace(/\\n/g, '<br/>');
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! 👋 I\'m your ReportIQ AI assistant. I can help you with creating reports, marketing strategy, data analysis, and navigating the platform.\n\n**Pro Tip:** Select a client from the dropdown above to get context-aware analysis of their specific data!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem('riq_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/clients`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => setClients(Array.isArray(data) ? data : data?.data || []))
      .catch(() => {});
  }, []);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || loading) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    // Build context-aware message
    let contextMessage = text;
    if (selectedClient) {
      contextMessage = `[Context: Analyzing data for client "${selectedClient.name}" (website: ${selectedClient.website || 'N/A'}, notes: ${selectedClient.notes || 'none'})]\n\nUser question: ${text}`;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('riq_token')}`
        },
        body: JSON.stringify({ message: contextMessage })
      });

      if (res.ok) {
        const data = await res.text();
        let cleanData = data;
        try { cleanData = JSON.parse(data); } catch { }
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

  const exportChat = () => {
    const text = messages.map(m => `${m.role === 'user' ? 'You' : 'ReportIQ AI'}: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reportiq-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    if (confirm('Clear the conversation?')) {
      setMessages([{ role: 'assistant', content: 'Hello! 👋 How can I help you today?' }]);
    }
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', background: 'var(--bg-0)' }}>

      {/* Header */}
      <div style={{ padding: '20px 40px', borderBottom: '1px solid var(--border)', background: 'var(--bg-1)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={22} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>ReportIQ AI Assistant</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Powered by GPT-4o • Context-aware analysis</p>
        </div>

        {/* Client Context Selector */}
        <div style={{ position: 'relative' }}>
          <select
            value={selectedClient?.id || ''}
            onChange={e => {
              const client = clients.find(c => c.id === e.target.value);
              setSelectedClient(client || null);
              if (client) {
                setMessages(prev => [...prev, {
                  role: 'assistant',
                  content: `🎯 **Context set to: ${client.name}**\nI now have context about this client. Ask me anything specific to their performance, strategy, or goals!`
                }]);
              }
            }}
            style={{
              padding: '9px 36px 9px 14px',
              borderRadius: 10,
              border: `1px solid ${selectedClient ? 'var(--accent)' : 'var(--border)'}`,
              background: 'var(--bg-2)',
              color: selectedClient ? 'var(--accent)' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: 500,
              cursor: 'pointer', outline: 'none',
              appearance: 'none',
            }}
          >
            <option value="">🌐 No client context</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>🎯 {c.name}</option>
            ))}
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
        </div>

        {/* Actions */}
        <button onClick={exportChat} title="Export chat" style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          <Download size={16} />
        </button>
        <button onClick={clearChat} title="Clear chat" style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          <Trash2 size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
            maxWidth: '80%',
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: msg.role === 'user' ? 'var(--accent)' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', flexShrink: 0,
            }}>
              {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div style={{
              padding: '14px 18px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-1)',
              color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
              fontSize: 15, lineHeight: 1.7,
            }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
            />
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Bot size={18} />
            </div>
            <div style={{ padding: '16px 24px', borderRadius: '16px 16px 16px 4px', background: 'var(--bg-1)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
              {[0, 0.2, 0.4].map((delay, i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-muted)', animation: `pulse ${1.4 + delay}s ${delay}s infinite ease-in-out` }} />
              ))}
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
                fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
            >
              {p.icon} {p.text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '16px 40px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-1)' }}>
        {selectedClient && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '6px 12px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 8, width: 'fit-content' }}>
            <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>🎯 Context: {selectedClient.name}</span>
            <button onClick={() => setSelectedClient(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <X size={12} />
            </button>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg-0)', borderRadius: 16, border: '1px solid var(--border)', padding: '4px 4px 4px 20px', transition: 'border-color 0.2s' }}
          onFocusCapture={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
          onBlurCapture={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={selectedClient ? `Ask about ${selectedClient.name}...` : "Ask me about reports, marketing strategy, SEO..."}
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
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
          AI responses may contain inaccuracies. Verify important information. Press Enter to send.
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

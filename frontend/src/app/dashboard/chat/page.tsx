'use client';
import { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am ReportIQ AI. How can I help you analyze your data today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: userMessage })
      });
      
      if (res.ok) {
        const data = await res.text();
        setMessages(prev => [...prev, { role: 'assistant', content: data }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't reach the AI service right now." }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "An error occurred while connecting to the AI." }]);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '20px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Sparkles color="var(--accent)" />
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>ReportIQ AI Assistant</h1>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Bot size={20} />
              </div>
            )}
            <div style={{ padding: '12px 16px', borderRadius: '12px', background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-1)', color: msg.role === 'user' ? 'white' : 'var(--text-primary)', border: msg.role === 'user' ? 'none' : '1px solid var(--border)' }}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                <User size={20} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', padding: '20px 0', borderTop: '1px solid var(--border)' }}>
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything about your analytics..."
          style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-1)', color: 'var(--text-primary)' }}
        />
        <button onClick={handleSend} className="btn btn-primary" style={{ padding: '0 20px' }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';

export default function BookDemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    teamSize: '11-50',
    date: '2026-09-02',
    timeSlot: '03:00 PM - 03:30 PM (EST)',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsApp = () => {
    const msg = `Hi Priyanka! I booked a ReportIQ Demo from the website:

• Name: ${formData.name}
• Company: ${formData.company}
• Team Size: ${formData.teamSize}
• Date: ${formData.date}
• Time Slot: ${formData.timeSlot}`;
    window.open(`https://wa.me/918708095922?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-0)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: 24 }}>
          <ArrowLeft size={16} />
          <span>Back to ReportIQ Home</span>
        </Link>

        <div className="card" style={{ padding: 36 }}>
          {!submitted ? (
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(138,43,226,0.1)', color: 'var(--accent)', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                <Sparkles size={14} />
                <span>Personalized Walkthrough</span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 8px' }}>
                Book Your ReportIQ Product Demo
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 24px', lineHeight: 1.5 }}>
                Meet with our engineering team to explore automated time tracking, silent desktop agents, and custom payroll rules.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Work Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@company.com"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Company Name</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Studio"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13 }}
                  />
                </div>

                <button type="submit" className="btn btn-gradient btn-lg" style={{ width: '100%', marginTop: 10, justifyContent: 'center' }}>
                  Schedule 30-Min Demo
                </button>
              </form>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,212,142,0.15)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Demo Confirmed!</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
                Calendar invitation has been dispatched to <strong>{formData.email}</strong>.
              </p>
              <button onClick={handleWhatsApp} className="btn btn-primary" style={{ background: '#10b981', borderColor: '#10b981', gap: 6, margin: '10px auto 0' }}>
                <MessageSquare size={16} />
                <span>Notify Priyanka on WhatsApp (+91 8708095922)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

'use client';
import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookDemoModal({ isOpen, onClose }: BookDemoModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    teamSize: '11-50',
    date: '2026-09-02',
    timeSlot: '03:00 PM - 03:30 PM (EST)',
  });

  if (!isOpen) return null;

  const timeSlots = [
    '10:00 AM - 10:30 AM (EST)',
    '11:30 AM - 12:00 PM (EST)',
    '02:00 PM - 02:30 PM (EST)',
    '03:30 PM - 04:00 PM (EST)',
    '05:00 PM - 05:30 PM (EST)'
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handleWhatsAppNotify = () => {
    const msg = `Hi Priyanka! I scheduled a ReportIQ product demo:

• Name: ${formData.name}
• Company: ${formData.company}
• Team Size: ${formData.teamSize}
• Date: ${formData.date}
• Time Slot: ${formData.timeSlot}

Looking forward to the walkthrough!`;
    window.open(`https://wa.me/918708095922?text=${encodeURIComponent(msg)}`, '_blank');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10, 15, 26, 0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        background: 'var(--bg-1)', border: '1px solid var(--border)',
        borderRadius: 24, width: '100%', maxWidth: 540, padding: 32,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 20, background: 'var(--bg-2)',
            border: 'none', borderRadius: '50%', width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)', cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {step < 3 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 999, background: 'rgba(138,43,226,0.1)',
              color: 'var(--accent)', fontSize: 12, fontWeight: 700, marginBottom: 8
            }}>
              <Sparkles size={14} />
              <span>ReportIQ Demo • Step {step} of 2</span>
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
              {step === 1 ? 'Book a 1-on-1 Personalized Demo' : 'Select Date & Time Slot'}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
              {step === 1 ? 'See automated time tracking, focus scoring, and client payroll reports live.' : 'Choose a time with our systems architect.'}
            </p>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                  placeholder="e.g. Acme Agency"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Team Size</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {['1-10', '11-50', '51-200', '200+'].map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setFormData({ ...formData, teamSize: size })}
                    style={{
                      padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      background: formData.teamSize === size ? 'var(--accent)' : 'var(--bg-2)',
                      color: formData.teamSize === size ? '#fff' : 'var(--text-secondary)',
                      border: formData.teamSize === size ? '1px solid var(--accent)' : '1px solid var(--border)',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-gradient" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}>
              <span>Select Date & Time</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Available 30-Min Time Slots (EST)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {timeSlots.map((slot) => (
                  <div
                    key={slot}
                    onClick={() => setFormData({ ...formData, timeSlot: slot })}
                    style={{
                      padding: '10px 14px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: formData.timeSlot === slot ? 'rgba(138,43,226,0.1)' : 'var(--bg-2)',
                      border: formData.timeSlot === slot ? '1px solid var(--accent)' : '1px solid var(--border)',
                      color: formData.timeSlot === slot ? 'var(--accent)' : 'var(--text-secondary)',
                      fontSize: 12, fontWeight: formData.timeSlot === slot ? 700 : 500
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Clock size={14} />
                      <span>{slot}</span>
                    </div>
                    {formData.timeSlot === slot && <CheckCircle2 size={16} color="var(--accent)" />}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ width: '35%', justifyContent: 'center' }}>
                Back
              </button>
              <button type="submit" className="btn btn-gradient" style={{ width: '65%', justifyContent: 'center' }}>
                <CheckCircle2 size={16} />
                <span>Confirm Demo Booking</span>
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,212,142,0.15)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Demo Reserved!</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Your 1-on-1 ReportIQ live session for <strong>{formData.name}</strong> ({formData.company}) is scheduled on <strong>{formData.date}</strong> at <strong>{formData.timeSlot}</strong>.
            </p>

            <div style={{ padding: 14, borderRadius: 12, background: 'var(--bg-2)', border: '1px solid var(--border)', textAlign: 'left', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: 'var(--font-mono)' }}>
              <div>• <strong>Host:</strong> Priyanka Mittal (Full-Stack & Systems Lead)</div>
              <div>• <strong>Meeting Link:</strong> Sent to {formData.email}</div>
              <div>• <strong>Agenda:</strong> Automated timesheets, idle timeouts, and ROI recovery</div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={handleWhatsAppNotify} className="btn btn-primary" style={{ background: '#10b981', borderColor: '#10b981', gap: 6 }}>
                <MessageSquare size={16} />
                <span>Confirm on WhatsApp</span>
              </button>
              <button onClick={onClose} className="btn btn-secondary">Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

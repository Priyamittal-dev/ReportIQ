'use client';
import { useState, useEffect } from 'react';
import { Users, Mail, Shield, UserPlus, Trash2 } from 'lucide-react';

export default function TeamManagementPage() {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Rahul Garg', email: 'gargr0109@gmail.com', role: 'Owner', status: 'Active' }
  ]);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Editor');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    
    setTeamMembers(prev => [...prev, {
      id: Date.now(),
      name: 'Pending Invite',
      email: newEmail,
      role: newRole,
      status: 'Pending'
    }]);
    setNewEmail('');
    
    // Simulating backend request
    alert(`Invitation sent to ${newEmail} as ${newRole}.`);
  };

  const removeMember = (id: number) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users color="var(--accent)" /> Team Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Manage your agency's team members and their roles.</p>
        </div>
      </header>

      {/* Invite Form */}
      <div className="card" style={{ padding: '24px', marginBottom: '40px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-1)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={20} /> Invite New Member
        </h3>
        <form onSubmit={handleInvite} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="colleague@agency.com" 
                style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-0)', color: 'var(--text-primary)' }}
                required
              />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Role</label>
            <div style={{ position: 'relative' }}>
              <Shield size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
              <select 
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                style={{ width: '100%', padding: '11px 10px 11px 40px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-0)', color: 'var(--text-primary)' }}
              >
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '44px' }}>Send Invite</button>
        </form>
      </div>

      {/* Team List */}
      <div className="card" style={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-2)' }}>
            <tr>
              <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Member</th>
              <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Role</th>
              <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map(member => (
              <tr key={member.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 500 }}>{member.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{member.email}</div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ padding: '4px 12px', background: 'var(--bg-2)', borderRadius: '12px', fontSize: '12px', fontWeight: 500 }}>
                    {member.role}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: member.status === 'Active' ? 'var(--accent-green)' : '#f59e0b' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: member.status === 'Active' ? 'var(--accent-green)' : '#f59e0b' }}></span>
                    {member.status}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  {member.role !== 'Owner' && (
                    <button onClick={() => removeMember(member.id)} style={{ padding: '8px', color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-0)' }}>
      {children}
    </div>
  );
}

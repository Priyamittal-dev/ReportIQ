import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { LanguageProvider } from '@/components/providers/LanguageProvider';

export const metadata: Metadata = {
  title: 'ReportIQ — AI-Powered Client Reporting for Agencies',
  description: 'Automate your client reporting with AI. Connect Google Analytics, generate branded reports, and email them automatically. Save 6–8 hours per week.',
  keywords: 'client reporting, agency reports, AI reports, Google Analytics, automated reporting',
  openGraph: {
    title: 'ReportIQ — AI Client Reporting',
    description: 'Automate client reporting with AI summaries, PDF exports, and scheduled delivery.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
          <Toaster 
            position="bottom-right" 
            theme="dark" 
            toastOptions={{
              style: {
                background: 'rgba(15,22,40,0.8)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(138,43,226,0.2)',
                color: '#fff',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              }
            }} 
          />
        </LanguageProvider>
      </body>
    </html>
  );
}

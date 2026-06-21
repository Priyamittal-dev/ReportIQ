import type { Metadata } from 'next';
import './globals.css';
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
        </LanguageProvider>
      </body>
    </html>
  );
}

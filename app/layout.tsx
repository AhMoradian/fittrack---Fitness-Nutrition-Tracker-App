import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BottomNav } from '@/components/bottom-nav';

export const metadata: Metadata = {
  title: 'FitTrack AI Ready Fitness Tracker',
  description: 'A mobile-first fitness, nutrition, recovery, and habit tracker built on a unified task architecture.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#22c55e',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <main className="mx-auto min-h-screen max-w-md safe-bottom md:max-w-5xl">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}

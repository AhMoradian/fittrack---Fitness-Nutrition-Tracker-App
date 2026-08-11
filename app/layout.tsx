import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BottomNav } from '@/components/bottom-nav';
import { AppMotion } from '@/components/app-motion';
import { FitTrackProvider } from '@/lib/fittrack-store';

export const metadata: Metadata = {
  title: 'FitTrack Personal Fitness Tracker',
  description: 'A private, single-user fitness, nutrition, recovery, and habit tracker.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#007173',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen font-sans">
        <FitTrackProvider>
          <BottomNav />
          <main className="mx-auto min-h-screen w-full max-w-md safe-bottom md:max-w-6xl">
            <AppMotion>{children}</AppMotion>
          </main>
        </FitTrackProvider>
      </body>
    </html>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Dumbbell, LineChart, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/', label: 'Today', icon: CalendarDays },
  { href: '/weekly-plan', label: 'Weekly Plan', icon: Dumbbell },
  { href: '/progress', label: 'Progress', icon: LineChart },
  { href: '/profile', label: 'Profile', icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/90 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={cn('flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold text-muted-foreground transition', active && 'bg-green-100 text-green-700')}>
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <nav className="sticky top-0 z-40 hidden border-b bg-white/80 px-8 py-3 backdrop-blur md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="text-lg font-black text-green-700">FitTrack</Link>
          <div className="flex gap-2">
            {items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={cn('flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-muted-foreground transition hover:bg-green-50 hover:text-green-700', active && 'bg-green-100 text-green-700')}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

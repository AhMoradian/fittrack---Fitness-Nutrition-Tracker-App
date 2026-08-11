'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  CalendarCheck2,
  CalendarDays,
  Dumbbell,
  LineChart,
  UserRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FitTrackLogo } from '@/components/app-shell';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

const items = [
  { href: '/', label: 'Today', icon: CalendarDays },
  { href: '/weekly-plan', label: 'Weekly Plan', icon: Dumbbell },
  { href: '/check-in', label: 'Check-in', icon: CalendarCheck2 },
  { href: '/progress', label: 'Progress', icon: LineChart },
  { href: '/profile', label: 'Profile', icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();
  const navRootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = navRootRef.current;
      if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const activeLinks = root.querySelectorAll<HTMLElement>('[data-nav-active="true"]');
      const activeIcons = root.querySelectorAll<SVGElement>('[data-nav-active="true"] [data-nav-icon]');
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .fromTo(activeLinks, { scale: 0.92 }, { scale: 1, duration: 0.35 })
        .fromTo(
          activeIcons,
          { y: 3, rotation: -8, scale: 0.85 },
          { y: 0, rotation: 0, scale: 1, duration: 0.42, stagger: 0.03 },
          '<',
        );
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div ref={navRootRef} className="contents">
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/90 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} data-nav-active={active} className={cn('flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold text-muted-foreground transition', active && 'bg-teal-100 text-teal-800')}>
                <Icon className="h-5 w-5" data-nav-icon />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <nav className="sticky top-0 z-40 hidden border-b bg-white/80 px-8 py-3 backdrop-blur md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <FitTrackLogo />
          <div className="flex gap-2">
            {items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} data-nav-active={active} className={cn('flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-muted-foreground transition hover:bg-teal-50 hover:text-teal-800', active && 'bg-teal-100 text-teal-800')}>
                  <Icon className="h-4 w-4" data-nav-icon />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

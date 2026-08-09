'use client';

import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

export function AppMotion({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const isDesktop = window.matchMedia('(min-width: 768px)').matches;
      const headerParts = root.querySelectorAll<HTMLElement>(
        '[data-motion-header-part]',
      );

      if (!headerParts.length) return;

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(
          headerParts,
          { autoAlpha: 0, y: isDesktop ? 20 : 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: isDesktop ? 0.65 : 0.48,
            stagger: isDesktop ? 0.07 : 0.045,
            clearProps: 'transform,opacity,visibility',
          },
        );
    },
    { scope: rootRef, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} key={pathname} className="min-h-screen">
      {children}
    </div>
  );
}

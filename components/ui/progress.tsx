'use client';

import { useRef } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

export function Progress({ value = 0, className, indicatorClassName }: { value?: number; className?: string; indicatorClassName?: string }) {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const clamped = Math.min(100, Math.max(0, value));

  useGSAP(
    () => {
      const indicator = indicatorRef.current;
      if (!indicator) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.fromTo(
        indicator,
        { xPercent: -100 },
        { xPercent: clamped - 100, duration: 0.7, ease: 'power3.out' },
      );
    },
    { dependencies: [clamped], revertOnUpdate: true },
  );

  return (
    <ProgressPrimitive.Root value={clamped} className={cn('relative h-3 w-full overflow-hidden rounded-full bg-secondary', className)}>
      <ProgressPrimitive.Indicator
        ref={indicatorRef}
        className={cn('h-full rounded-full bg-primary', indicatorClassName)}
        style={{ transform: `translateX(${clamped - 100}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

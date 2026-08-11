'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

export function ProgressRing({ value, label, className }: { value: number; label?: string; className?: string }) {
  const clamped = Math.min(100, Math.max(0, value));
  const ringRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ring = ringRef.current;
      const valueElement = valueRef.current;
      if (!ring || !valueElement) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        valueElement.textContent = `${clamped}%`;
        return;
      }

      const counter = { value: 0 };
      const timeline = gsap.timeline({ defaults: { duration: 0.9, ease: 'power3.out' } });

      timeline
        .fromTo(
          ring,
          { '--progress-angle': '0deg', rotation: -4, scale: 0.94 },
          {
            '--progress-angle': `${clamped * 3.6}deg`,
            rotation: 0,
            scale: 1,
          },
          0,
        )
        .to(
          counter,
          {
            value: clamped,
            onUpdate: () => {
              valueElement.textContent = `${Math.round(counter.value)}%`;
            },
          },
          0,
        );
    },
    { dependencies: [clamped], revertOnUpdate: true },
  );

  return (
    <div className={cn('relative grid place-items-center', className)}>
      <div
        ref={ringRef}
        className="grid h-28 w-28 place-items-center rounded-full shadow-inner"
        style={{
          '--progress-angle': `${clamped * 3.6}deg`,
          background: 'conic-gradient(#007173 var(--progress-angle), #e2e8f0 0deg)',
        } as React.CSSProperties}
      >
        <div className="grid h-20 w-20 place-items-center rounded-full bg-white">
          <div className="text-center">
            <div ref={valueRef} className="text-2xl font-black">{clamped}%</div>
            {label ? <div className="text-[10px] font-bold uppercase text-muted-foreground">{label}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useFitTrack } from '@/lib/fittrack-store';

const MINIMUM_VISIBLE_MS = 500;

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

export function AppLoadingOverlay() {
  const { ready } = useFitTrack();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const shouldExit = ready && minimumElapsed;

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setMinimumElapsed(true),
      MINIMUM_VISIBLE_MS,
    );
    return () => window.clearTimeout(timeout);
  }, []);

  useGSAP(
    () => {
      const overlay = overlayRef.current;
      if (!overlay) return;

      const logo = overlay.querySelector<HTMLElement>('[data-loader-logo]');
      const label = overlay.querySelector<HTMLElement>('[data-loader-label]');
      const progress = overlay.querySelector<HTMLElement>(
        '[data-loader-progress]',
      );
      if (!logo || !label || !progress) return;

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (shouldExit) {
        const finish = () => {
          overlay.style.pointerEvents = 'none';
        };

        if (reduceMotion) {
          gsap.set(overlay, { autoAlpha: 0 });
          finish();
          return;
        }

        gsap
          .timeline({ onComplete: finish })
          .to(logo, {
            scale: 0.97,
            duration: 0.12,
            ease: 'power1.in',
          })
          .to(
            overlay,
            {
              autoAlpha: 0,
              duration: 0.28,
              ease: 'power2.inOut',
            },
            '>',
          );
        return;
      }

      overlay.style.pointerEvents = 'auto';
      gsap.set(overlay, { autoAlpha: 1 });

      if (reduceMotion) {
        gsap.set([logo, label], { autoAlpha: 1 });
        return;
      }

      const logoTimeline = gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(
          logo,
          { autoAlpha: 0, y: 14, scale: 0.88 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.38 },
        )
        .fromTo(
          label,
          { autoAlpha: 0, y: 6 },
          { autoAlpha: 1, y: 0, duration: 0.28 },
          0.12,
        )
        .to(
          logo,
          {
            scale: 1.025,
            duration: 0.46,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          },
          0.38,
        );
      const progressSweep = gsap.fromTo(
        progress,
        { xPercent: -120, scaleX: 0.35 },
        {
          xPercent: 120,
          scaleX: 0.55,
          duration: 0.72,
          repeat: -1,
          ease: 'power1.inOut',
        },
      );

      return () => {
        logoTimeline.kill();
        progressSweep.kill();
      };
    },
    {
      scope: overlayRef,
      dependencies: [shouldExit],
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-live="polite"
      aria-hidden={shouldExit}
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-slate-50"
    >
      <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-green-200/60 blur-3xl" />
      <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-yellow-200/50 blur-3xl" />

      <div className="relative flex flex-col items-center">
        <span
          data-loader-logo
          className="relative block h-24 w-80 overflow-hidden will-change-transform"
        >
          <Image
            src="/fittrack-wordmark.svg"
            alt=""
            priority
            width={320}
            height={320}
            className="absolute left-1/2 top-1/2 h-80 w-80 max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
          />
        </span>

        <div className="mt-2 h-1 w-40 overflow-hidden rounded-full bg-slate-200">
          <span
            data-loader-progress
            className="block h-full w-full origin-left rounded-full bg-[#16A44B] will-change-transform"
          />
        </div>
        <p
          data-loader-label
          className="mt-4 text-xs font-black uppercase tracking-[0.24em] text-slate-600"
        >
          Preparing your plan
        </p>
      </div>
    </div>
  );
}

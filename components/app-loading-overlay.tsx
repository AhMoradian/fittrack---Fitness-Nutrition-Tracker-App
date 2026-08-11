'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useFitTrack } from '@/lib/fittrack-store';

const MINIMUM_VISIBLE_MS = 1250;

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

      const mark = overlay.querySelector<HTMLElement>('[data-loader-mark]');
      const fit = overlay.querySelector<HTMLElement>('[data-loader-fit]');
      const track = overlay.querySelector<HTMLElement>('[data-loader-track]');
      const glow = overlay.querySelector<HTMLElement>('[data-loader-glow]');
      const orbit = overlay.querySelector<HTMLElement>('[data-loader-orbit]');
      const streak = overlay.querySelector<HTMLElement>('[data-loader-streak]');
      const sparks = overlay.querySelectorAll<HTMLElement>(
        '[data-loader-spark]',
      );

      if (
        !mark ||
        !fit ||
        !track ||
        !glow ||
        !orbit ||
        !streak
      ) {
        return;
      }

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

        const exitTimeline = gsap
          .timeline({ onComplete: finish })
          .to(
            fit,
            {
              x: -18,
              rotation: -1.5,
              autoAlpha: 0.72,
              duration: 0.26,
              ease: 'power2.in',
            },
            0,
          )
          .to(
            track,
            {
              x: 18,
              rotation: 1.5,
              autoAlpha: 0.72,
              duration: 0.26,
              ease: 'power2.in',
            },
            0,
          )
          .to(
            [glow, orbit],
            {
              scale: 1.18,
              autoAlpha: 0,
              duration: 0.34,
              ease: 'power2.in',
            },
            0,
          )
          .to(
            overlay,
            {
              autoAlpha: 0,
              duration: 0.42,
              ease: 'power2.inOut',
            },
            0.14,
          );

        return () => exitTimeline.kill();
      }

      overlay.style.pointerEvents = 'auto';
      gsap.set(overlay, { autoAlpha: 1 });

      if (reduceMotion) {
        gsap.set([mark, fit, track], { autoAlpha: 1 });
        gsap.set([orbit, glow], { autoAlpha: 0 });
        return;
      }

      const introTimeline = gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .addLabel('assemble', 0)
        .fromTo(
          glow,
          { autoAlpha: 0, scale: 0.45 },
          { autoAlpha: 0.78, scale: 1, duration: 0.72 },
          'assemble',
        )
        .fromTo(
          streak,
          { autoAlpha: 0, scaleX: 0.08 },
          { autoAlpha: 0.75, scaleX: 1, duration: 0.62 },
          'assemble',
        )
        .fromTo(
          fit,
          { autoAlpha: 0, x: -54, y: 8, rotation: -5, scale: 0.9 },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.7,
            ease: 'back.out(1.55)',
          },
          'assemble',
        )
        .fromTo(
          track,
          { autoAlpha: 0, x: 60, y: -8, rotation: 5, scale: 0.9 },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.76,
            ease: 'back.out(1.55)',
          },
          'assemble+=0.06',
        )
        .addLabel('lock', 0.68)
        .to(
          mark,
          { scale: 1.045, duration: 0.14, ease: 'power2.out' },
          'lock',
        )
        .to(
          mark,
          { scale: 1, duration: 0.3, ease: 'back.out(2.2)' },
          '>',
        )
        .fromTo(
          sparks,
          { autoAlpha: 0, scale: 0, rotation: -25 },
          {
            autoAlpha: 1,
            scale: 1,
            rotation: 0,
            duration: 0.22,
            stagger: 0.05,
            ease: 'back.out(2.6)',
          },
          'lock',
        )
        .to(
          sparks,
          {
            autoAlpha: 0,
            scale: 1.7,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.out',
          },
          'lock+=0.22',
        )
        .to(
          streak,
          { autoAlpha: 0, scaleX: 0.65, duration: 0.4 },
          'lock+=0.08',
        );

      const idle = gsap.to(mark, {
        y: -2,
        scale: 1.012,
        duration: 0.95,
        delay: 1.05,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      const orbitSpin = gsap.to(orbit, {
        rotation: 360,
        duration: 3.4,
        delay: 0.4,
        repeat: -1,
        ease: 'none',
      });
      return () => {
        introTimeline.kill();
        idle.kill();
        orbitSpin.kill();
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
      aria-label="Loading FitTrack"
      aria-hidden={shouldExit}
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-slate-50"
    >
      <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-green-200/60 blur-3xl" />
      <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-yellow-200/50 blur-3xl" />

      <div className="relative grid place-items-center">
        <div className="relative grid h-36 w-[22rem] place-items-center sm:w-96">
          <span
            data-loader-glow
            className="absolute h-20 w-64 rounded-full bg-[#16A44B]/20 blur-2xl will-change-transform"
          />
          <span
            data-loader-streak
            className="absolute h-px w-80 origin-center bg-gradient-to-r from-transparent via-[#F0BF4C] to-transparent will-change-transform"
          />
          <span
            data-loader-orbit
            className="absolute h-32 w-32 rounded-full border border-[#16A44B]/20 will-change-transform"
          >
            <span className="absolute left-1/2 top-[-3px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#F0BF4C] shadow-[0_0_12px_#F0BF4C]" />
            <span className="absolute bottom-[-2px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#16A44B]" />
          </span>

          <span
            data-loader-mark
            className="relative block h-24 w-80 will-change-transform"
          >
            <span
              data-loader-fit
              className="absolute inset-0 block [clip-path:inset(0_63.2%_0_0)] will-change-transform"
            >
              <LoaderLogo />
            </span>
            <span
              data-loader-track
              className="absolute inset-0 block [clip-path:inset(0_0_0_36.8%)] will-change-transform"
            >
              <LoaderLogo />
            </span>
          </span>

          <span
            data-loader-spark
            className="absolute left-[22%] top-[24%] h-2.5 w-2.5 text-[#F0BF4C] will-change-transform"
          >
            <Spark />
          </span>
          <span
            data-loader-spark
            className="absolute bottom-[24%] right-[18%] h-3.5 w-3.5 text-[#F0BF4C] will-change-transform"
          >
            <Spark />
          </span>
          <span
            data-loader-spark
            className="absolute right-[30%] top-[19%] h-2 w-2 text-[#16A44B] will-change-transform"
          >
            <Spark />
          </span>
        </div>

      </div>
    </div>
  );
}

function LoaderLogo() {
  return (
    <Image
      src="/fittrack-wordmark.svg"
      alt=""
      priority
      width={320}
      height={320}
      className="absolute left-1/2 top-1/2 h-80 w-80 max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
    />
  );
}

function Spark() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className="h-full w-full">
      <path d="M6 0.5C6.35 4.2 7.8 5.65 11.5 6 7.8 6.35 6.35 7.8 6 11.5 5.65 7.8 4.2 6.35 0.5 6 4.2 5.65 5.65 4.2 6 0.5Z" fill="currentColor" />
    </svg>
  );
}

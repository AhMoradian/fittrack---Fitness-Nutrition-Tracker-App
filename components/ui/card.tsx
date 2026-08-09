'use client';

import * as React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, forwardedRef) => {
    const cardRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(forwardedRef, () => cardRef.current!);

    useGSAP(() => {
      const card = cardRef.current;
      if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const isDesktop = window.matchMedia('(min-width: 768px)').matches;
      const fromVars = {
        autoAlpha: 0,
        y: isDesktop ? 28 : 16,
        scale: isDesktop ? 0.985 : 1,
      };
      const toVars = {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: isDesktop ? 0.62 : 0.44,
        ease: 'power2.out',
        clearProps: 'transform,opacity,visibility',
      };

      if (card.getBoundingClientRect().top < window.innerHeight * 0.92) {
        gsap.fromTo(card, fromVars, toVars);
        return;
      }

      gsap.fromTo(card, fromVars, {
        ...toVars,
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
          once: true,
        },
      });
    });

    return (
      <div
        ref={cardRef}
        data-motion-card
        className={cn('rounded-3xl border bg-card p-5 shadow-soft', className)}
        {...props}
      />
    );
  },
);

Card.displayName = 'Card';

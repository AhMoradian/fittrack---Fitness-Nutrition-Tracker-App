'use client';

import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export function AppMotion({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    (context, contextSafe) => {
      const root = rootRef.current;
      if (!root) return;

      const media = gsap.matchMedia();
      let refreshFrame = 0;

      media.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (mediaContext) => {
          const { isDesktop, reduceMotion } = mediaContext.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };
          const headerParts = gsap.utils.toArray<HTMLElement>(
            '[data-motion-header-part]',
            root,
          );
          const registeredCards = new WeakSet<Element>();

          if (reduceMotion) {
            gsap.set(headerParts, { clearProps: 'all' });
            return;
          }

          if (headerParts.length) {
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
          }

          const reveal = (card: HTMLElement) => {
            if (registeredCards.has(card)) return;
            registeredCards.add(card);

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
            const cardTop = card.getBoundingClientRect().top;

            if (cardTop < window.innerHeight * 0.92) {
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
          };
          const revealCard = contextSafe ? contextSafe(reveal) : reveal;

          const registerCards = (container: ParentNode) => {
            if (container instanceof HTMLElement && container.matches('[data-motion-card]')) {
              revealCard(container);
            }
            container
              .querySelectorAll<HTMLElement>('[data-motion-card]')
              .forEach(revealCard);
          };

          registerCards(root);

          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLElement) registerCards(node);
              });
            });
            refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
          });

          observer.observe(root, { childList: true, subtree: true });
          refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

          return () => {
            observer.disconnect();
            window.cancelAnimationFrame(refreshFrame);
          };
        },
        root,
      );

      return () => media.revert();
    },
    { scope: rootRef, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} key={pathname} className="min-h-screen">
      {children}
    </div>
  );
}

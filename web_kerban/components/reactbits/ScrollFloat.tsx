"use client";

import React, { useEffect, useMemo, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';

interface ScrollFloatProps {
  children: ReactNode;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  stagger?: number;
  /** If true, ties animation to scroll. If false, plays on mount immediately. */
  scrub?: boolean;
}

const ScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  stagger = 0.03,
  scrub = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split('').map((char, index) => (
      <span className="inline-block" key={index}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const charElements = el.querySelectorAll('.inline-block');

    if (scrub) {
      // Lazy-load ScrollTrigger only when scrubbing
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo(
          charElements,
          {
            willChange: 'opacity, transform',
            opacity: 0,
            yPercent: 120,
            scaleY: 2.3,
            scaleX: 0.7,
            transformOrigin: '50% 0%'
          },
          {
            duration: animationDuration,
            ease,
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            stagger,
            scrollTrigger: {
              trigger: el,
              start: 'center bottom+=50%',
              end: 'bottom bottom-=40%',
              scrub: true
            }
          }
        );
      });
    } else {
      // Play once on mount — no scroll trigger
      gsap.fromTo(
        charElements,
        {
          opacity: 0,
          yPercent: 120,
          scaleY: 2.3,
          scaleX: 0.7,
          transformOrigin: '50% 0%'
        },
        {
          duration: animationDuration,
          ease,
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger,
          delay: 0.3
        }
      );
    }
  }, [animationDuration, ease, stagger, scrub]);

  return (
    <div ref={containerRef} className={`my-5 overflow-hidden ${containerClassName}`}>
      <span className={`inline-block text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] ${textClassName}`}>
        {splitText}
      </span>
    </div>
  );
};

export default ScrollFloat;

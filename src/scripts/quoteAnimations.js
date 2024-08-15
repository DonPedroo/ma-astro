// src/scripts/quoteAnimations.js

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const QuoteAnimations = (() => {
  let ctx = null; // GSAP context

  function init() {
    ctx = gsap.context(() => {
      const context = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      const textElements = document.querySelectorAll('[data-stripe-text]');

      textElements.forEach((textElement) => {
        if (textElement instanceof HTMLElement) {
          const rotationDegree = parseFloat(
            textElement.getAttribute('data-stripe-text-rotate') || '0'
          );
          const startX = rotationDegree > 0 ? '100%' : '-100%';
          let endX;

          if (context.width / context.height > 1) {
            endX = rotationDegree > 0 ? '-10%' : '10%';
          } else {
            endX = rotationDegree > 0 ? '-30%' : '30%';
          }

          textElement.style.transform = `rotate(${rotationDegree}deg)`;

          gsap.fromTo(
            textElement,
            { x: startX },
            {
              x: endX,
              scrollTrigger: {
                trigger: textElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }
      });
    });
  }

  function kill() {
    if (ctx) {
      ctx.revert(); // Revert the GSAP context, cleaning up all animations and ScrollTriggers
      ctx = null
    }
  }

  return { init, kill };
})();

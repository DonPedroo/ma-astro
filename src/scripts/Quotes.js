import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class QuoteAnimations {
  constructor(context) {
    this.ctx = null; // GSAP context
    this.context = context; // Context with width and height
  }

  init() {
    this.ctx = gsap.context(() => {
      const { width, height } = this.context;

      const textElements = document.querySelectorAll('[data-stripe-text]');

      textElements.forEach((textElement) => {
        if (textElement instanceof HTMLElement) {
          const rotationDegree = parseFloat(
            textElement.getAttribute('data-stripe-text-rotate') || '0'
          );
          const startX = rotationDegree > 0 ? '100%' : '-100%';
          let endX;

          if (width / height > 1) {
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

  kill() {
    if (this.ctx) {
      this.ctx.revert(); 
      this.ctx = null;
    }
  }
}

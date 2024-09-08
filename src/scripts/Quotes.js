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
      const stripeTextWrap = document.querySelector('[data-stripe-wrap]');
      const textElements = stripeTextWrap.querySelectorAll('[data-stripe-text]');

      // Create a single timeline for all text elements
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stripeTextWrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      // Define a delay for staggered animations (0.1 seconds between each animation)
      const staggerDelay = 0.05;

      textElements.forEach((textElement, index) => {
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

          // Apply initial transform (rotation)
          textElement.style.transform = `rotate(${rotationDegree}deg)`;

          // Add a tween for each text element to the timeline, with staggered offset
          timeline.fromTo(
            textElement,
            { x: startX },
            {
              x: endX,
              ease: 'linear', // Ensure linear easing
            },
            index * staggerDelay // Create offset for each element
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

import { gsap } from 'gsap';
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);
CustomEase.create("custom", "M0,0 C0.16,0.67 0,1.01 1,1 ")

export function toggleVisibility(element, { show, delay = 0, duration = 2 }) {

  if (typeof element === 'string') {
    element = document.querySelector(element); 
  }
  if (!element) {
    console.warn('No element found for the selector');
    return;
  }

  gsap.killTweensOf(element);

  if (show) {
    if (duration === 0) {
      if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');
      }
      element.style.opacity = 1;
    } else {
      if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');
      }

      gsap.fromTo(element, 
        { opacity: 0 }, 
        { opacity: 1, duration: duration, ease: "custom", delay: delay }
      );
    }
  } else {
    if (duration === 0) {
      // Immediately hide the element without animation
      element.style.opacity = 0;
      element.classList.add('hidden');
    } else {
      // Animate hide with GSAP
      gsap.fromTo(element, 
        { opacity: 1 }, 
        { 
          opacity: 0, 
          duration: 0.5, 
          ease: "custom", 
          delay: delay, 
          onComplete: () => element.classList.add('hidden') 
        }
      );
    }
  }
}

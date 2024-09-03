// toggleVisibility.js

import { gsap } from 'gsap';
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);
CustomEase.create("custom", "M0,0 C0.16,0.67 0,1.01 1,1 ")

export function toggleVisibility(element, { show, delay = 0 ,duration = 2 }) {
    gsap.killTweensOf(element);

    if (show) {
        // Ensure the 'hidden' class is removed before the animation starts
        if (element.classList.contains('hidden')) {
          element.classList.remove('hidden');
        }
        
        // Animate from opacity 0 to 1 using fromTo
        gsap.fromTo(element, 
          { opacity: 0 }, // Start state
          { opacity: 1, duration: duration, ease: "custom", delay: delay } // End state
        );
      } else {
        // Animate from current opacity to 0, then add 'hidden' class on completion
        gsap.fromTo(element, 
          { opacity: 1 }, // Start state
          { 
            opacity: 0, 
            duration: 0.5, 
            ease: "custom", 
            delay: delay, 
            onComplete: () => element.classList.add('hidden') 
          } // End state
        );
      }
      
}

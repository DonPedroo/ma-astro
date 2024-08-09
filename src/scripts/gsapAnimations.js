// src/scripts/gsapAnimations.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export class GsapAnimations {
  constructor() {
    this.gsapContext = null; // Initialize the gsapContext
    this.initScrollTriggers();
  }

  initScrollTriggers() {
    // Create a GSAP context
    this.gsapContext = gsap.context(() => {
      document.querySelectorAll("section").forEach((section) => {
        // Define ScrollTrigger properties for each section
        const triggerProps = {
          trigger: section,
          start: "top top",
          end: "bottom top",
          // markers: true, // You can remove this in production
          // scrub: true, // Smoothly scrubs the animation as you scroll
          onEnter: () => {
            // Custom animation logic on enter
            console.log(`Entering section: ${section.id}`);
          },
          onLeave: () => {
            // Custom animation logic on leave
            console.log(`Leaving section: ${section.id}`);
          },
        };

        // Create the ScrollTrigger for this section
        ScrollTrigger.create(triggerProps);
      });
    }); // No scene/context element binding, as it's not required
  }

  // Function to kill all ScrollTriggers and clear the GSAP context
  killScrollTriggers() {
    if (this.gsapContext) {
      this.gsapContext.revert(); // Kills all animations and ScrollTriggers within the context
      this.gsapContext = null; // Clear the context reference
      ScrollTrigger.getAll().forEach((st) => st.kill()); // Extra cleanup if needed
      console.log("All ScrollTriggers killed and GSAP context cleared.");
    }
  }
}

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export class Scroll {
  constructor() {
    this.smoother = null;
    this.ctx = null;  // Initialize the context variable
  }

  // Function to initialize ScrollSmoother using gsap.context
  initScrollSmoother() {
    // if (!this.smoother) {
    //   this.ctx = gsap.context(() => {
    //     this.smoother = ScrollSmoother.create({
    //       smooth: 1.5,
    //       effects: true,
    //     });
       
    //   });
              document.body.style.height = '3000px';

    // }
  }

  // Function to kill ScrollSmoother and clean up the context
  killScrollSmoother() {
    // if (this.smoother) {



    //   if (this.ctx) {
    //     this.ctx.revert();  // Revert all animations in the context
    //     this.ctx = null;  // Clean up the context
    //   }
      
    //   this.smoother.kill();
    //   this.smoother = null;

      // Optional: Set body height for testing
      document.body.style.height = '1000px';
    // }
  }
}

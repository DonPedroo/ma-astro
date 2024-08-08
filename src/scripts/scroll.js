// src/scripts/scroll.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollSmoother } from "../plugins/gsap/ScrollSmoother"; 

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export class Scroll {
  constructor() {
    this.smoother = null;
  }

  // Function to initialize ScrollSmoother
  initScrollSmoother() {
    if (!this.smoother) {
      setTimeout(() => {
        this.smoother = ScrollSmoother.create({
          smooth: 1.5,
          effects: true,  // You can add more options as needed
        });
        this.smoother.refresh();
        console.log(">>> ScrollSmoother initialized", this.smoother);
      }, 1000); // 1-second delay
    }
  }

  // Function to kill ScrollSmoother
  killScrollSmoother() {
    if (this.smoother) {
        console.log(">>> ScrollSmoother killed",this.smoother);

      this.smoother.kill();
      this.smoother = null;
    }
  }
}

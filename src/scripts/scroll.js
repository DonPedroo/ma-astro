import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "../plugins/gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger,ScrollSmoother);

export class Scroll {
  constructor() {
    this.smoother = null;
    this.ctx = null;  

    this.initScrollSmoother()
  }

  initScrollSmoother() {

    if (!this.smoother) {



      this.ctx = gsap.context(() => {
  
        this.smoother = ScrollSmoother.create({
          smooth: .5,
          effects: true,
        });
 
       
      });

    }
  }

  // Function to kill ScrollSmoother and clean up the context
  killScrollSmoother() {
    if (this.smoother) {

      if (this.ctx) {
        this.ctx.revert();  // Revert all animations in the context
        this.ctx = null;  // Clean up the context
      }
      
      this.smoother.kill();
      this.smoother = null;

    }
  }

  scrollToProject(t) {


    if (t) {

      ScrollTrigger.refresh();

      const targetElement = document.getElementById(t);
      const scrollPosition = this.smoother.offset(targetElement, 0);
      this.smoother.scrollTop(scrollPosition); 

    }

    
   

  }
}

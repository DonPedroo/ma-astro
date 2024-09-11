import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "../plugins/gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger,ScrollSmoother);

export class Scroll {
  constructor() {
    this.smoother = null;
    this.ctx = null;  

    this.init()

  }

  init() {

    if (!this.smoother) {



      this.ctx = gsap.context(() => {
  
        this.smoother = ScrollSmoother.create({
          smooth: .5,
          // effects: true,
        });


        // console.log("smoother created")
 
       
      });

    }
  }

  initEffects() {

    if (this.smoother) {
      this.smoother.effects("[data-speed]");

      // console.log("effects added")


    }


  }

  killEffects() {

    if (this.smoother) {

    this.smoother.effects().forEach((t) => t.kill());

  }

  }

  kill() {
    if (this.smoother) {


      if (this.ctx) {
        this.ctx.revert();  
        this.ctx = null; 
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

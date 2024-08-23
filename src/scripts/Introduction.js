import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class Introduction {
  constructor(context) {
    this.ctx = null; // GSAP context
    this.scroll = null
    this.context = context; // Context with width and height
  }

  init() {
    this.ctx = gsap.context(() => {
     

      const section = document.querySelector('[data-stripe-text]');

    const triggerPropsWrap = {
        trigger: section,
        // animation: timeline,
        start: "top top",
        end: "+=" + (window.innerHeight*(6)),
        markers: true,
        // scrub: true, 
        // pin: true,
        // pinSpacing:true,
        onEnter: () => {
          console.log(`Entering inside section: ${section.id}`);
        },
        onLeave: () => {
          console.log(`Leaving  inside section: ${section.id}`);
        },
        onRefresh: (self) => {

            console.log("this.scrollJack start value after refresh:", this.startValue);
        },
        onUpdate: (self) => {
        

        },
      };

      this.scroll = ScrollTrigger.create(triggerPropsWrap);


  
    });
  }

  kill() {
    if (this.ctx) {
      this.ctx.revert(); 
      this.ctx = null;
      this.scroll = null
    }
  }
}

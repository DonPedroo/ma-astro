import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from '../plugins/gsap//SplitText';
import { CustomEase } from "gsap/CustomEase";
import { useTextAnimation } from './AnimationText'; 

gsap.registerPlugin(SplitText,CustomEase);

export class Animation {    
  constructor(context) {
    this.context = context; 
    this.ctx = null
    // this.scroll = scroll
    // console.log("animation class constructor")
    // this.init()
  }

  init() {
    // console.log("animation class init");
    this.ctx = gsap.context(() => {
        this.animationProjects();

        

        setTimeout(() => {
            this.animationTxtLg();
          }, 0);
      });
  }

  animationTxtLg () {
    const txtLgEl = document.querySelectorAll('[data-animation-txt-lg]');
    txtLgEl.forEach(element => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top bottom',
        onEnter: () => {
           useTextAnimation(element, { type: 'lines' }, { moveup: true });
        }
      });
    });
  }



  animationProjects () {
    const caseStudy = document.querySelectorAll('[data-animation-case-study]');
    caseStudy.forEach(element => {
        const title = element.querySelector('[data-animation-case-title]');
        const paragraph = element.querySelector('[data-animation-case-desc]');
        const eyebrow = element.querySelector('[data-animation-case-eyebrow]');

      ScrollTrigger.create({
        trigger: element,
        start: 'top bottom',
        // markers:true,
        onEnter: () => {
        //   console.log("on enter")
          useTextAnimation(eyebrow, { type: 'lines' }, { moveup: true, delay:.2 });
          useTextAnimation(title, { type: 'lines' }, { moveup: true });
          useTextAnimation(paragraph, { type: 'lines' }, { moveup: true, delay:.2 });
        },
 
      });
    });

  }
  
  kill() {
    // console.log("animation class kill")
    if (this.ctx) {
        // console.log("ctx",this.ctx.data)
        this.ctx.revert(); 
        this.ctx = null;
      }
  }

}

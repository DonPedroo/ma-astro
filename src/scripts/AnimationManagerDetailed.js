import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTextAnimation } from './AnimationText'; 


export class AnimationDetailed {    
  constructor(context) {
    this.context = context; 
    this.ctx = null
    // this.scroll = scroll
    console.log("detailed animation class constructor")
    // this.init()
  }

  init() {
    console.log("detailed animation class init");
    this.ctx = gsap.context(() => {
    // this.animationProjects();
        setTimeout(() => {
            this.animationTxtLg();
          }, 0);
      });
  }

  animationTxtLg () {
    const wrapper = document.querySelector('[data-test]');
    const container = document.querySelector("[data-horizontal-scroll]");

    const el = wrapper.querySelector("[data-test-anim]");

    ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom", 
      end: () => `+=${1200}`,
      markers:true,
      onEnter: () => {
        console.log("onEnter")
         useTextAnimation(el, { type: 'lines' }, { moveup: true });
      },
      onLeave:() => {
        console.log("onLeave")
      },
    });

    // wrapper.forEach(element => {
      
    // });
  }



  // animationProjects () {
  //   const caseStudy = document.querySelectorAll('[data-animation-case-study]');
  //   caseStudy.forEach(element => {
  //       const title = element.querySelector('[data-animation-case-title]');
  //       const paragraph = element.querySelector('[data-animation-case-desc]');
  //       const eyebrow = element.querySelector('[data-animation-case-eyebrow]');

  //     ScrollTrigger.create({
  //       trigger: element,
  //       start: 'top bottom',
  //       // markers:true,
  //       onEnter: () => {
  //       //   console.log("on enter")
  //         useTextAnimation(eyebrow, { type: 'lines' }, { moveup: true, delay:.2 });
  //         useTextAnimation(title, { type: 'lines' }, { moveup: true });
  //         useTextAnimation(paragraph, { type: 'lines' }, { moveup: true, delay:.2 });
  //       },
 
  //     });
  //   });

  // }
  
  kill() {
    console.log("detailed animation class kill")
    if (this.ctx) {
        // console.log("ctx",this.ctx.data)
        this.ctx.revert(); 
        this.ctx = null;
      }
  }

}

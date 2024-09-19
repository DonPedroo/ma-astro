import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTextAnimation } from './AnimationText'; 
import { toggleVisibility } from './toggleVisibility'; 


export class TouchScroll {    
  constructor(context) {
    this.context = context; 
    this.ctx = null
    // this.scroll = scroll
    // console.log("animation class constructor")
    // this.init()
  }

  init() {
    console.log("touch animation class init");
    this.ctx = gsap.context(() => {
        this.firstSection()
      });
  }


  firstSection() {
    // console.log("horizontal scroll GSAP Animate first section")

    this.logosAnimation()
    this.quoteAnimation() 


  }

  quoteAnimation() {

    const quoteAnimation = document.querySelector('[data-animation-quote]');


    const title = quoteAnimation.querySelector('h4');
    const paragraph = quoteAnimation.querySelector('p');
    const tick = quoteAnimation.querySelector('img');

    
    toggleVisibility(tick, { show: true, delay:.5 });

    useTextAnimation(title, { type: 'lines' }, { moveup: true, delay:0 });
    useTextAnimation(paragraph, { type: 'lines' }, { moveup: true, delay:.2 });

  }


  logosAnimation() {

    this.logos = gsap.utils.toArray("[data-horizontal-logos]");


    gsap.fromTo(this.logos, 
      { y: "10vh", opacity: 0 }, 
      { y: "0vh", opacity: 1, stagger: 0.1 ,delay: 0.5 , duration: 1.5,ease: "custom" }, "<"
    );

    // gsap.fromTo(this.logos, 
    //   { x: "10vw", opacity: 0 }, 
    //   { x: "0vw", opacity: 1, stagger: 0.1 , duration: 1.5,ease: "custom" }, "<"
    // );

  }


  animationTxtLg () {
    const txtLgEl = document.querySelectorAll('[data-animation-txt-lg]');
    txtLgEl.forEach(element => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top bottom',
        // markers:true,
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
        const button = element.querySelector('[data-animation-case-button]');

      ScrollTrigger.create({
        trigger: element,
        start: 'top bottom',
        // markers:true,
        onEnter: () => {
        //   console.log("on enter")
          useTextAnimation(eyebrow, { type: 'lines' }, { moveup: true, delay:.2 });
          useTextAnimation(title, { type: 'lines' }, { moveup: true });
          useTextAnimation(paragraph, { type: 'lines' }, { moveup: true, delay:.2 });
          toggleVisibility(button, { show: true, delay:.6, duration: 2 });

        },
 
      });
    });

  }
  
  kill() {
    console.log("touch animation animation class kill")
    if (this.ctx) {
        // console.log("ctx",this.ctx.data)
        this.ctx.revert(); 
        this.ctx = null;
      }
  }

}

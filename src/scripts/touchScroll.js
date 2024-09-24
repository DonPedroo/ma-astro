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
        this.animationTxtBlocks()
        this.animationStatBlocks()

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
      { y: "5vh", opacity: 0 }, 
      { y: "0vh", opacity: 1, stagger: 0.1, duration: 2.5,ease: "custom" }, "<"
    );

    const quote = document.querySelector("[data-quote-container]");
    gsap.fromTo(quote, 
      { y: 1000, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "custom" },
    );

    const elements = document.querySelectorAll("[data-bg]");
      
    elements.forEach(element => {
      const bgValue = element.getAttribute('data-type');
      
      if (bgValue === 'color') {
        element.classList.add('bg-massgrey');
      }
      
      if (bgValue === 'bg-image') {
        element.classList.add('grunge');
      }
      
      if (bgValue === 'image') {
        const img = element.querySelector("img");
        if (img) {
          img.classList.remove('opacity-0');
        }
      }
    });


  }


  animationTxtBlocks() {

    const textAnimation = document.querySelectorAll('[data-animation-txt-lg]');

textAnimation.forEach(element => {
  const title = element.querySelector('h4');
  const paragraph = element.querySelector('p');

  ScrollTrigger.create({
    trigger: element,
    start: 'left right',
    // markers:true,
    scrub:0,
    containerAnimation: this.scrollTween,
    onEnter: () => {
     
      useTextAnimation(title, { type: 'lines' }, { moveup: true, delay:.1 });
      useTextAnimation(paragraph, { type: 'lines' }, { moveup: true, delay:.2 });
    },
  });
});

  }

  animationStatBlocks() {

    const statAnimation = document.querySelector('[data-animation-stats]');

    const statItems = statAnimation.querySelectorAll('div');


  ScrollTrigger.create({
    trigger: statAnimation,
    start: 'left right',
    // markers:true,
    scrub:0,
    containerAnimation: this.scrollTween,
    onEnter: () => {
      statItems.forEach((element, index) => {
        const title = element.querySelector('h5');
        const paragraph = element.querySelector('p');
    
        // Calculate delays based on the index
        const titleDelay = 0.1 + index * 0.2; // Increase delay for title by 0.2s for each element
        const paragraphDelay = 0.3 + index * 0.2; // Increase delay for paragraph by 0.2s for each element
    
        useTextAnimation(title, { type: 'lines' }, { moveup: true, delay: titleDelay });
        useTextAnimation(paragraph, { type: 'lines' }, { moveup: true, delay: paragraphDelay });
      });
    },
    
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

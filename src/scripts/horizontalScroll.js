import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTextAnimation } from './AnimationText'; 
// import { useObjectAnimation } from './AnimationObject'; 

import { toggleVisibility } from './toggleVisibility'; 
import { CustomEase } from 'gsap/CustomEase';

CustomEase.create('custom', 'M0,0 C0.16,0.67 0,1.01 1,1');




gsap.registerPlugin(ScrollTrigger,CustomEase);

export class horizontalScroll {
  constructor(context) {

    this.context = context;

    this.ctx = null;  
    this.target = null;
    this.closePin = null
    this.mediaPin = null
    this.sections = null
    this.progressBarContainer = null;
    this.scrollDistance= null;
    this.scrollTween = null
    this.logos = null
    this.handleResizeBound = this.handleResize.bind(this);
    // console.log("horizontal scroll GSAP constructor")
  }

  calcDistance() {

    this.target = document.querySelector('[data-horizontal-scroll]');
    // this.target.classList.remove("overflow-x-scroll", "overflow-y-hidden");
    this.sections = gsap.utils.toArray("[data-horizontal-scroll] section");
    this.recalcDist()

  }

  recalcDist() {

    const totalWidth = this.sections.reduce((total, section, index) => {
      const sectionWidth = section.offsetWidth;
      // console.log(`Section ${index + 1} width:`, sectionWidth,section);
      return total + sectionWidth;
    }, 0);

    this.scrollDistance = totalWidth - this.target.clientWidth;

    // const section = this.sections[2]; // Assuming 'this.sections' is a NodeList or array

    // if (section) {
    //   // Get the direct child elements of section 3
    //   const childElements = Array.from(section.children);
  
    //   // Log the width of each child element in section 3
    //   childElements.forEach((child, i) => {
    //     const childWidth = child.offsetWidth;
    //     console.log(`Section 3, Child ${i + 1} width:`, childWidth, child);
    //   });
    // } else {
    //   console.warn('Section 3 not found');
    // }

  }

  handleResize() {

    this.recalcDist()
      if (this.scrollTween) {
        this.scrollTween.scrollTrigger.kill();
      }
      this.horizontalScroll();
      ScrollTrigger.refresh();
  }

  addPins() {

    this.closePin = document.querySelector('[data-arrow-scroll-close]'); 
    this.mediaPin = document.querySelector('[data-detailed-media]'); 

    const elementsToPin = [this.closePin, this.mediaPin];

    elementsToPin.forEach((element) => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top top',
        end: () => `+=${this.scrollDistance}`,
        pin: true,
      });
    });
    

  }

  horizontalScroll() {

    this.scrollTween = gsap.to(this.target, {
      x: -this.scrollDistance, 
      ease: 'none', 
      scrollTrigger: {
          trigger: this.target,
          start: 'top top',
          end: () => `+=${this.scrollDistance}`,
          pin: true,
          scrub: 0,
          onUpdate: (self) => {
            const scrollProgress = self.progress * 100;
              gsap.set(this.progressBar, {
              width: `${scrollProgress}%`,
            });


            if (this.context.gl) {
              if(this.context.sceneInstance) {
                  for (const item of this.context.sceneInstance.items.items) {
                  item.mesh.position.x =  (((item.left - self.progress* this.scrollDistance) + (item.width / 2)) / window.innerWidth - 0.5) * (window.innerWidth/window.innerHeight)

              }

              }
            
          }


          }
      }
  });


  }

  animationTxtBlocks() {

    const textAnimation = document.querySelectorAll('[data-animation-txt-lg]');

textAnimation.forEach(element => {
  const title = element.querySelector('h4');
  const paragraph = element.querySelector('p');
  const imageA = element.querySelector('[data-animation-img-a]');
  const imageB = element.querySelector('[data-animation-img-b]');

  ScrollTrigger.create({
    trigger: element,
    start: 'left right',
    // markers:true,
    scrub:0,
    containerAnimation: this.scrollTween,
    onEnter: () => {
      if (imageA) {
        toggleVisibility(imageA, { show: true, delay:.3,duration:2 });
      }
      if (imageB) {
        toggleVisibility(imageB, { 
          show: true, 
          delay: imageA ? 0.5 : 0.3,  
          duration: 2 
        });      }
      useTextAnimation(title, { type: 'lines' }, { moveup: true, delay:.1 });
      useTextAnimation(paragraph, { type: 'lines' }, { moveup: true, delay:.3 });
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

  animationParalax() {
    const paralaxContainer = document.querySelector('[data-animation-paralax]');  
    const paralaxImages = paralaxContainer.querySelectorAll('div');  // Select all divs inside the container
  
    if (paralaxContainer && paralaxImages.length > 0) {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: paralaxContainer,
          start: 'left right', 
          scrub: true,         
          containerAnimation: this.scrollTween,
          onEnter: () => {


          paralaxImages.forEach((image, index) => {
          const img = image.querySelector('img'); // Select the single img inside the div
          const delay = 0.3 + index * 0.2; // Increase delay for paragraph by 0.2s for each element

            if (img) {
              toggleVisibility(img, { show: true, delay: delay, duration: 2 });
            }

        })
            
          },
        }
      });
  
      paralaxImages.forEach((image, index) => {

        let xValue = '0'; // Default value

        // Adjust xValue based on the index
         if (index === 0) {
          xValue = '-50%';
        }
        else if (index === 1) {
          xValue = '-50%';
        } else if (index === 2) {
          xValue = '-150%';
        }

          timeline.to(image, {
          x: xValue, 
          ease: 'none',
        }, 0);
      });
    }
  }
  
  

  init() {

    // console.log("horizontal scroll GSAP created")

    if (!this.context.gl) {

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
    

    this.calcDistance() 

    this.initProgressUI()

    this.ctx = gsap.context(() => {
      this.addPins();
      this.horizontalScroll()
      
      this.firstSection()
      this.animationTxtBlocks()
      this.animationParalax()
      this.animationStatBlocks()
         
        });

        window.addEventListener('resize', this.handleResizeBound);

     

        



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

    
    toggleVisibility(tick, { show: true, delay:.7 });

    useTextAnimation(title, { type: 'lines' }, { moveup: true, delay:.5 });
    useTextAnimation(paragraph, { type: 'lines' }, { moveup: true, delay:.7 });

  }

  logosAnimation() {

    this.logos = gsap.utils.toArray("[data-horizontal-logos]");


    gsap.fromTo(this.logos, 
      { x: "10vw", opacity: 0 }, 
      { x: "0vw", opacity: 1, stagger: 0.1 ,delay: 0.25 , duration: 1.5,ease: "custom" }, "<"
    );

    // gsap.fromTo(this.logos, 
    //   { x: "10vw", opacity: 0 }, 
    //   { x: "0vw", opacity: 1, stagger: 0.1 , duration: 1.5,ease: "custom" }, "<"
    // );

  }



  initProgressUI() {

    this.progressBarContainer = document.createElement('div');
    this.progressBarContainer.className = 'progress-bar-container';
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'progress-bar';
    this.progressBarContainer.appendChild(this.progressBar);
    document.body.appendChild(this.progressBarContainer);

  }



  kill() {

    

    // if (this.context.gl) {

    //   this.context.sceneInstance.killDetailed() 

    // }



           if (this.progressBarContainer && this.progressBarContainer.parentNode) {
            this.progressBarContainer.parentNode.removeChild(this.progressBarContainer);
            this.progressBarContainer = null;
            this.progressBar = null;
          }

          setTimeout(() => {
            if (this.ctx) {
              this.ctx.revert();
              this.ctx = null;
            }
           }, 0);

  
           setTimeout(() => {
            window.removeEventListener('resize', this.handleResizeBound);

           }, 0);



           setTimeout(() => {
            this.target = null;
            this.closePin = null;
            this.mediaPin = null;
            this.sections = null;
            this.scrollTween = null;
            this.logos = null;
           }, 0);



    
  }




}

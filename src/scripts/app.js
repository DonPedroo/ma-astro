import { gsap } from 'gsap';
import { Scroll } from './scroll';
import { GsapAnimations } from "./gsapAnimations";
import { WhatWeDoTrigger } from "./whatwedo";
import { MenuHandler } from "./nav";
import barba from '@barba/core';
import { QuoteAnimations } from './Quotes'; 
import { Animation } from './Animation';
import { getGPUInfo } from './gpuInfo'; 

class App {
  constructor() {

    this.scrollManager = new Scroll(); 
    // this.triggerManager = new GsapAnimations(); 
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isMobile = false;
    this.gl = false
    this.cursor = null; // Initialize as null
    this.whatwedo = new WhatWeDoTrigger(this); 
    this.nav = new MenuHandler(this); 
    this.homeAnimation = new Animation(this); 

    this.quoteAnimations = new QuoteAnimations(this);
    this.horizontalScroll = null;
    this.initBarba(); 
    
    this.handleResize(); 



      // Detect if the device is a touchscreen
      this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Only evaluate WebGL and GPU info if not a touchscreen device
    if (!this.isMobile) {
      const gpuInfo = getGPUInfo();

      // If GPU info is available, enable WebGL
      if (gpuInfo) {
        console.log("set gl true");
        this.gl = true;
        this.initGl();
      }
  }

  }


    setMediaOpacity(opacity) {
return
      if (!this.gl) return
    const mediaElements = document.querySelectorAll('img, video');
    mediaElements.forEach(media => {
      media.style.opacity = opacity;

    });
  }



  handleResize() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    });
  }

async initGl() {
  
  if (this.gl) {

    console.log("gl started")

    const { ThreeScene } = await import('./threeScene');
    this.sceneInstance = new ThreeScene(this);
  }


}


  initBarba() {
    barba.init({
      views: [
        {
          namespace: 'home',
          beforeLeave: (data) => {

          // console.log("home beforeLeave >>>>")


            const projectName = data.trigger.dataset.projectName;
            const media = document.querySelector(`#${projectName} video`) || document.querySelector(`#${projectName} img`);

            // console.log("home beforeLeave >>>> media",media)

            if (media) {
              document.querySelector('#persistent-container').appendChild(media);
            }
          },
          afterEnter: async (data) => {

            
                        gsap.delayedCall(2, () => {
                          this.quoteAnimations.init();
                        });
                        

                        setTimeout(() => {
                          this.quoteAnimations.init();
                        }, 0);


                        
            this.scrollManager.initEffects()

            
            setTimeout(() => {
              this.nav.init()
            }, 0);

            setTimeout(() => {
              this.homeAnimation.init()
            }, 0);


            

              this.whatwedo.initScrollTriggers()


            if (!this.isMobile) {
              if (!this.cursor) {
                const { MouseEvenets } = await import('./Cursor');
                this.cursor = new MouseEvenets(this);
              }
              setTimeout(() => {
                this.cursor.mousePointer()
              }, 0);
            }

             // Make project-wrapper div clickable and handle Barba.js navigation
             
              setTimeout(() => {
                document.querySelectorAll('[data-case-study]').forEach(project => {
                  project.addEventListener('click', (event) => {
                    const link = project.querySelector('a');
                    if (link) {
                      event.preventDefault();
                      link.click(); 
                    }
                  });
                });
                            }, 0);



            if (this.horizontalScroll) {

              setTimeout(() => {
                this.horizontalScroll.kill();
              }, 0);
            }

            if (this.isMobile) {
              this.scrollManager.smoother.scrollTop(0);
            }
            


            
            data.current.container.remove();
            const projectName = data.trigger.dataset.projectName;
            this.scrollManager.scrollToProject(projectName);
            const media = document.querySelector("#persistent-container video") || document.querySelector("#persistent-container img");
            if (media) {
              const sectionMedia = document.querySelector(`#${projectName} video`) || document.querySelector(`#${projectName} img`);
              if (sectionMedia) {
                sectionMedia.replaceWith(media); 
              }
            }

            
          },
        },
        {
          beforeLeave: (data) => {
            const sectionElement = data.current.container.querySelector("section");
            if (sectionElement) {
              const media = sectionElement.querySelector("video") || sectionElement.querySelector("img");
              if (media) {
                document.querySelector('#persistent-container').appendChild(media);
              }
            }
            
          },
          namespace: 'project-detail',
          beforeEnter: async () => {
            this.setMediaOpacity(0);
            this.scrollManager.killEffects()
            this.whatwedo.killScrollTriggers()
            this.quoteAnimations.kill();
            this.nav.kill()
            this.homeAnimation.kill()


            
            if (!this.isMobile) {
              if (!this.horizontalScroll) {
                const { horizontalScroll } = await import('./horizontalScroll');
                this.horizontalScroll = new horizontalScroll(this);
              }
              this.horizontalScroll.init();
            }

            if (!this.isMobile) {

              if (!this.cursor) {
                const { MouseEvenets } = await import('./Cursor');
                this.cursor = new MouseEvenets(this);
              }
              this.cursor.mousePointer()
              this.cursor.animateMouseFollow(true, false,true);

            }



          },
          afterEnter: async (data) => {
            console.log("project-detail afterEnter >>>>")

            data.current.container.remove();

            if(this.cursor) {

              this.cursor.mousePointer()
            }

      

            const media = document.querySelector("#persistent-container video") || document.querySelector("#persistent-container img");
            if (media) {
              const sectionMedia = document.querySelector('section video') || document.querySelector('section img');
              if (sectionMedia) {
                sectionMedia.replaceWith(media); 
              }
            }
          },
        }
      ],
    });
  }
}

// Attach the App class to the window or use an inline script in your Astro component
document.addEventListener('DOMContentLoaded', () => {
  new App();
});

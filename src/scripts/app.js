import { Scroll } from './scroll';
import { GsapAnimations } from "./gsapAnimations";
import { WhatWeDoTrigger } from "./whatwedo";
import { MenuHandler } from "./nav";
import barba from '@barba/core';
import { QuoteAnimations } from './Quotes'; // Adjust path as necessary

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
    this.quoteAnimations = new QuoteAnimations(this);
    this.horizontalScroll = null;
    this.initBarba(); 
    this.init();
    this.handleResize(); 


  }

  handleResize() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    });
  }

async init() {
  
  if (this.gl) {

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
            // this.triggerManager.initScrollTriggers();
            this.whatwedo.initScrollTriggers()
            this.quoteAnimations.init();
            this.scrollManager.initEffects()
            this.nav.init()


            if (!this.isMobile) {
              if (!this.cursor) {
                const { MouseEvenets } = await import('./Cursor');
                this.cursor = new MouseEvenets(this);
              }
              this.cursor.mousePointer()
            }



            if (this.horizontalScroll) {
              this.horizontalScroll.kill();
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
            // this.triggerManager.killScrollTriggers();
            this.scrollManager.killEffects()
            this.whatwedo.killScrollTriggers()
            this.quoteAnimations.kill();
            this.nav.kill()

            
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

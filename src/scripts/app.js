import { Scroll } from './scroll';
import { GsapAnimations } from "./gsapAnimations";
import { WhatWeDoTrigger } from "./whatwedo";
import { MouseEvenets } from "./Cursor";
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

    this.cursor = new MouseEvenets(this); 
    this.whatwedo = new WhatWeDoTrigger(this); 
    this.nav = new MenuHandler(this); 
    this.quoteAnimations = new QuoteAnimations(this);
    this.initBarba(); 
    this.init();

  }

async init() {
  
  if (this.gl) {
    // Dynamically import the ThreeScene class only if needed
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

            const projectName = data.trigger.dataset.projectName;
            const media = document.querySelector(`#${projectName} video`) || document.querySelector(`#${projectName} img`);
            if (media) {
              document.querySelector('#persistent-container').appendChild(media);
            }
          },
          afterEnter: (data) => {
            // this.triggerManager.initScrollTriggers();
            this.whatwedo.initScrollTriggers()
            this.quoteAnimations.init();
            this.scrollManager.initEffects()
            this.nav.init()
            this.cursor.mousePointer()

            console.log("afterEnter >>>>")

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
          beforeEnter: () => {
            // this.triggerManager.killScrollTriggers();
            this.scrollManager.killEffects()
            this.whatwedo.killScrollTriggers()
            this.quoteAnimations.kill();
            this.nav.kill()
            


          },
          afterEnter: (data) => {

            data.current.container.remove();
            this.cursor.mousePointer()

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

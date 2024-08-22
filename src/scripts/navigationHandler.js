import { Scroll } from './scroll';
import { GsapAnimations } from "./gsapAnimations";
import { WhatWeDoTrigger } from "./whatwedo";
import { MenuHandler } from "./nav";
import barba from '@barba/core';
import { QuoteAnimations } from './quoteAnimations'; // Adjust path as necessary

export class NavigationHandler {
  constructor(context) {

    this.context = context
    this.scrollManager = new Scroll(); 
    // this.triggerManager = new GsapAnimations(); 
    this.whatwedo = new WhatWeDoTrigger(this.context); 
    this.nav = new MenuHandler(this.context); 
    this.quoteAnimations = new QuoteAnimations(this.context);
    this.initBarba(); 

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


            this.nav.init()

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
            this.whatwedo.killScrollTriggers()
            this.quoteAnimations.kill();
            this.nav.kill()

          },
          afterEnter: (data) => {

            data.current.container.remove();


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

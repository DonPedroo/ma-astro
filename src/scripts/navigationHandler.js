import { Scroll } from './scroll';
import { GsapAnimations } from "./gsapAnimations";
import barba from '@barba/core';
import { QuoteAnimations } from '../scripts/quoteAnimations'; // Adjust path as necessary

export class NavigationHandler {
  constructor() {
    this.scrollManager = new Scroll(); 
    this.triggerManager = new GsapAnimations(); 

    this.initBarba(); 
    QuoteAnimations.init();
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
            this.triggerManager.initScrollTriggers();
            QuoteAnimations.init();

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
            const container = data.current.container.firstElementChild.id;
            const media = document.querySelector(`#${container} video`) || document.querySelector(`#${container} img`);
            if (media) {
              document.querySelector('#persistent-container').appendChild(media);
            }
          },
          namespace: 'project-detail',
          beforeEnter: () => {
            this.triggerManager.killScrollTriggers();
            QuoteAnimations.kill();

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

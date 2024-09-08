import { gsap } from 'gsap';
import { Scroll } from './scroll';
import { GsapAnimations } from "./gsapAnimations";
import { WhatWeDoTrigger } from "./whatwedo";
import barba from '@barba/core';
import { QuoteAnimations } from './Quotes'; 
import { AnimationHome } from './AnimationManagerHome';
import { horizontalScrollGsap } from './horizontalScrollGsap';
import { toggleVisibility } from './toggleVisibility.js';


import { getGPUInfo } from './gpuInfo'; 

class App {
  constructor() {

    this.scrollManager = new Scroll(); 
    this.triggerManager = new GsapAnimations(); 
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isMobile = false;
    this.gl = false
    this.cursor = null; // Initialize as null
    this.whatwedo = new WhatWeDoTrigger(this); 
    this.nav = null
    this.navTouch = null


    this.homeAnimation = new AnimationHome(this); 
    // this.detailedAnimation = new AnimationDetailed(this); 

    this.quoteAnimations = new QuoteAnimations(this);
    this.horizontalScroll = null;
    this.horizontalScrollGsap = new horizontalScrollGsap(this);

    this.initBarba(); 
    
    this.handleResize(); 



      // Detect if the device is a touchscreen
      this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Only evaluate WebGL and GPU info if not a touchscreen device
    if (!this.isMobile) {
      const gpuInfo = getGPUInfo();

      // If GPU info is available, enable WebGL
      if (gpuInfo) {
        // console.log("set gl true");
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

    // console.log("gl started")

    const { ThreeScene } = await import('./threeScene');
    this.sceneInstance = new ThreeScene(this);
  }


}

// Home View Methods

handleHomeBeforeLeave(data) {
  const projectName = data.trigger.dataset.projectName;
  const media = document.querySelector(`#${projectName} video`) || document.querySelector(`#${projectName} img`);
  // console.log("handleHomeBeforeLeave media >>>>> ",projectName,media)
  if (media) {
    document.querySelector('#persistent-container').appendChild(media);
  }
}

async handleHomeAfterEnter(data) {
  this.initAnimations();
            if (!this.isMobile) {
              if (!this.cursor) {
                const { MouseEvenets } = await import('./Cursor');
                this.cursor = new MouseEvenets(this);
              }
              setTimeout(() => {
                this.cursor.mousePointer()
              }, 0);
            }
  this.initProjectLinks();
  this.cleanUpHorizontalScroll();


  if (this.isMobile) {
    if (!this.navTouch) {
      const { MenuHandlerTouch } = await import('./navTouch');
      this.navTouch = new MenuHandlerTouch(); 
      this.navTouch.init();
    }
  } else {
    // console.log("<<<<<<")
    if (!this.nav) {
      // console.log("<<<<<<")

      const { MenuHandler } = await import('./nav');
      this.nav = new MenuHandler(); 
      this.nav.init();
    }


  }

  


  this.scrollManager.smoother.scrollTop(0);



  this.finalizeHomeTransition(data);

  
}

// Home Utility Methods
initAnimations() {
  this.scrollManager.initEffects();
  this.whatwedo.initScrollTriggers();

  // setTimeout(() => {
  //   this.homeAnimation.init();
  // }, 0);
  setTimeout(() => {
    this.homeAnimation.init();
  });
  setTimeout(() => {
    this.quoteAnimations.init();
  }, 0);

  // setTimeout(() => {
  //   this.triggerManager.init();
  // }, 0);

}

initProjectLinks() {
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
}

cleanUpHorizontalScroll() {


  setTimeout(() => {
      this.horizontalScrollGsap.kill();
    }, 0);


  // if (this.horizontalScroll) {
  //   this.horizontalScroll.kill();
  // }

  // requestIdleCallback(() => {
  //   this.detailedAnimation.kill();
  // });
}

finalizeHomeTransition(data) {
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
}

// Detailed Page View Methods

handleProjectBeforeLeave() {

  const sectionElement = document.querySelector("[data-detailed-media]");
  if (sectionElement) {
    const media = sectionElement.querySelector("video") || sectionElement.querySelector("img");
    // console.log("media", media)
    if (media) {
      document.querySelector('#persistent-container').appendChild(media);
    }
  }
}

handleProjectBeforeEnter() {
  this.prepareForProjectDetail();

}

handleProjectAfterEnter(data) {

  data.current.container.remove();
  // this.scrollManager.smoother.scrollTop(0);

  this.restoreMedia();
  if (this.cursor) {
    // console.log(">>> mouse pointer ?")
    this.cursor.mousePointer();
  }

  
}


// Detailed Page Utility Methods

async prepareForProjectDetail() {
  this.setMediaOpacity(0);
  this.scrollManager.killEffects();
  this.whatwedo.killScrollTriggers();
  this.quoteAnimations.kill();

  if (this.navTouch) {
  this.navTouch.kill();
  this.navTouch = null
  }
  if (this.nav) {
    this.nav.kill();
    this.nav = null
    }

  this.homeAnimation.kill();

  // setTimeout(() => {
  //   this.triggerManager.kill();
  // }, 0);

  // if (!this.isMobile) {
  //   if (!this.horizontalScroll) {
  //     const { horizontalScroll } = await import('./horizontalScroll');
  //     this.horizontalScroll = new horizontalScroll(this);
  //   }
  //   this.horizontalScroll.init();
  // }

    this.scrollManager.smoother.scrollTop(0);

  // this.horizontalScrollGsap.init();

  setTimeout(() => {
    this.horizontalScrollGsap.init();
  }, 0);

  if (!this.isMobile) {
    if (!this.cursor) {
      const { MouseEvenets } = await import('./Cursor');
      this.cursor = new MouseEvenets(this);
    }
    this.cursor.mousePointer();
    this.cursor.animateMouseFollow(true, false, true);
  }

  // console.log(">>>>>>>>>")
  // this.detailedAnimation.init();

}

restoreMedia() {
  const media = document.querySelector("#persistent-container video") || document.querySelector("#persistent-container img");
  if (media) {

    const sectionElement = document.querySelector("[data-detailed-media] video") || document.querySelector("[data-detailed-media] img");

    if (sectionElement) {
      sectionElement.replaceWith(media); 
    }
  }
}

// Barba.js

  initBarba() {
    barba.init({
      views: [
        {
          namespace: 'home',
          beforeLeave: this.handleHomeBeforeLeave.bind(this),
          afterEnter: this.handleHomeAfterEnter.bind(this),
        },
        {
          namespace: 'project-detail',
          beforeLeave: this.handleProjectBeforeLeave.bind(this),
          beforeEnter: this.handleProjectBeforeEnter.bind(this),
          afterEnter: this.handleProjectAfterEnter.bind(this),
        }
      ],
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});

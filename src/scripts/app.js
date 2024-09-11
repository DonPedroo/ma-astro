import { gsap } from 'gsap';
import { Scroll } from './scroll';
import { GsapAnimations } from "./gsapAnimations";
import { WhatWeDoTrigger } from "./whatwedo";
import barba from '@barba/core';
import { QuoteAnimations } from './Quotes'; 
import { AnimationHome } from './AnimationManagerHome';
// import { horizontalScroll } from './horizontalScroll.js'
import { toggleVisibility } from './toggleVisibility.js';
import { createBackgroundsArray } from './backgroundManager.js'; // Adjust the path as necessary


import { getGPUInfo } from './gpuInfo'; 

class App {
  constructor() {

        console.log("app start")
        this.backgrounds = createBackgroundsArray();
        if (this.backgrounds.length > 0) {
          console.log("app start backgrounds > 0 run")

          toggleVisibility(this.backgrounds[0].element, { show: true,delay: 1,duration:5 });      
        } 

    this.scrollManager = new Scroll(); 
    this.triggerManager = new GsapAnimations(this); 
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

    this.initBarba(); 
    
    this.handleResize(); 


      // Detect if the device is a touchscreen
      this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  //   if (!this.isMobile) {
  //     const gpuInfo = getGPUInfo();

  //     if (gpuInfo) {
  //       this.gl = true;
  //       this.initGl();
  //     }
  // }

  this.gl = false;

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


  // const projectName = data.trigger.dataset.projectName;

  // console.log("namespace: 'home', handleHomeBeforeLeave  data.trigger.dataset.projectName >>>>> ",data.trigger.dataset.projectName)


  const trigger = data.trigger;


  const projectName = this.projectName(trigger);



  

      // console.log("trigger: ",data.trigger,"previous: ",barba.history.previous,"current: ",barba.history.current,"projectName",projectName)


  const media = document.querySelector(`#${projectName} video`) || document.querySelector(`#${projectName} img`);
  // console.log("namespace: 'home', handleHomeBeforeLeave  >>>>> ")
  // console.log("namespace: 'home', handleHomeBeforeLeave  >>>>> media",data.trigger)

  if (media) {
    // console.log("namespace: 'home', handleHomeBeforeLeave media >>>>> ",media)

    document.querySelector('#persistent-container').appendChild(media);
  }
}

async handleHomeAfterEnter(data) {

      // console.log("namespace: 'home', handleHomeAfterEnter <<<<<<")

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


  if (!this.backgrounds || this.backgrounds.length === 0) {
    this.backgrounds = createBackgroundsArray();
    // intro video/image immediate reveal

    console.log("Backgrounds array initialized:", this.backgrounds);
  } else {
    console.log("Backgrounds array already populated:", this.backgrounds);
  }
  toggleVisibility(this.backgrounds[0].element, { show: true, duration:0 });      


  this.scrollManager.initEffects();
  this.whatwedo.initScrollTriggers();

  setTimeout(() => {
    this.homeAnimation.init();
  });
  setTimeout(() => {
    this.quoteAnimations.init();
  }, 0);

  setTimeout(() => {
    this.triggerManager.init();
  }, 500);


}

initProjectLinks() {


              setTimeout(() => {

                document.querySelectorAll('[data-case-study]').forEach(project => {
                  project.addEventListener('click', (event) => {
                    const link = project.querySelector('a');  // Get the anchor element
                    if (link) {
                      const href = link.getAttribute('href');  // Get the href value
                      event.preventDefault();  // Prevent default click behavior
                
                      barba.go(href, project, event);
                    }
                  });
                });
                
  }, 0);
}

cleanUpHorizontalScroll() {


  setTimeout(() => {
    if (this.horizontalScroll) {
      this.horizontalScroll.kill();
    }
    }, 0);
}

extractProjectName(url) {
  const urlParts = url.split('/');  // Split the URL by "/"
  return urlParts[urlParts.length - 1];  // Return the last part (project name)
}

projectName(trigger) {

  // Check for forward or backward navigation
  if (trigger === "forward" || trigger === "back") {
    // Check if the current or previous URL exists before trying to extract project name
    const currentUrlExists = barba.history.current && barba.history.current.url;
    const previousUrlExists = barba.history.previous && barba.history.previous.url;

    const currentProjectName = currentUrlExists ? this.extractProjectName(barba.history.current.url) : '';
    const previousProjectName = previousUrlExists ? this.extractProjectName(barba.history.previous.url) : '';


    // console.log(">>>>>>>>>>>>>>>> currentProjectName ", currentProjectName, "previousProjectName ",previousProjectName);

    // Check which URL has the project name
    const projectName = currentProjectName !== '' ? currentProjectName : previousProjectName;

    // Log the selected project name
    // console.log(">>>>>>>>>>>>>>>> Selected project name:", projectName, "trigger",trigger);

    return projectName;  // Return the project name
  }

  // Check if trigger.dataset.projectName exists, return null if it doesn't
  if (trigger.dataset && trigger.dataset.projectName) {
    // console.log("Returning project name from dataset:", trigger.dataset.projectName);

    return trigger.dataset.projectName;
  }

  // Return null if no dataset.projectName exists
  // console.log("No project name found, returning null.");

  return null;
}



finalizeHomeTransition(data) {



  // console.log("namespace: 'home', finalizeHomeTransition >>>>>>>>>>>",barba.history.previous.url,data.trigger)

  


  if (!data.current.container) return



  data.current.container.remove();

  const trigger = data.trigger;
  const projectName = this.projectName(trigger);

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
  // console.log("namespace: 'project-detail' handleProjectBeforeLeave ")

  const sectionElement = document.querySelector("[data-detailed-media]");
  if (sectionElement) {
    const media = sectionElement.querySelector("video") || sectionElement.querySelector("img");
    if (media) {
      document.querySelector('#persistent-container').appendChild(media);
    }
  }
}

handleProjectBeforeEnter() {
  // console.log("namespace: 'project-detail' handleProjectBeforeEnter ")

  this.prepareForProjectDetail();

}

handleProjectAfterEnter(data) {
  // console.log("namespace: 'project-detail' handleProjectAfterEnter ")
  if (!data.current.container) return

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


    this.triggerManager.kill();

    this.scrollManager.smoother.scrollTop(0);
    if (!this.isMobile) {
      if (!this.horizontalScroll) {
        const { horizontalScroll } = await import('./horizontalScroll');
        this.horizontalScroll = new horizontalScroll(this);
      }
        setTimeout(() => {
       this.horizontalScroll.init();
  }, 0);
    }


  if (!this.isMobile) {
    if (!this.cursor) {
      const { MouseEvenets } = await import('./Cursor');
      this.cursor = new MouseEvenets(this);
    }
    this.cursor.mousePointer();
    this.cursor.animateMouseFollow(true, false, true);
  }

  toggleVisibility("[data-arrow-scroll-close]", { show: true,delay: .5,duration:3 });      


  // setTimeout(() => {
  //   this.triggerManager.kill();
  // }, 0);


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




      debug: true,
 


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

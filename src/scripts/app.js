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

    this.gl = false

          this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

            if (!this.isMobile) {
              const gpuInfo = getGPUInfo();
        
              if (gpuInfo) {
                this.gl = true;
              }
          }

          this.backgrounds = createBackgroundsArray(this.gl);

          if (this.gl) {
            this.initGl(this,this.backgrounds);
          }

    console.log("app start")
    this.scrollManager = new Scroll(); 
    this.triggerManager = new GsapAnimations(this); 
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isMobile = false;
    this.cursor = null; // Initialize as null
    this.whatwedo = new WhatWeDoTrigger(this); 
    this.nav = null
    this.navTouch = null

    this.lastKnownProjectName = null;



    this.homeAnimation = new AnimationHome(this); 
    // this.detailedAnimation = new AnimationDetailed(this); 

    this.quoteAnimations = new QuoteAnimations(this);
    this.horizontalScroll = null;
    this.viewOnceRan = {};
    this.initBarba(); 
    
    this.handleResize(); 




  // this.gl = false;

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

// Home View Methods

handleHomeBeforeEnter () {

  console.log("handleHomeBeforeEnter")
  // this.backgrounds = createBackgroundsArray(this.gl);

  // if (this.gl) {
  //   this.initGl(this,this.backgrounds);
  // }

  //   if (!this.backgrounds || this.backgrounds.length === 0) {
  //   this.backgrounds = createBackgroundsArray();
  //   // intro video/image immediate reveal

  //   console.log("Backgrounds array initialized:", this.backgrounds);
  // } else {
  //   console.log("Backgrounds array already populated:", this.backgrounds);
  // }


}

handleHomeBeforeLeave(data) {
  console.log("handleHomeBeforeLeave")


  // const projectName = data.trigger.dataset.projectName;

  // console.log("namespace: 'home', handleHomeBeforeLeave  data.trigger.dataset.projectName >>>>> ",data.trigger.dataset.projectName)


  const trigger = data.trigger;


  console.log("projectName call home to project not good >")
  const projectName = this.projectName(trigger);

  this.scrollManager.scrollToProject(projectName);


  this.saveHomeMedia(projectName)


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


finalizeHomeTransition(data) {

  if (!data.current.container) return



  data.current.container.remove();

  const trigger = data.trigger;

  console.log("projectName call project to home >")

  const projectName = this.projectName(trigger);

  this.scrollManager.scrollToProject(projectName);


  
  this.restoreHomeMedia(projectName)


}



// Home Utility Methods
initAnimations() {


  // if (!this.backgrounds || this.backgrounds.length === 0) {
  //   this.backgrounds = createBackgroundsArray();
  //   // intro video/image immediate reveal

  //   console.log("Backgrounds array initialized:", this.backgrounds);
  // } else {
  //   console.log("Backgrounds array already populated:", this.backgrounds);
  // }

  console.log("initAnimations this.backgrounds",)

  // toggleVisibility(this.backgrounds[0].element, { show: true, duration:0 });      


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

  // setTimeout(() => {
  //   this.triggerManager.init();
  // }, 0);
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




// Detailed Page View Methods

handleProjectBeforeEnter() {
  // console.log("namespace: 'project-detail' handleProjectBeforeEnter ")

  this.prepareForProjectDetail();

}

handleProjectBeforeLeave() {

  this.saveDetailedMedia()

}







handleProjectAfterEnter(data) {
  // console.log("namespace: 'project-detail' handleProjectAfterEnter ")
  if (!data.current.container) return

  data.current.container.remove();
  // this.scrollManager.smoother.scrollTop(0);

  this.restoreDetailedMedia();
  if (this.cursor) {
    // console.log(">>> mouse pointer ?")
    this.cursor.mousePointer();
  }

  

  
}


// Detailed Page Utility Methods

async prepareForProjectDetail() {
  // this.setMediaOpacity(0);
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

// project name extraction utils

extractProjectName(url) {
  const urlParts = url.split('/');  // Split the URL by "/"
  return urlParts[urlParts.length - 1];  // Return the last part (project name)
}

projectName(trigger) {


  
  // console.log("XXXXXXXXXXXXXXXXXXX hstory current: ",barba.history.current,"history previouse: ",barba.history.previous);


  // Check for forward or backward navigation
  if (trigger === "forward" || trigger === "back") {
    // Check if the current or previous URL exists before trying to extract project name
    const currentUrlExists = barba.history.current && barba.history.current.url;
    const previousUrlExists = barba.history.previous && barba.history.previous.url;

    const currentProjectName = currentUrlExists ? this.extractProjectName(barba.history.current.url) : '';
    const previousProjectName = previousUrlExists ? this.extractProjectName(barba.history.previous.url) : '';

    // console.log(">>>>>>>>>>>>>>>> barba.history.current ", barba.history.current, "barba.history.previous ",barba.history.previous);

    // console.log(">>>>>>>>>>>>>>>> currentProjectName ", currentProjectName, "previousProjectName ",previousProjectName);

    const projectName = currentProjectName !== '' ? currentProjectName : previousProjectName;

    if (!projectName && this.lastKnownProjectName) {
      // console.log("Returning last known project name:", this.lastKnownProjectName);
      return this.lastKnownProjectName;
    }

    return projectName;  
  }

  if (trigger.dataset && trigger.dataset.projectName) {
    console.log("Returning project name from dataset:", trigger.dataset.projectName);
    this.lastKnownProjectName = trigger.dataset.projectName;

    return trigger.dataset.projectName;
  }


  console.log("No project name found, returning null.");

  return null;
}



// media save/restore utils

saveDetailedMedia() {

  if (this.gl) {

    const gl = document.querySelector("#gl");

    if (gl) {
      gl.classList.remove('-z-10'); 
      gl.classList.add('z-50'); 
    }

  }
  

  console.log("saveDetailedMedia >")

  // storing media from detailed page
  const sectionElement = document.querySelector("[data-detailed-media]");
  if (sectionElement) {
    const media = sectionElement.querySelector("video") || sectionElement.querySelector("img");
    if (media) {
      document.querySelector('#persistent-container').appendChild(media);
    }
  }

}

restoreDetailedMedia() {

  // Replacing media on the project detailed page

  if (this.gl) {

    const gl = document.querySelector("#gl");

    if (gl) {
      gl.classList.remove('z-50'); 
      gl.classList.add('-z-10'); 
    }

  }

  console.log("restoreDetailedMedia >")

  const media = document.querySelector("#persistent-container video") || document.querySelector("#persistent-container img");
  if (media) {

    const sectionElement = document.querySelector("[data-detailed-media] video") || document.querySelector("[data-detailed-media] img");

    if (sectionElement) {
      sectionElement.replaceWith(media); 
    }
  }
}

saveHomeMedia(projectName) {

  console.log("saveHomeMedia >",projectName)

  if (this.gl) {

    const gl = document.querySelector("#gl");

    if (gl) {
      gl.classList.remove('-z-10'); 
      gl.classList.add('z-50'); 
    }

  }

  const media = document.querySelector(`#${projectName} video`) || document.querySelector(`#${projectName} img`);

  if (media) {
    document.querySelector('#persistent-container').appendChild(media);
  }

}

restoreHomeMedia(projectName) {

  console.log("restoreHomeMedia >",projectName)

  if (this.gl) {

    const gl = document.querySelector("#gl");

    if (gl) {
      gl.classList.remove('z-50'); 
      gl.classList.add('-z-10'); 
    }

  }

  const media = document.querySelector("#persistent-container video") || document.querySelector("#persistent-container img");
  if (media) {
    // console.log("projectName",projectName)
    const sectionMedia = document.querySelector(`#${projectName} video`) || document.querySelector(`#${projectName} img`);
    if (sectionMedia) {
      sectionMedia.replaceWith(media); 
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
          beforeEnter: this.handleHomeBeforeEnter.bind(this),
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

import { Scroll } from './scroll';
import { GsapAnimations } from "./gsapAnimations";
import { WhatWeDoTrigger } from "./whatwedo";
import barba from '@barba/core';
import { QuoteAnimations } from './Quotes'; 
import { AnimationHome } from './AnimationManagerHome';
// import { horizontalScroll } from './horizontalScroll.js'
import { toggleVisibility } from './toggleVisibility.js';
import { useTextAnimation } from './AnimationText'; 
import { preloadMedia } from './preloader';

import { createBackgroundsArray } from './backgroundManager.js'; // Adjust the path as necessary
import { touchBackgrounds } from './touchBackgrounds.js'; // Adjust the path as necessary



import { getGPUInfo } from './gpuInfo'; 

class App {
  constructor() {
    this.startPage = null
    this.isMobile = false;
    this.gl = false
    this.once = false

          this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

          //   if (!this.isMobile) {
          //     const gpuInfo = getGPUInfo();
        
          //     if (gpuInfo) {
          //       this.gl = true;
          //     }
          // }

          this.backgrounds = createBackgroundsArray(this.gl);
          console.log("backgrounds",this.backgrounds)
          preloadMedia(this.backgrounds);

        
          if (this.gl) {
            this.initGl(this);
          }

    console.log("app start")
    this.scrollManager = new Scroll(); 
    this.triggerManager = new GsapAnimations(this); 
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.cursor = null; // Initialize as null
    this.whatwedo = new WhatWeDoTrigger(this); 
    this.nav = null
    this.navTouch = null
    this.lastKnownProjectName = null;
    this.homeAnimation = new AnimationHome(this); 
    // this.detailedAnimation = new AnimationDetailed(this); 
    this.quoteAnimations = new QuoteAnimations(this);
    this.horizontalScroll = null;
    this.touchScroll = null;
    this.viewOnceRan = {};
    this.horizontalScrollPos = 0
    this.initBarba(); 
    this.handleResize(); 

  }

  handleResize() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      if (this.gl) {
      this.sceneInstance.resize()
      this.sceneInstance.items.resize(this.horizontalScrollPos)
      }

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

  this.startPage = 0

  if (this.gl) {

    const chain = document.querySelector("[data-chain]");
    chain.classList.add('opacity-0')
      
  }


  if (!this.once) {
    console.log("once on homepage")



    if (!this.gl && !this.isMobile) {
      this.backgrounds[this.startPage].section.classList.remove('hidden')
      this.backgrounds[this.startPage].section.classList.add('z-20')
      this.backgrounds[this.startPage+1].section.classList.remove('hidden')
    }

    if (this.isMobile) {
      console.log("touchBackgrounds once problem here")
      touchBackgrounds(this.backgrounds, null)
    }
    this.once = true
  }

}

handleHomeBeforeLeave(data) {
  console.log("handleHomeBeforeLeave")

  const trigger = data.trigger;
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
  const projectName = this.projectName(trigger);
  if (this.isMobile) {
    setTimeout(() => {
      touchBackgrounds(this.backgrounds,projectName)
    }, 0);
  }
  this.scrollManager.scrollToProject(projectName);
  this.restoreHomeMedia(projectName)
}



initAnimations() {

  this.whatwedo.initScrollTriggers();

  setTimeout(() => {
    this.scrollManager.initEffects();
  }, 0);

  setTimeout(() => {
    this.homeAnimation.init();
  }, 0);
  setTimeout(() => {
    this.quoteAnimations.init();
  }, 0);

  setTimeout(() => {
    this.triggerManager.init();
  }, 0);

  
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
    if (this.touchScroll) {
      this.touchScroll.kill();
    }
    }, 0);

  setTimeout(() => {
    if (this.horizontalScroll) {
      this.horizontalScroll.kill();
    }
    }, 0);


    if (this.gl) {

      if ( this.sceneInstance) {

        this.sceneInstance.killDetailed() 

      }

         

        }


}




// Detailed Page View Methods

handleProjectBeforeEnter(data) {

this.prepareForProjectDetail();


let pageName = this.extractProjectName(data.next.url.href)
let matchedIndex = this.backgrounds.findIndex(bg => bg.slidesId && bg.slidesId.includes(pageName));
this.startPage = matchedIndex !== -1 ? matchedIndex : 0;

if (!this.once && !this.isMobile) {

  console.log("once on detailed")



    
    if (!this.gl) {
      this.backgrounds[this.startPage].section.classList.remove('hidden')
    this.backgrounds[this.startPage].section.classList.add('z-20')
    this.backgrounds[this.startPage+1].section.classList.remove('hidden')

  }

  this.once = true
}



}

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
        console.log("horizontalScroll created")

      }
        setTimeout(() => {
       this.horizontalScroll.init();

  }, 0);
    } else {

      const { TouchScroll } = await import('./touchScroll');

      this.touchScroll = new TouchScroll(this);

      setTimeout(() => {
        this.touchScroll.init();
   }, 0);

    }


    if (this.gl) {
      await this.waitForSceneInstance(); // Wait for sceneInstance to be ready
      if (this.sceneInstance) {
        this.sceneInstance.initDetailed(); // Run initDetailed only if sceneInstance is initialized
      }
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
  
  

  

}


waitForSceneInstance() {
  return new Promise((resolve) => {
    const checkSceneInstance = () => {
      if (this.sceneInstance) {
        resolve();
      } else {
        requestAnimationFrame(checkSceneInstance); // Keep checking on each frame
      }
    };
    checkSceneInstance();
  });
}


handleProjectBeforeLeave() {

  console.log("handleProjectBeforeLeave >>>>>>>>>")


  this.saveDetailedMedia()

}







handleProjectAfterEnter(data) {
  // console.log("namespace: 'project-detail' handleProjectAfterEnter ")

  if (this.isMobile) {

    // append media on detailed page for mobile

    let el = this.backgrounds[this.startPage].element
    const sectionElement = document.querySelector("[data-detailed-media]")
    el.classList.add('absolute', 'inset-0','z-[-1]');
  
    sectionElement.appendChild(el);

  }


 



  if (!data.current.container) return



  data.current.container.remove();
  // this.scrollManager.smoother.scrollTop(0);





  this.restoreDetailedMedia();
  if (this.cursor) {
    // console.log(">>> mouse pointer ?")

    setTimeout(() => {
      this.cursor.mousePointer();
    }, 0);
  }

  

  
}


// Detailed Page Utility Methods



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
  console.log("saveDetailedMedia >")

  const updateZIndex = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.remove('-z-10');
      element.classList.add('z-50');
    }
  };

  if (this.gl) {
    updateZIndex("#gl");
  }

  if (!this.gl && !this.isMobile) {
    updateZIndex("#media-storage");
  }



  if (this.isMobile) {
  // storing media from detailed page
  const sectionElement = document.querySelector("[data-detailed-media]");

  
  if (sectionElement) {

    const media = sectionElement.querySelector("video") || sectionElement.querySelector("img");

    if (media) {

      document.querySelector('#persistent-container').appendChild(media);
    }
  }

}

}

restoreDetailedMedia() {

  // Replacing media on the project detailed page


  const updateZIndex = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.remove('z-50');
      element.classList.add('-z-10');
    }
  };

  if (this.gl) {
    updateZIndex("#gl");
  }

  if (!this.gl && !this.isMobile) {
    updateZIndex("#media-storage");
  }


  if (this.isMobile) {

  console.log("restoreDetailedMedia >")

  const media = document.querySelector("#persistent-container video") || document.querySelector("#persistent-container img");
  if (media) {

    const sectionElement = document.querySelector("[data-detailed-media] video") || document.querySelector("[data-detailed-media] img");

    if (sectionElement) {
      sectionElement.replaceWith(media); 
    }
  }
}
}

saveHomeMedia(projectName) {

  const updateZIndex = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.remove('-z-10');
      element.classList.add('z-50');
    }
  };

  if (this.gl) {
    updateZIndex("#gl");
  }

  if (!this.gl && !this.isMobile) {
    updateZIndex("#media-storage");
  }


  if (this.isMobile) {

  const media = document.querySelector(`#${projectName} video`) || document.querySelector(`#${projectName} img`);

  if (media) {
    document.querySelector('#persistent-container').appendChild(media);
  }

}

}

restoreHomeMedia(projectName) {

  const updateZIndex = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.remove('z-50');
      element.classList.add('-z-10');
    }
  };

  if (this.gl) {
    updateZIndex("#gl");
  }

  if (!this.gl && !this.isMobile) {
    updateZIndex("#media-storage");
  }




  if (this.isMobile) {


  const media = document.querySelector("#persistent-container video") || document.querySelector("#persistent-container img");
  // console.log("media>>",media)

  if (media) {
    const section = document.querySelector(`#${projectName}`);
    if (section) {
      section.appendChild(media); 
    }
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

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toggleVisibility } from './toggleVisibility.js';
import { Color } from 'three';

gsap.registerPlugin(ScrollTrigger);

export class GsapAnimations {
  constructor(context) {
    this.ctx = null; 
    this.context = context
    toggleVisibility("[data-arrow-down]", { show: true,delay: 2 });   
  }

  init() {

    this.ctx = gsap.context(() => {
      document.querySelectorAll("[data-slides]").forEach((section,index) => {


        let triggerProps = {
          trigger: section,
          start: "top top",
          end: "bottom top",
          fastScrollEnd: true,
          onUpdate: self => this.handleUpdate({ ...this.context, progress: self.progress, end: self.end, start: self.start,index }),
          onLeave: () => this.handleLeave({ ...this.context, index }), 
          onEnterBack: () => this.handleEnterBack({ ...this.context, index })
        };

        if (section.id === "what-we-do") {


          const sections = section.querySelectorAll("aside")

          triggerProps = {
            ...triggerProps,
             end: "+=" + (this.context.height*(sections.length+1)),
           
        };

        }

        if (this.context.gl) {
          if (section.id === "how-we-get-down") {
            ScrollTrigger.create({
              trigger: "#how-we-get-down",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              fastScrollEnd: true,
              onUpdate: self => {
                if (this.context.sceneInstance) {

                  this.context.sceneInstance.backgroundMaterial.uniforms.u_chainProgress.value = self.progress;

                }

              },

              onEnter: self =>{
                if (this.context.sceneInstance) {

                this.context.sceneInstance.backgroundMaterial.uniforms.u_chainTrigger.value = 1

                }

              },

              onLeave: self =>{

                if (this.context.sceneInstance) {

                this.context.sceneInstance.backgroundMaterial.uniforms.u_chainTrigger.value = 0
                }
                

              },

              onEnterBack: self =>{
                if (this.context.sceneInstance) {


                this.context.sceneInstance.backgroundMaterial.uniforms.u_chainTrigger.value = 1
                }

              },




            
            });

          }



        }

        ScrollTrigger.create(triggerProps);
      });
    });

      



  }

  kill() {

    // if (this.context.gl) {

    //   this.context.sceneInstance.backgroundMaterial.uniforms.u_progress.value = 1

    // }

    

    if (this.ctx) {
      this.ctx.revert(); // Kills all animations and ScrollTriggers within the context
      this.ctx = null; // Clear the context reference
      ScrollTrigger.getAll().forEach((st) => st.kill()); // Extra cleanup if needed
      // console.log("All ScrollTriggers killed and GSAP context cleared.");
    }
  }

   handleUpdate(context) {
    const { progress, height, end, start, index } = context;



    let currentBgdom = this.context.backgrounds[index].section;

    let p = progress;


    let vh = height;
    let sectionHeight = end - start;
    let heightDifference = sectionHeight - vh;

    if (heightDifference > 0) {
        const offset = 0;
        let normalizedHeightDiff = heightDifference / sectionHeight;
        let adjustedProgress = (p - (normalizedHeightDiff + offset)) / (1 - (normalizedHeightDiff + offset));
        let delayedProgress = Math.max(0, Math.min(adjustedProgress, 1));
        if (this.context.gl && this.context.sceneInstance) {
          this.context.sceneInstance.backgroundMaterial.uniforms.u_progress.value = delayedProgress;
        }
        if (!this.context.isMobile) {
     
          if (currentBgdom) {
          const maxHeightValue = (1 - delayedProgress) * 100; // Decrease max-height from 100vh to 0vh
          currentBgdom.style.maxHeight = `${maxHeightValue}vh`;
        }
        }
        // console.log('index',index,'d p', delayedProgress,'p', p);
    } else {
      if (this.context.gl && this.context.sceneInstance) {
      this.context.sceneInstance.backgroundMaterial.uniforms.u_progress.value = p;
    }
    if (!this.context.isMobile) {
      if (currentBgdom) {
      const maxHeightValue = (1 - p) * 100; // Decrease max-height from 100vh to 0vh
      currentBgdom.style.maxHeight = `${maxHeightValue}vh`;
      }
  }
    }

    




  


}

 handleLeave(context) {
  const { index, backgrounds } = context;


  if (index === 0) {
      // leaving
      toggleVisibility("[data-arrow-down]", { show: false });    
      toggleVisibility("[data-arrow-up]", { show: true });    

  }

  if (index === 6) {
    toggleVisibility("[data-nav]", { show: false });      
  }

  this.adjustVideoPlayback({ index, backgrounds, direction: 'down' });
if (this.context.gl && this.context.sceneInstance) {
  this.context.sceneInstance.backgroundMaterial.uniforms.u_progress.value = 0;
}
  

  this.updateBackground( index + 1, index + 2 || 0);

}

 handleEnterBack(context) {
  const { index, backgrounds } = context;

  if (index === 0) {
      // returning
      // toggleVisibility(scrollDownLink, { show: true,delay: 1 });      
      // toggleVisibility(scrollUpLink, { show: false });      
      // toggleVisibility(nav, { show: true });      

      toggleVisibility("[data-arrow-down]", { show: true,delay: 1 });      
      toggleVisibility("[data-arrow-up]", { show: false });      


      // gsap.to("[data-nav]", {opacity: 1, overwrite: true, duration: .5, ease: "power2.inOut"});
  }

  if (index === 6) {
    toggleVisibility("[data-nav]", { show: true });      
  }

  this.adjustVideoPlayback({ index, backgrounds, direction: 'up' });

  if (this.context.gl &&  this.context.sceneInstance) {
    this.context.sceneInstance.backgroundMaterial.uniforms.u_progress.value = 1;
}
  this.updateBackground( index, index + 1);

}


 adjustVideoPlayback({ index, backgrounds, direction }) {
  // Handling when scrolling down

  if (direction === 'down') {
      // Pause the current video
      if (backgrounds[index] && backgrounds[index].type === 1) {
          this.pauseVideo(backgrounds[index].element);
      }
      
      // Play the next video, if available
      if (index + 1 < backgrounds.length &&backgrounds[index+1].type === 1) {
          this.playVideo(backgrounds[index + 1].element);
      }
      
      // Optionally, start playing the video after next as well
      if (index + 2 < backgrounds.length && backgrounds[index+2].type === 1) {
          this.playVideo(backgrounds[index + 2].element);
      }
  } 
  // Handling when scrolling up
  else if (direction === 'up') {
      // Pause the video two steps ahead, if any
      if (index + 2 < backgrounds.length && backgrounds[index+2].type === 1) {
          this.pauseVideo(backgrounds[index + 2].element);
      }
      
      // Play the current video
      if (backgrounds[index] && backgrounds[index].type === 1) {
          this.playVideo(backgrounds[index].element);
      }
  }
}

 playVideo(element) {

  
  if (!this.isVideoPlaying(element)) {
      const playPromise = element.play();
      if (playPromise !== undefined) {
          playPromise.catch(error => {
              console.error("ERROR Video play was interrupted by :", error);
              // Handle the error or retry playing as necessary
          });
      }
  }
}


pauseVideo(element) {
  if (!element.paused) {
    element.pause();
  } else {
    // console.log("The video is already paused.");
  }
}


 isVideoPlaying(video) {
  return !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
}



 updateBackground(currentIndex, nextIndex) {



  if (!this.context.gl && !this.context.isMobile) {


    let currentBgdom = this.context.backgrounds[currentIndex];
    let nextBgdom = this.context.backgrounds[nextIndex];

    this.context.backgrounds.forEach((bgdom) => {
      if (bgdom?.section) {
        bgdom.section.classList.add('hidden'); // Ensure all other sections are hidden
        bgdom.section.classList.remove('z-20');

      }
    });
  
    if (currentBgdom?.section) {
      currentBgdom.section.classList.remove('hidden');
      currentBgdom.section.classList.add('z-20');
    }
  
    if (nextBgdom?.section) {
      nextBgdom.section.classList.remove('hidden');
    }


 
  
  }


  
  if (!this.context.gl) return;
  if (!this.context.sceneInstance) return;

  nextIndex = Math.min(nextIndex, this.context.sceneInstance.backgrounds.length - 1);
  let currentBg = this.context.backgrounds[currentIndex];
  let nextBg = this.context.backgrounds[nextIndex];

    if (!currentBg || !nextBg) {

      return; // Exit the function to avoid further errors
  }
  
  this.context.sceneInstance.backgroundMaterial.uniforms.u_current.value = {
      type: currentBg.type,
      color: new Color(currentBg.gl.color),
      texture: currentBg.gl.texture,
  };

  this.context.sceneInstance.backgroundMaterial.uniforms.u_next.value = {
      type: nextBg.type,
      color: new Color(nextBg.gl.color),
      texture: nextBg.gl.texture,
  };





}


}

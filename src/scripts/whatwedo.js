// src/scripts/WhatWeDo.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export class WhatWeDoTrigger {
  constructor() {
    this.gsapContext = null;
        // this.initScrollTriggers();
        console.log("l")

  }

  initScrollTriggers() {
    this.gsapContext = gsap.context(() => {
      const section = document.getElementById("what-we-do");

      if (section) {

        const timeline = gsap.timeline({
          defaults: { ease: "none" } 
        });

        const navDivs = section.querySelectorAll("ul li div div div"); // Select all divs inside the ul li

        const asideElements = section.querySelectorAll("aside");

        const sectionDuration = 1 / asideElements.length; // Duration of each section's progress as a fraction of the total


        asideElements.forEach((aside, index) => {
          const h3 = aside.querySelector("h3");
          const images = aside.querySelectorAll("img");

          const fadeDuration = 0.2; // Shorter duration for fade-in and fade-out
          const holdDuration = 2; // Longer hold time at opacity 1
          const totalDuration = (fadeDuration * 2) + holdDuration;
  
          if (index === 0) {
            timeline.to(h3, { opacity: 1, duration: fadeDuration+holdDuration });
            timeline.to(images, { opacity: 1, duration: fadeDuration+holdDuration }, "<"); 
            timeline.to(h3, { opacity: 0, duration: fadeDuration });
            timeline.to(images, { opacity: 0, duration: fadeDuration }, "<"); 
          } else if (index === asideElements.length - 1) {
            timeline.fromTo(h3, { opacity: 0 }, { opacity: 1, duration: fadeDuration });
            timeline.fromTo(images, { opacity: 0 }, { opacity: 1, duration: fadeDuration }, "<");
            timeline.to(h3, { opacity: 1, duration: holdDuration });
            timeline.to(images, { opacity: 1, duration: holdDuration }, "<");

          } else {
            timeline.fromTo(h3, { opacity: 0 }, { opacity: 1, duration: fadeDuration })
            // timeline.fromTo(h3, { y: 0 }, { y: 20, duration: totalDuration }, "<")
            // images.forEach((img, imgIndex) => {
            //   const imageYStart = 0;
            //   const imageYEnd = 13 * (imgIndex + 1);
            //   timeline.fromTo(img, { y: 0 }, {y: imageYEnd, duration: totalDuration }, "<");
            // });
            timeline.fromTo(images, { opacity: 0 }, { opacity: 1, duration: fadeDuration }, "<")
            timeline.to(h3, { opacity: 1, duration: holdDuration });
            timeline.to(images, { opacity: 1, duration: holdDuration }, "<");
            timeline.to(h3, { opacity: 0, duration: fadeDuration });
            timeline.to(images, { opacity: 0, duration: fadeDuration }, "<");
          }
        });
        
        const progressElement = document.getElementById("what-we-do-progress");


        const triggerPropsWrap = {
          trigger: section,
          animation: timeline,
          start: "top top",
          end: "+=" + (window.innerHeight*(6)),
          markers: true,
          scrub: true, 
          pin: true,
          pinSpacing:true,
          onEnter: () => {
            console.log(`Entering inside section: ${section.id}`);
          },
          onLeave: () => {
            console.log(`Leaving  inside section: ${section.id}`);
          },
          onUpdate: (self) => {
            // if (progressElement) {
            //   progressElement.style.width = `${self.progress * 100}%`;
            // }

             // Update navigation divs based on scroll progress
          asideElements.forEach((aside, index) => {
            const start = sectionDuration * index;
            const end = start + sectionDuration;

            if (self.progress >= start && self.progress < end) {
              const progressWithinSection = (self.progress - start) / sectionDuration;
              navDivs[index].style.width = `${progressWithinSection * 100}%`;
            } else if (self.progress >= end) {
              navDivs[index].style.width = "100%";
            } else {
              navDivs[index].style.width = "0%";
            }
          });
        

          },
        };

        ScrollTrigger.create(triggerPropsWrap);




      }
    });
  }

  killScrollTriggers() {
    if (this.gsapContext) {
      this.gsapContext.revert();
      this.gsapContext = null;
      // ScrollTrigger.getAll().forEach((st) => st.kill());
      // console.log("All ScrollTriggers killed and GSAP context cleared.");
    }
  }
}

// src/scripts/WhatWeDo.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger,ScrollToPlugin,CustomEase);
CustomEase.create("custom", "M0,0 C0.16,0.67 0,1.01 1,1");

export class WhatWeDoTrigger {
  constructor(context) {
    this.gsapContext = null;
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.startValue = null;
    this.scrollJack = null;
    this.context = context;
    console.log("this.context whatwedo", this.context.isMobile)

  }

  handleLinkClick(e, index) {
    e.preventDefault();
    const items = this.navLinks; 
    let scrollTarget = this.startValue + (index * this.context.height); 
    scrollTarget += this.context.height / items.length;
    gsap.to(window, { scrollTo: scrollTarget, duration: 1, ease: "custom" });
  }

  initLinks() {
    this.navLinks.forEach((link, index) => {
      link.addEventListener('click', (e) => this.handleLinkClick(e, index));
    });
  }
  

  initScrollTriggers() {
    this.gsapContext = gsap.context(() => {
      const section = document.getElementById("what-we-do");

      if (section) {

        const timeline = gsap.timeline({
          defaults: { ease: "none" } 
        });
        this.navLinks = section.querySelectorAll("ul li div span");
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

            timeline.fromTo(images, { opacity: 0 }, { opacity: 1, duration: fadeDuration }, "<")
            timeline.to(h3, { opacity: 1, duration: holdDuration });
            timeline.to(images, { opacity: 1, duration: holdDuration }, "<");
            timeline.to(h3, { opacity: 0, duration: fadeDuration });
            timeline.to(images, { opacity: 0, duration: fadeDuration }, "<");
          }
        });
        


        const triggerPropsWrap = {
          trigger: section,
          animation: timeline,
          start: "top top",
          end: "+=" + (window.innerHeight*(6)),
          // markers: true,
          scrub: true, 
          pin: true,
          // pinType: "fixed",

          onRefresh: (self) => {
            this.startValue = self.start; 
          },
          onUpdate: (self) => {

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

        if (this.context.isMobile) {
          triggerPropsWrap.pinType = "fixed";
        }

        this.scrollJack = ScrollTrigger.create(triggerPropsWrap);



  
       this.initLinks()

      }
    });
  }

  killScrollTriggers() {

    if (this.navLinks) {
      this.navLinks.forEach(link => link.removeEventListener('click', this.handleLinkClick)); // Use stored reference
    }
    

    if (this.gsapContext) {
      this.gsapContext.revert();
      this.gsapContext = null;
      this.scrollJack = null;
      // ScrollTrigger.getAll().forEach((st) => st.kill());
      // console.log("All ScrollTriggers killed and GSAP context cleared.");
    }
  }
}

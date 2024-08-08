// src/scripts/gsapAnimations.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export class GsapAnimations {
  constructor(scene) {
    this.scene = scene;
    // this.initScrollTriggers();
  }



  initScrollTriggers() {
    // Example scroll trigger animation
    gsap.to(".element", {
      scrollTrigger: {
        trigger: ".element",
        start: "top center",
        end: "bottom center",
        scrub: true,
        onEnter: () => this.animateScene(),
      },
      x: 100,
      duration: 2,
    });
  }

  animateScene() {
    if (this.scene) {
      // Example animation interacting with the Three.js scene
      gsap.to(this.scene.rotation, {
        y: "+=0.5",
        duration: 1,
        ease: "power1.inOut"
      });
    }
  }

  updateScene() {
    if (this.scene) {
      // Logic to update the Three.js scene based on ScrollSmoother updates
      console.log("ScrollSmoother updated - update Three.js scene if needed");
    }
  }
}

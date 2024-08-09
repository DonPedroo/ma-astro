// src/scripts/app.js
// import { GsapAnimations } from "./gsapAnimations";
// import { ThreeScene } from "./threeScene";
import { NavigationHandler } from "./navigationHandler";

document.addEventListener('DOMContentLoaded', () => {
  let sceneInstance;

  console.log("app")

//   if (window.innerWidth >= 1024) { 
//     sceneInstance = new ThreeScene();
//   }
new NavigationHandler();

// new GsapAnimations();
});




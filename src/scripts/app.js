// src/scripts/app.js
import { NavigationHandler } from "./navigationHandler";
import gsap from 'gsap';
import { Vector2 } from 'three';


class App {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isMobile = false;
    this.gl = false
    this.mouse = new Vector2()
    this.followMouse = new Vector2()
    this.prevMouse = new Vector2()
    this.speed = 0;
    this.targetSpeed = 0;

    this.initialize();

    gsap.ticker.add(this.onTick);

  }

  async initialize() {
    console.log("app");

    if (this.gl) {
      // Dynamically import the ThreeScene class only if needed
      const { ThreeScene } = await import('./threeScene');
      this.sceneInstance = new ThreeScene();
    }

    new NavigationHandler(this);
  }

  mouseMove(){
    window.addEventListener('mousemove', (event) => {
        this.mouse.x = event.clientX / window.innerWidth;
        this.mouse.y = event.clientY / window.innerHeight;
    });
  }

  getSpeed(){
    this.speed = Math.sqrt( (this.prevMouse.x- this.mouse.x)**2 + (this.prevMouse.y- this.mouse.y)**2 );    
    this.targetSpeed -= 0.1*(this.targetSpeed - this.speed);    
    this.followMouse.x -= 0.1*(this.followMouse.x - this.mouse.x);
    this.followMouse.y -= 0.1*(this.followMouse.y - this.mouse.y);    
    this.prevMouse.x = this.mouse.x;
    this.prevMouse.y = this.mouse.y;
  }





onTick = () => {
this.getSpeed()


if (this.gl) {

  this.time += this.clock.getDelta();
  this.composer.render(this.time);

}


if (Math.abs(this.prevMouse.x - this.followMouse.x) < 0.0001) return;



if (this.gl) {


this.CustomMOUSE.uniforms.get('mouse').value = this.followMouse;
this.CustomMOUSE.uniforms.get('uVelo').value = Math.min(this.targetSpeed, .05);
}
if (this.cursor) {
    this.cursor.style.transform = `translate(${(this.followMouse.x*this.width)-10}px, ${(this.followMouse.y*this.height)-10}px)`
}
};



}

// Attach the App class to the window or use an inline script in your Astro component
document.addEventListener('DOMContentLoaded', () => {
  new App();
});

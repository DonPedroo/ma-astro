import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Vector2 } from 'three';
import { StickyUi } from './Sticky';

gsap.registerPlugin(ScrollTrigger);

export class MouseEvenets {
  constructor(context) {
    this.context = context; 
    this.mouse = new Vector2()
    this.followMouse = new Vector2()
    this.prevMouse = new Vector2()
    this.speed = 0;
    this.targetSpeed = 0;
    this.cursor = document.querySelector('[data-mouse-follow]');
    this.links = [];
    this.mouseEnterHandler = this.handleMouseEnter.bind(this);
    this.mouseLeaveHandler = this.handleMouseLeave.bind(this);
    this.mouseMove()
    
    gsap.ticker.add(this.onTick);

    this.sticky = new StickyUi(this.context,this.followMouse)

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



if (Math.abs(this.prevMouse.x - this.followMouse.x) < 0.0001) return;

if (this.cursor) {
    this.cursor.style.transform = `translate(${(this.followMouse.x*this.context.width)-10}px, ${(this.followMouse.y*this.context.height)-10}px)`
}    

};

handleMouseEnter(event) {
  // console.log("Cursor > handleMouseEnter ", event);
  
  const isCaseStudy = event.target.hasAttribute('data-case-study');
  // const isDrag = event.target.hasAttribute('data-horizontal-scroll');

  this.animateMouseFollow(true, isCaseStudy);
}

handleMouseLeave(event) {
  const isCaseStudy = event.target.hasAttribute('data-case-study');
  // const isDrag = event.target.hasAttribute('data-horizontal-scroll');

  this.animateMouseFollow(false, isCaseStudy);
}


  mousePointer() {

    

    // console.log("Cursor mousePointer !")


    // Clean up previous event listeners
    this.cleanupMousePointer();
    

    this.sticky.refresh() 

    // Set cursor class
    this.cursor.classList.remove('hidden');
    this.cursor.classList.add('flex');

    const links = document.querySelectorAll('[data-link]');

    links.forEach(link => {
      link.addEventListener('mouseenter', this.mouseEnterHandler);
      link.addEventListener('mouseleave', this.mouseLeaveHandler);
      this.links.push(link);
    });

  }

  cleanupMousePointer() {
    // Remove event listeners from the stored links
    this.links.forEach(link => {
      link.removeEventListener('mouseenter', this.mouseEnterHandler);
      link.removeEventListener('mouseleave', this.mouseLeaveHandler);
    });

    // Clear the stored links
    this.links = [];
  }

  animateMouseFollow(isEntering, isCaseStudy) {

    let scaleValue = 1;
    let spanOpacity = 0;
    let spanText = "";
  
    if (isEntering) {
      if (isCaseStudy) {
        scaleValue = 8;
        spanOpacity = 1;
        spanText = "View project";
      } 
      // else if (isDrag) {
      //   scaleValue = 6;
      //   spanOpacity = 1;
      //   spanText = "Drag";
      // } 
      else {
        scaleValue = 2.5;
      }
    }
  
    this.cursor.querySelector("[data-mouse-follow]>div>span").textContent = spanText;
  
    const duration = isEntering ? 1.5 : 1;
  
    gsap.killTweensOf(['[data-mouse-follow]>div>div', '[data-mouse-follow]>div>span']);
  
    gsap.to("[data-mouse-follow]>div>div", {
      scale: scaleValue,
      duration: duration,
      ease: "custom"
    });
  
    gsap.to("[data-mouse-follow]>div>span", {
      opacity: spanOpacity,
      duration: 1,
      ease: "custom"
    });
  }
  

}

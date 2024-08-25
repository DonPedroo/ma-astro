import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Vector2 } from 'three';

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
    this.stickyUIeffectInit() 
    gsap.ticker.add(this.onTick);
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


// if (this.gl) {

//   this.time += this.clock.getDelta();
//   this.composer.render(this.time);

// }


if (Math.abs(this.prevMouse.x - this.followMouse.x) < 0.0001) return;



// if (this.gl) {


// this.CustomMOUSE.uniforms.get('mouse').value = this.followMouse;
// this.CustomMOUSE.uniforms.get('uVelo').value = Math.min(this.targetSpeed, .05);
// }


if (this.cursor) {
    this.cursor.style.transform = `translate(${(this.followMouse.x*this.context.width)-10}px, ${(this.followMouse.y*this.context.height)-10}px)`
}    

};

handleMouseEnter(event) {
    const isReel = event.target.hasAttribute('data-play');
    this.animateMouseFollow(true, isReel);
  }

  handleMouseLeave(event) {
    const isReel = event.target.hasAttribute('data-play');
    this.animateMouseFollow(false, isReel);
  }

  mousePointer() {
    // Early return if on a touch device
    if (this.context.isMobile) return;

    // Clean up previous event listeners
    this.cleanupMousePointer();

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

// mousePointer() {

//      // Early return if on a touch device
//      if (this.context.isMobile) return;

//      // Set cursor class
//      this.cursor.classList.remove('hidden');
//      this.cursor.classList.add('flex');
 
//      const links = document.querySelectorAll('[data-link]');
 
 
 
//      links.forEach(link => {
//          const isReel = link.hasAttribute('data-play');
 
//          link.addEventListener('mouseenter', () => this.animateMouseFollow(true, isReel));
 
//          link.addEventListener('mouseleave', () => this.animateMouseFollow(false, isReel));
//      });

// }

animateMouseFollow(isEntering, isReel, isDrag) {

        
    let scaleValue;
    let spanOpacity;
    let spanText;

    if (!isEntering) {
        scaleValue = 1;
    } else if (isReel) {
        scaleValue = 8; 
    } else if (isDrag) {
        scaleValue = 6; 
    }
    
    else {
        scaleValue = 2.5;
    }

    if (isEntering && isReel ) {
        spanOpacity = 1;
    } else if  (isEntering && isDrag ) {
        spanOpacity = 1;
    } else {
        spanOpacity = 0;
    }

    if (isEntering && isReel) {
        spanOpacity = 1;
        spanText = "View project"; 
    } else if (isEntering && isDrag) {
        spanOpacity = 1;
        spanText = "Drag"; 
    } else {
        spanOpacity = 0;
        spanText = ""; 
    }

    this.cursor.querySelector("[data-mouse-follow]>div>span").textContent = spanText;

    const duration = isEntering ? 1.5 : 1; 

    gsap.killTweensOf(['[data-mouse-follow]>div>div', '[data-mouse-follow]>div>span']);

    gsap.to("[data-mouse-follow]>div>div", {
        scale: scaleValue,
        duration: duration,
        ease: "custom" 
    });

    if (isReel || !isEntering) {
        gsap.to("[data-mouse-follow]>div>span", {
            opacity: spanOpacity,
            duration: 1,
            ease: "custom"
        });
    }

    if (isDrag || !isEntering) {
        gsap.to("[data-mouse-follow]>div>span", {
            opacity: spanOpacity,
            duration: 1,
            ease: "custom"
        });
    }
}

stickyUIeffectInit() {
  const items = document.querySelectorAll('[data-sticky]');
  items.forEach(item => {
    this.stickyUIeffect(item);
  });
}

stickyUIeffect(item) {

  let activeArea = item.querySelector('[data-sticky]>div')
  let activeAreaInner = item.querySelector('[data-sticky]>div>div')

  // let scrollTo = null

  // if (scrollTo) {
  //     item.addEventListener('click', (e) => {
  //         e.preventDefault();
  //         gsap.to(window, {
  //             duration: 0.3,
  //             scrollTo: scrollTo,
  //             ease: "power2.out"
  //         });
  //     });
  // }



  if (this.context.isMobile) return;

  const handleMouseEnter = (e) => {
      e.preventDefault();
      gsap.to(activeArea, {
          scale: 1.2,
          duration: 0.5,
          ease: "power2.Out"
      });
      item.addEventListener('mousemove', handleMouseMove);
  };

  const handleMouseLeave = (e) => {
    e.preventDefault();
    
    gsap.to(activeArea, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power2.out"
    });
    
    gsap.to(activeAreaInner, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power2.out"
    });
    
    item.removeEventListener('mousemove', handleMouseMove);
  };
  

  const handleMouseMove = (e) => {
      e.preventDefault();
      const deltaX = ((this.followMouse.x * this.context.width) - e.clientX);
      const deltaY = ((this.followMouse.y * this.context.height) - e.clientY);


      // gsap.killTweensOf(activeArea, activeAreaInner);

      gsap.to(activeArea, {
          x: deltaX * .2,
          y: deltaY * .2,
          scale: 1.2,
          duration: 0.4,
          ease: "power2.Out"
      });

      gsap.to(activeAreaInner, {
          x: deltaX * .07,
          y: deltaY * .07,
          scale: 1.1,
          duration: 0.3,
          ease: "power2.Out"
      });
  };

  item.addEventListener('mouseenter', handleMouseEnter);
  item.addEventListener('mouseleave', handleMouseLeave);
}


  init() {

  }

  kill() {

    // this.cleanupMousePointer();

  
  }
}

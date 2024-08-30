import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export class horizontalScroll {
  constructor(context) {
    this.ctx = null;  
    this.target = null;
    this.width = null;
    this.context = context
    this.prevScroll = 0;
    this.currentScroll = 0;
    this.targetScroll = 0;
    this.scrollSpeed = 0.5;
    this.scrollSmooth = 0.08;
    this.scrollHandlerBound = this.scrollHandler.bind(this);
    this.handleResizeBound = this.handleResize.bind(this);
    this.progressBarContainer = null;

  }

  bindAll() {
    // ['animate', 'cleanup', 'startDrag', 'onDrag', 'endDrag','handleResize','startTouchDrag','onTouchDrag','endTouchDrag']

    ['animate','handleResize', 'scrollHandler', 'startDrag', 'onDrag', 'endDrag']
      .forEach((fn) => (this[fn] = this[fn].bind(this)));
  }

  init() {
    this.target = document.querySelector(`[data-horizontal-scroll]`);
    this.target.classList.remove("overflow-x-scroll", "overflow-y-hidden");
    this.width = Array.from(this.target.children).reduce((totalWidth, child) => {
      const childWidth = child.getBoundingClientRect().width;
      return totalWidth + childWidth;
    }, 0) - this.context.width;
    this.bindAll();
    this.addEventListeners();
    gsap.ticker.add(this.animate);

    this.initProgressUI()
    console.log("horizontal scroll created")

    
  }

  kill() {
    console.log("horizontal scroll killed")
    this.cleanup()
  }

  scrollHandler(e) {
    e.preventDefault();
    this.targetScroll += e.deltaY * this.scrollSpeed;
    this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.width));
  }

  animate() {
    this.currentScroll = gsap.utils.interpolate(this.currentScroll, this.targetScroll, this.scrollSmooth);
    if (this.currentScroll === this.prevScroll) return;
      gsap.set(this.target, {
        x: -this.currentScroll,
      });
    this.prevScroll = this.currentScroll;

      // const maxScrollDistance = (this.target.scrollWidth-window.innerWidth);
    const scrollPercentage = (this.currentScroll / this.width) * 100;
    // const progressBarWidth = Math.min(scrollPercentage, 100);

    gsap.set(this.progressBar, {
        width: `${scrollPercentage}%`,
      });
  }

  handleResize() {
    this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.width));
    this.width = Array.from(this.target.children).reduce((totalWidth, child) => {
      const childWidth = child.getBoundingClientRect().width;
      return totalWidth + childWidth;
    }, 0) - this.context.width;
    this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.width));
  }


  startDrag(e) {
    this.animateMouseDrag(true, false,false);

    this.isDragging = true;
    this.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    e.type.includes('touch') && e.preventDefault();
  }
  
  onDrag(e) {
    if (!this.isDragging) return;
    this. animateMouseDrag(false, true,false);
    const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    const dx = x - this.startX;
    this.startX = x;
    this.targetScroll -= dx; 
    this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.width));
  }
  
  endDrag() {
    this.animateMouseDrag(false, false,true);
    this.isDragging = false;
  }

  animateMouseDrag(start, on, end) {




    gsap.killTweensOf(['[data-mouse-follow]>div>div']);

    if (start) {


      this.target.classList.remove('cursor-grab');
      this.target.classList.add('cursor-grabbing');
    }

    if (on) {
        gsap.to("[data-mouse-follow]>div>div", {
            scale: 12,
            duration: 1,
            ease: "custom" 
        });
    

    }

    if (end) {
        gsap.to("[data-mouse-follow]>div>div", {
            scale: 6,
            duration: 1,
            ease: "custom" 
        });

        this.target.classList.remove('cursor-grabbing');
        this.target.classList.add('cursor-grab');
    }



}
  

  addEventListeners() {
    this.target.addEventListener('wheel', this.scrollHandlerBound, { passive: false });
    window.addEventListener('resize', this.handleResizeBound);

    this.target.addEventListener('mousedown', this.startDrag);
    this.target.addEventListener('mousemove', this.onDrag);
    this.target.addEventListener('mouseup', this.endDrag);

  }

  cleanup() {
    gsap.ticker.remove(this.animate);
    this.prevScroll = 0;
    this.currentScroll = 0;
    this.targetScroll = 0;
    this.target.removeEventListener('wheel', this.scrollHandlerBound);
    window.removeEventListener('resize', this.handleResizeBound);
    this.target.removeEventListener('mousedown', this.startDrag);
    this.target.removeEventListener('mousemove', this.onDrag);
    this.target.removeEventListener('mouseup', this.endDrag);
    this.target = null;
    this.width = null;


    if (this.progressBarContainer) {
      this.progressBar.remove();
      this.progressBar = null;
      this.progressBarContainer.remove();
      this.progressBarContainer = null;
    }

  }

  initProgressUI() {

    this.progressBarContainer = document.createElement('div');
    this.progressBarContainer.className = 'progress-bar-container';
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'progress-bar';
    this.progressBarContainer.appendChild(this.progressBar);
    this.target.insertAdjacentElement('afterend', this.progressBarContainer);

  }

}

import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);


export class StickyUi {
  constructor(context, followMouse) {
    this.context = context;
    this.followMouse = followMouse;
    this.stickys = new Map();
    this.handleStickyMouseEnter = this.handleStickyMouseEnter.bind(this);
    this.handleStickyMouseLeave = this.handleStickyMouseLeave.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    // this.init();
    // console.log("Sticky!", this.context, this.followMouse);
  }

  init() {
    this.refresh();
  }

  refresh() {
    this.cleanupStickyUI();
    this.initializeStickyEffects();

  }

  initializeStickyEffects() {
    const items = document.querySelectorAll('[data-sticky]');
    items.forEach(item => {
      this.addStickyEffect(item);
    });


    this.jumpLink();

  }

  addStickyEffect(item) {
    const activeArea = item.querySelector('[data-sticky]>div');
    const activeAreaInner = item.querySelector('[data-sticky]>div>div');
    this.stickys.set(item, { activeArea, activeAreaInner });
    item.addEventListener('mouseenter', this.handleStickyMouseEnter);
    item.addEventListener('mouseleave', this.handleStickyMouseLeave);
  }

  handleStickyMouseEnter(e) {
    const item = e.currentTarget;
    const { activeArea } = this.stickys.get(item);

    gsap.to(activeArea, {
      scale: 1.2,
      duration: 0.5,
      ease: "power2.Out"
    });

    item.addEventListener('mousemove', this.handleMouseMove);
  }

  handleStickyMouseLeave(e) {
    const item = e.currentTarget;
    const { activeArea, activeAreaInner } = this.stickys.get(item);

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

    item.removeEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseMove(e) {
    e.preventDefault();
    const item = e.currentTarget;
    const { activeArea, activeAreaInner } = this.stickys.get(item);

    const deltaX = ((this.followMouse.x * this.context.width) - e.clientX);
    const deltaY = ((this.followMouse.y * this.context.height) - e.clientY);

    gsap.to(activeArea, {
      x: deltaX * 0.2,
      y: deltaY * 0.2,
      scale: 1.2,
      duration: 0.4,
      ease: "power2.Out"
    });

    gsap.to(activeAreaInner, {
      x: deltaX * 0.07,
      y: deltaY * 0.07,
      scale: 1.1,
      duration: 0.3,
      ease: "power2.Out"
    });
  }

  jumpLink() {
    const items = document.querySelectorAll('[data-sticky]');
    
    items.forEach(item => {
      const link = item.querySelector('a'); // Assuming the link is inside the sticky item
      if (link && link.href.includes('#')) {
        const scrollTo = link.href.split('#')[1]; // Extract part after #

        item.addEventListener('click', (e) => {
          e.preventDefault();

          // console.log("scroll to link ",scrollTo);


          const targetElement = document.getElementById(scrollTo);
          if (targetElement) {
            // console.log("scroll to link targetElement",targetElement);

            gsap.to(window, {
              duration: 0.3,
              scrollTo: targetElement,
              ease: "power2.out"
            });


          }
        });
      } else {
        // console.log("No anchor link found in the item.");
      }
    });
  }

  cleanupStickyUI() {
    // console.log("cleanupStickyUI");
    this.stickys.forEach((_, item) => {
      item.removeEventListener('mouseenter', this.handleStickyMouseEnter);
      item.removeEventListener('mouseleave', this.handleStickyMouseLeave);
      item.removeEventListener('mousemove', this.handleMouseMove);
    });

    this.stickys.clear(); 
  }
}

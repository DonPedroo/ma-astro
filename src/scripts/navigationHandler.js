// import { Scroll } from './scroll';
import { GsapAnimations } from "./gsapAnimations";
import barba from '@barba/core';
import gsap from 'gsap';

export class NavigationHandler {
  constructor() {
    // this.currentPage = this.getCurrentPage();
    // this.scrollManager = new Scroll(); // Initialize Scroll Manager
    this.triggerManager = new GsapAnimations(); // Initialize Scroll Manager

    // this.init();
    this.initBarba()
  }

  init() {
    // Handle the initial page load
    this.handlePageLoad();

    // Listen for the astro:after-swap event to detect page changes
    // document.addEventListener('astro:after-swap', this.handlePageLoad.bind(this));


  }

  // getCurrentPage() {
  //   const bodyId = document.body.id;
  //   if (bodyId === 'home') {
  //     return 'home';
  //   } else if (bodyId === 'detailed') {
  //     return 'detailed';
  //   } else {
  //     return 'unknown';
  //   }
  // }

  // handlePageLoad() {



  //   const newPage = this.getCurrentPage();
  //   console.log(`current page is  ${newPage} `);
  //   // if (newPage !== this.currentPage) {
  //     // console.log(`Leaving ${this.currentPage} page`);
  //     // console.log(`Entering ${newPage} page`);

  //     // Enable or disable ScrollSmoother based on the new page
  //     if (newPage === 'home') {
  //       this.triggerManager.initScrollTriggers(); // Enable ScrollSmoother
  //       console.log(`init scrolltriggers`);
  //     } else  {
  //       this.triggerManager.killScrollTriggers(); // Disable ScrollSmoother
  //       console.log(`kill scrolltriggers`);

  //       // document.body.style.height = '1000px';
  //     }
  //   // }
  //   this.currentPage = newPage;
  // }

  initBarba() {


    barba.init({
      transitions: [
        {
          name: 'default-transition',
          leave({ current }) {
            return gsap.to(current.container, {
              opacity: 0,
              duration: 0.5,
            });
          },
          enter({ next }) {
            return gsap.from(next.container, {
              opacity: 0,
              duration: 0.5,
            });
          },
          afterEnter: ({ next }) => {

            const nextNamespace = next.namespace;

            // This is just a placeholder for additional logic if needed after entering a page
            console.log(`>> afterEnter, now at page: ${nextNamespace}`);

            if (nextNamespace === 'home') {
                    this.triggerManager.initScrollTriggers(); // Enable ScrollSmoother
                    console.log(`init scrolltriggers`);
                  } else  {
                    this.triggerManager.killScrollTriggers(); // Disable ScrollSmoother
                    console.log(`kill scrolltriggers`);
            
                    // document.body.style.height = '1000px';
                  }


          }
          
        },
      ],
    });
  }


}

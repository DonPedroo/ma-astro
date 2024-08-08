import { Scroll } from './scroll';

export class NavigationHandler {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.scrollManager = new Scroll(); // Initialize Scroll Manager
    this.init();
  }

  init() {
    // Handle the initial page load
    this.handlePageLoad();

    // Listen for the astro:after-swap event to detect page changes
    document.addEventListener('astro:after-swap', this.handlePageLoad.bind(this));

  }

  getCurrentPage() {
    const bodyId = document.body.id;
    if (bodyId === 'home') {
      return 'home';
    } else if (bodyId === 'detailed') {
      return 'detailed';
    } else {
      return 'unknown';
    }
  }

  handlePageLoad() {
    const newPage = this.getCurrentPage();
    console.log(`Current to ${newPage} page`);
    // if (newPage !== this.currentPage) {
      // console.log(`Leaving ${this.currentPage} page`);
      // console.log(`Entering ${newPage} page`);

      // Enable or disable ScrollSmoother based on the new page
      if (newPage === 'home') {
        
        this.scrollManager.initScrollSmoother(); // Enable ScrollSmoother
      } else  {
        this.scrollManager.killScrollSmoother(); // Disable ScrollSmoother
      }
    // }
    this.currentPage = newPage;
  }
}

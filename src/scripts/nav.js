import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { CustomEase } from "gsap/CustomEase";
import { toggleVisibility } from './toggleVisibility.js'; 

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase);
CustomEase.create("custom", "M0,0 C0.16,0.67 0,1.01 1,1");

export class MenuHandler {
  constructor(context) {
    this.context = context;
    this.gsapContext = null;
    console.log("nav this.context",this.context)
  }

  init() {
    this.getSelectors();
    this.initCommon();
    
    if (this.context.isMobile) {
      this.initMobile();
    }
  }

  getSelectors() {
    if (this.context.isMobile) {
      this.mobileNav = document.querySelector('[data-nav-mobile]');
      this.mobileNavLinks = this.mobileNav?.querySelector('ul');
      this.mobileNavOverlay = document.querySelector('[data-nav-overlay]');
      this.mobileNavTrigger = document.querySelector('[data-menu]');
    }
    
    this.navLinks = document.querySelectorAll('[data-jump-link]');
  }
  

  initCommon() {
    this.initLinks();
  }

  initMobile() {
    if (!this.mobileNavTrigger) return;
    this.initScrollTrigger();

    this.mobileNavTrigger.addEventListener('click', this.handleMobileNavClick.bind(this));
  }

  handleMobileNavClick(event) {
    event.preventDefault();
    if (this.mobileNav.classList.contains('menu-open')) {
      this.mobileMenuClose();
    } else {
      this.mobileMenuOpen();
    }
  }

  mobileMenuOpen() {
    console.log('open');

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.touchAction = 'none';
    document.body.style.touchAction = 'none';

    this.mobileNav.classList.add('menu-open', 'h-[100vh]');
    toggleVisibility(this.mobileNavOverlay, { show: true });

    this.mobileNav.style.height = `${window.innerHeight}px`;

    this.mobileNavLinks.classList.remove('hidden');
    this.mobileNavLinks.classList.add('flex');

    const links = this.mobileNavLinks.querySelectorAll('li');
    const icons = this.mobileNavLinks.querySelectorAll('img');

    gsap.fromTo(links, { opacity: 0, y: 30 }, {
      opacity: 1,
      y: 0,
      duration: 2,
      ease: 'custom',
      stagger: 0.1,
    });

    gsap.fromTo(icons, { opacity: 0 }, {
      opacity: 1,
      duration: 3,
      ease: 'custom',
      stagger: 0.1,
      delay: 1
    });
  }

  mobileMenuClose() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.touchAction = '';
    document.body.style.touchAction = '';
    this.mobileNav.style.height = '';

    this.mobileNav.classList.remove('menu-open', 'h-[100vh]');
    this.mobileNavLinks.classList.remove('flex');
    this.mobileNavLinks.classList.add('hidden');

    const links = this.mobileNavLinks.querySelectorAll('li');
    const icons = this.mobileNavLinks.querySelectorAll('img');

    gsap.killTweensOf(links);
    gsap.killTweensOf(icons);

    links.forEach(li => li.style.opacity = 0);
    icons.forEach(icon => icon.style.opacity = 0);

    toggleVisibility(this.mobileNavOverlay, { show: false });
  }

  initLinks() {
    this.navLinks.forEach(link => {
      const target = link.getAttribute('href');

      link.addEventListener('click', (e) => {
        e.preventDefault();
        gsap.to(window, { duration: 0, scrollTo: target });

        if (this.context.isMobile) {
          this.mobileMenuClose();
        }
      });
    });
  }

  initScrollTrigger() {
    // Use gsap.context to manage ScrollTriggers
    this.gsapContext = gsap.context(() => {
      ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          if (self.direction === 1) {
            toggleVisibility(this.mobileNav, { show: false });
          } else {
            toggleVisibility(this.mobileNav, { show: true });
          }
        }
      });
    }, this.mobileNav); // The scope of the context is limited to mobileNav (or any other element you want to scope it to)
  }

  kill() {
    this.killCommon();

    if (this.context.isMobile) {
      this.killMobile();
    }
  }

  killCommon() {
    if (this.gsapContext) {
      this.gsapContext.revert(); // This will clean up all ScrollTriggers and animations created within the context
      this.gsapContext = null;
    }

    if (this.navLinks) {
      this.navLinks.forEach(link => link.removeEventListener('click', this.handleLinkClick));
    }
  }
  killMobile() {
    if (this.mobileNavTrigger) {
      this.mobileNavTrigger.removeEventListener('click', this.handleMobileNavClick);
    }
    gsap.killTweensOf(this.mobileNavLinks?.querySelectorAll('li'));
    gsap.killTweensOf(this.mobileNavLinks?.querySelectorAll('img'));
  }
}

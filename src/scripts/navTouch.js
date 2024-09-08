import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { toggleVisibility } from './toggleVisibility.js';

gsap.registerPlugin(ScrollToPlugin, CustomEase);
CustomEase.create("custom", "M0,0 C0.16,0.67 0,1.01 1,1");

export class MenuHandlerTouch {
  constructor() {
    this.ctx = null;
    this.links = null;
    this.icons = null;
    this.handleMobileNavClick = this.handleMobileNavClick.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  init() {
    console.log("MenuHandlerTouch >>> init")
    this.mobileNav = document.querySelector('[data-nav-mobile]');
    this.mobileNavLinks = this.mobileNav.querySelector('[data-nav-mobile-links]');
    this.mobileNavTrigger = this.mobileNav.querySelector('[data-menu]');
    this.navLinks = this.mobileNav.querySelectorAll('[data-jump-link]');
    this.mobileNavOverlay = document.querySelector('[data-nav-mobile-overlay]');
    this.links = this.mobileNavLinks.querySelectorAll('li');
    this.icons = this.mobileNavLinks.querySelectorAll('img');

    toggleVisibility(this.mobileNav, { show: true });

    this.mobileNavTrigger.addEventListener('click', this.handleMobileNavClick);
    this.navLinks.forEach(link => {
      link.addEventListener('click', this.handleLinkClick);
    });

    // Initialize GSAP context once
    this.ctx = gsap.context(() => {
      this.animateMenuItems();
    }, this.mobileNav);
  }

  handleMobileNavClick(event) {
    event.preventDefault();
    if (this.mobileNav.classList.contains('menu-open')) {
      this.mobileMenuClose();
    } else {
      this.mobileMenuOpen();
    }
  }

  handleLinkClick(e) {
    e.preventDefault();
    const target = e.currentTarget.getAttribute('href');
    gsap.to(window, { duration: 0, scrollTo: target, ease: "custom" });
    this.mobileMenuClose();
  }

  mobileMenuOpen() {
    document.body.classList.add('overflow-hidden', 'touch-none');
    document.documentElement.classList.add('overflow-hidden', 'touch-none');
    this.mobileNav.classList.add('menu-open', 'h-[100vh]');

    toggleVisibility(this.mobileNavOverlay, { show: true });

    this.mobileNavLinks.classList.remove('hidden');
    this.mobileNavLinks.classList.add('flex');

    // Trigger animations via the already initialized GSAP context
    this.ctx.add(() => {
      this.animateMenuItems();
    });
  }

  mobileMenuClose() {
    document.body.classList.remove('overflow-hidden', 'touch-none');
    document.documentElement.classList.remove('overflow-hidden', 'touch-none');
    this.mobileNav.classList.remove('menu-open', 'h-[100vh]');
    
    this.mobileNavLinks.classList.remove('flex');
    this.mobileNavLinks.classList.add('hidden');

    gsap.killTweensOf(this.links);
    gsap.killTweensOf(this.icons);

    toggleVisibility(this.mobileNavOverlay, { show: false });
  }

  animateMenuItems() {
    gsap.fromTo(this.links, { opacity: 0, y: 30 }, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'custom',
      stagger: 0.1,
    });

    gsap.fromTo(this.icons, { opacity: 0 }, {
      opacity: 1,
      duration: 2,
      ease: 'custom',
      stagger: 0.1,
      delay: 0.5
    });
  }

  kill() {

    console.log("MenuHandlerTouch >>> kill")


    toggleVisibility(this.mobileNav, { show: false });

    if (this.navLinks) {
      this.navLinks.forEach(link => link.removeEventListener('click', this.handleLinkClick));
    }

    if (this.ctx) {
      this.ctx.revert();
      this.ctx = null;
    }

    this.mobileNavTrigger.removeEventListener('click', this.handleMobileNavClick);
    gsap.killTweensOf(this.links);
    gsap.killTweensOf(this.icons);
  }
}

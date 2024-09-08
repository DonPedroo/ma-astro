import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { toggleVisibility } from './toggleVisibility.js';

gsap.registerPlugin(ScrollToPlugin, CustomEase);
CustomEase.create("custom", "M0,0 C0.16,0.67 0,1.01 1,1");

export class MenuHandler {
  constructor() {
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  init() {
    console.log("MenuHandler >>> init");

    this.nav = document.querySelector('[data-nav]');
    this.navLinks = this.nav.querySelectorAll('[data-jump-link]');

    // Attach event listeners
    this.navLinks.forEach(link => {
      link.addEventListener('click', this.handleLinkClick);
    });

    toggleVisibility(this.nav, { show: true });
  }

  handleLinkClick(e) {
    e.preventDefault();
    const target = e.currentTarget.getAttribute('href');
    gsap.to(window, { duration: 0, scrollTo: target, ease: "custom" });
  }

  kill() {
    console.log("MenuHandler >>> kill");

    toggleVisibility(this.nav, { show: false });

    // Remove event listeners
    if (this.navLinks) {
      this.navLinks.forEach(link => link.removeEventListener('click', this.handleLinkClick));
    }
  }
}

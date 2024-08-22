// toggleVisibility.js

import { gsap } from 'gsap';
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);
CustomEase.create("custom", "M0,0 C0.16,0.67 0,1.01 1,1 ")

export function toggleVisibility(element, { show, delay = 0 }) {
    gsap.killTweensOf(element);

    // const elData = element.dataset;

   

    if (show) {
        // console.log('show');
        // console.log('show',elData);
        element.classList.remove('hidden');
        gsap.to(element, { opacity: 1, duration: 1.5, ease: "custom", delay: delay });
    } else {
        // console.log('hide',elData);
        gsap.to(element, { opacity: 0, duration: 0.5, ease: "custom", delay: delay, onComplete: () => element.classList.add('hidden') });
    }
}

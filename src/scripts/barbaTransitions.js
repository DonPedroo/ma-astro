// src/scripts/barbaTransitions.js

import barba from '@barba/core';
import gsap from 'gsap';

barba.init({
  transitions: [
    {
      name: 'default-transition',
      leave({ current }) {
        // Animation that plays when leaving the page
        return gsap.to(current.container, {
          opacity: 0,
          duration: 0.5,
        });
      },
      enter({ next }) {
        // Animation that plays when entering the new page
        return gsap.from(next.container, {
          opacity: 0,
          duration: 0.5,
        });
      },
    },
  ],
});

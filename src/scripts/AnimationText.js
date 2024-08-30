import { gsap } from 'gsap';
import { SplitText } from '../plugins/gsap//SplitText';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(SplitText, CustomEase);
CustomEase.create('custom', 'M0,0 C0.16,0.67 0,1.01 1,1');

export function useTextAnimation(selector, options = {}, settings = {}) {

  if (!selector) return null;
  
  if (selector.classList.contains('opacity-0')) {
    selector.classList.remove('opacity-0');
  }

//   let delay = settings.initDelay || 0;

      const split = new SplitText(selector, options);
      const items = split[options.type || 'chars'];

    //   let speed = 1.0; // Start speed

      items.forEach(line => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';

        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });

    let stagger = settings.stagger || 0.1;

      let delay = settings.delay || 0;

      
      animate(items, delay,stagger, settings);


}

function animate(items, delay, stagger, settings) {
  let fromProps = {
    autoAlpha: 0,  // GSAP will set opacity to 0 as the initial state
  };
  let toProps = {
    autoAlpha: 1,  // Opacity will animate to 1
    duration: 2,
    stagger: stagger,
    delay: delay,
    ease: 'custom',


    
  };

  if (settings.moveup) {
    fromProps.y = '100%';
    toProps.y = '0%';
  }

  
  gsap.fromTo(items, fromProps, {
    ...toProps,
  });
}

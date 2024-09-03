import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);
CustomEase.create('custom', 'M0,0 C0.16,0.67 0,1.01 1,1');

export function useObjectAnimation(selector, settings = {}) {

  if (!selector) return null;
  

  gsap.killTweensOf(selector);

  // if (selector.classList.contains('opacity-0')) {
  //   selector.classList.remove('opacity-0');
  // }



    let delay = settings.delay || 0;

      
      animate(selector, delay, settings);


}

function animate(selector, delay, settings) {
  let fromProps = {
    autoAlpha: 0, 
  };
  let toProps = {
    autoAlpha: 1, 
    duration: 2,
    delay: delay,
    ease: 'custom',


    
  };

  if (settings.moveup) {
    fromProps.y = '100%';
    toProps.y = '0%';
  }

  
  gsap.fromTo(selector, fromProps, {
    ...toProps,
  });
}

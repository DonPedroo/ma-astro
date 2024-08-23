import gsap from 'gsap';
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);
CustomEase.create("custom", "M0,0 C0.16,0.67 0,1.01 1,1 ")




export function mousePointer(context) {
    // Early return if on a touch device
    if (context.isMobile) return;

    context.cursor = document.querySelector('[data-mouse-follow]');
    // Set cursor class
    context.cursor.classList.remove('hidden');
    context.cursor.classList.add('flex');

    const links = document.querySelectorAll('[data-link]');



    links.forEach(link => {
        const isReel = link.hasAttribute('data-play');

        // Mouse enter event
        link.addEventListener('mouseenter', () => animateMouseFollow(true, isReel));

        // Mouse leave event
        link.addEventListener('mouseleave', () => animateMouseFollow(false, isReel));
    });
}

export function mouseDrag(context) {
    if (context.isMobile) return;

    const area = document.querySelector('[data-horizontal-scroll]');

    const handleMouseEnter = () => animateMouseFollow(true, false, area);
    const handleMouseLeave = () => animateMouseFollow(false, false, area);

    area.removeEventListener('mouseenter', handleMouseEnter);
    area.removeEventListener('mouseleave', handleMouseLeave);

    area.addEventListener('mouseenter', handleMouseEnter);
    area.addEventListener('mouseleave', handleMouseLeave);

}



    // Function to handle the animation logic
    export function animateMouseFollow(isEntering, isReel, isDrag) {

        
        let scaleValue;
        let spanOpacity;
        let spanText;
    
        if (!isEntering) {
            scaleValue = 1;
        } else if (isReel) {
            scaleValue = 8; 
        } else if (isDrag) {
            scaleValue = 6; 
        }
        
        else {
            scaleValue = 2.5;
        }
    
        if (isEntering && isReel ) {
            spanOpacity = 1;
        } else if  (isEntering && isDrag ) {
            spanOpacity = 1;
        } else {
            spanOpacity = 0;
        }

        if (isEntering && isReel) {
            spanOpacity = 1;
            spanText = "View project"; 
        } else if (isEntering && isDrag) {
            spanOpacity = 1;
            spanText = "Drag"; 
        } else {
            spanOpacity = 0;
            spanText = ""; 
        }

        document.querySelector("[data-mouse-follow]>div>span").textContent = spanText;

        const duration = isEntering ? 1.5 : 1; 

        gsap.killTweensOf(['[data-mouse-follow]>div>div', '[data-mouse-follow]>div>span']);

        gsap.to("[data-mouse-follow]>div>div", {
            scale: scaleValue,
            duration: duration,
            ease: "custom" 
        });

        if (isReel || !isEntering) {
            gsap.to("[data-mouse-follow]>div>span", {
                opacity: spanOpacity,
                duration: 1,
                ease: "custom"
            });
        }

        if (isDrag || !isEntering) {
            gsap.to("[data-mouse-follow]>div>span", {
                opacity: spanOpacity,
                duration: 1,
                ease: "custom"
            });
        }
    }





export function stickyUIeffect(scrollTo, item, context) {
    let dataAttrName = Array.from(item.attributes).find(attr => attr.name.startsWith('data-arrow'))?.name;

    if (scrollTo) {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            gsap.to(window, {
                duration: 0.3,
                scrollTo: scrollTo,
                ease: "power2.out"
            });
        });
    }

    if (context.isMobile) return;

    const handleMouseEnter = (e) => {
        e.preventDefault();
        gsap.to(`[${dataAttrName}]>div`, {
            scale: 1.2,
            duration: 0.5,
            ease: "power2.Out"
        });
        item.addEventListener('mousemove', handleMouseMove);
    };

    const handleMouseLeave = (e) => {
        e.preventDefault();
        gsap.to(`[${dataAttrName}]>div, [${dataAttrName}]>div>div`, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power2.Out"
        });
        item.removeEventListener('mousemove', handleMouseMove);
    };

    const handleMouseMove = (e) => {
        e.preventDefault();
        const deltaX = ((context.followMouse.x * context.width) - e.clientX);
        const deltaY = ((context.followMouse.y * context.height) - e.clientY);

        gsap.killTweensOf([`[${dataAttrName}]>div`, `[${dataAttrName}]>div>div`]);

        gsap.to(`[${dataAttrName}]>div`, {
            x: deltaX * .2,
            y: deltaY * .2,
            scale: 1.2,
            duration: 0.4,
            ease: "power2.Out"
        });

        gsap.to(`[${dataAttrName}]>div>div`, {
            x: deltaX * .07,
            y: deltaY * .07,
            scale: 1.1,
            duration: 0.3,
            ease: "power2.Out"
        });
    };

    item.addEventListener('mouseenter', handleMouseEnter);
    item.addEventListener('mouseleave', handleMouseLeave);
}

export function animateMouseDrag(start, on, end) {

    const area = document.querySelector('[data-horizontal-scroll]');


    // console.log("animateMouseDrag>",start, on, end);

    gsap.killTweensOf(['[data-mouse-follow]>div>div']);

    if (start) {
        // gsap.to("[data-mouse-follow]>div>div", {
        //     scale: .2,
        //     duration: 1,
        //     ease: "custom" 
        // });

        area.classList.remove('cursor-grab');
        area.classList.add('cursor-grabbing');
    }

    if (on) {
        gsap.to("[data-mouse-follow]>div>div", {
            scale: 12,
            duration: 1,
            ease: "custom" 
        });
    

    }

    if (end) {
        gsap.to("[data-mouse-follow]>div>div", {
            scale: 6,
            duration: 1,
            ease: "custom" 
        });

        area.classList.remove('cursor-grabbing');
        area.classList.add('cursor-grab');
    }



}
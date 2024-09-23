import { gsap } from "gsap";

export function preloadMedia(backgrounds) {

    
  // Create the progress bar container, bar, and percentage text elements
  const progressBarContainer = document.createElement('div');
  progressBarContainer.className = 'progress-bar-container';
  
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  
  const progressText = document.createElement('div');
  progressText.className = 'text-massblue absolute left-0 right-0 bottom-3';
  progressText.innerText = '0%';

  progressBarContainer.appendChild(progressBar);

  const mediaToLoad = backgrounds.filter((background) => background.type === 1 || background.type === 2 || background.type === 3);

  let loadedMedia = 0;
  const totalMedia = mediaToLoad.length;

  if (totalMedia === 0) {
    console.log("No media to preload.");
    return;
  }

  const preloader = document.querySelector('[data-preloader]');

  preloader.appendChild(progressBarContainer);
  preloader.appendChild(progressText);

  mediaToLoad.forEach((background) => {
    if (background.type === 2 || background.type === 3) {
      // Preload image
      const img = background.element || new Image(); // Reuse element if it exists, otherwise create a new one
      img.src = background.src;
      img.onload = () => {
        // console.log(`Image loaded: ${background.src}`);
        handleMediaLoaded();
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${background.src}`);
      };
    } else if (background.type === 1) {
      // Preload video
      const video = background.element; // Reuse the video element from the array
      if (video) {
        // Stop the video if it was already playing
        video.src = background.src;
        video.load(); // Force a reload of the video element
        video.onloadeddata = () => {
          // console.log(`Video loaded: ${background.src}`);
          handleMediaLoaded();
          video.play();
        };
        video.onerror = () => {
          console.error(`Failed to load video: ${background.src}`);
        };
      }
    }
  });

  function handleMediaLoaded() {
    loadedMedia += 1;
    const progressPercentage = (loadedMedia / totalMedia) * 100;

    // Animate the progress bar and percentage text using GSAP
    gsap.to(progressBar, {
      width: `${progressPercentage}%`,
      duration: 0.5, // Adjust the duration to control how quickly the bar moves
      ease: "power2.out",
    });

    // Move the percentage text and update the number
    gsap.to(progressText, {
      x: `${progressPercentage}%`,
      duration: 0.5, // Sync with the bar movement
      ease: "power2.out",
      onUpdate: function() {
        progressText.innerText = `${Math.floor(progressPercentage)}%`;
      }
    });

    if (loadedMedia === totalMedia) {

        
      gsap.to(preloader, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          preloader.style.display = 'none'; // Optionally hide the preloader after fading out
        }
      });
    }
  }
}

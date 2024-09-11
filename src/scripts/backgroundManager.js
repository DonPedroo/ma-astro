// backgroundManager.js
export function createBackgroundsArray() {
    const sections = document.querySelectorAll('[data-slides]');
    const backgrounds = [];
  
    sections.forEach(section => {
        const slidesId = section.getAttribute('id'); // Grab the element ID
        let background;
  
      // Check for types 3 and 4 directly on the section
      const bgType = section.getAttribute('data-bg-type');
  
      if (bgType === '3' || bgType === '4') {
        background = handleType3and4(section, bgType);
      } else {
        // Look for child elements with data-bg-type for types 1 and 2
        const video = section.querySelector('video[data-bg-type="1"]');
        const img = section.querySelector('img[data-bg-type="2"]');
        if (video) {
          background = {
            type: 1,
            element: video,
            src: video.querySelector('source').getAttribute('src'),
            slidesId: slidesId // Save the section ID
          };
        } else if (img) {
          background = {
            type: 2,
            element: img,
            src: img.getAttribute('src'),
            slidesId: slidesId // Save the section ID
          };
        }
      }
  
      if (background) {
        background.slidesId = slidesId; // Save the section ID for types 3 and 4
        backgrounds.push(background);
      }
    });
  
    return backgrounds;
  }
  
  function handleType3and4(section, bgType) {
    const slidesId = section.getAttribute('data-slides'); // Grab the data-slides ID
    if (bgType === '3') {
      // Extract the solid color from the computed styles
      const color = window.getComputedStyle(section).backgroundColor;
      return {
        type: 3,
        color: color,
        slidesId: slidesId // Save the section ID
      };
    } else if (bgType === '4') {
      // Extract the background image from the computed styles
      const bgImage = window.getComputedStyle(section).backgroundImage;
      const imageUrl = extractImageUrl(bgImage);
      return {
        type: 4,
        imageUrl: imageUrl,
        slidesId: slidesId // Save the section ID
      };
    }
    return null;
  }
  
  // Helper function to extract the image URL from background-image
  function extractImageUrl(bgImage) {
    const match = bgImage.match(/url\(["']?([^"']*)["']?\)/);
    return match ? match[1] : null;
  }
  
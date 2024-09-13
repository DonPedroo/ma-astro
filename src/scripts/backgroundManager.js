// backgroundManager.js
export function createBackgroundsArray(gl) {
    const sections = document.querySelectorAll('[data-slides]');
    const backgrounds = [];
    // console.log("backgrounds",backgrounds)

  
    sections.forEach(section => {
        const slidesId = section.getAttribute('id'); // Grab the element ID
        let background;
  
      // Check for types 3 and 4 directly on the section
      const bgType = section.getAttribute('data-bg-type');
  
      if (bgType === '3' || bgType === '4') {
        background = handleType3and4(section, bgType,gl);
      } else {
        // Look for child elements with data-bg-type for types 1 and 2
        const video = section.querySelector('video[data-bg-type="1"]');
        const img = section.querySelector('img[data-bg-type="2"]');

        if (!gl) {
          if (video) {
            video.classList.remove('hidden', 'opacity-0');
          }
          if (img) {
            img.classList.remove('hidden', 'opacity-0');
          }
        }

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
  
  function handleType3and4(section, bgType,gl) {
    const slidesId = section.getAttribute('data-slides'); // Grab the data-slides ID
    if (bgType === '3') {



      // Extract the solid color from the computed styles
      const color = window.getComputedStyle(section).backgroundColor;
      if (gl) {

        section.classList.remove('bg-massgrey');
      }
      return {
        type: 3,
        color: color,
        slidesId: slidesId // Save the section ID
      };
    } else if (bgType === '4') {


      // Extract the background image from the computed styles
      const bgImage = window.getComputedStyle(section).backgroundImage;
      const imageUrl = extractImageUrl(bgImage);

      if (gl) {
        section.classList.remove('grunge');
      }

      const miscImage = section.querySelector('img[data-bg-misc]');

      if (miscImage) { // Check if miscImage exists
        if (!gl) {
          miscImage.classList.remove('hidden', 'opacity-0');
        }
      } 

      let miscImageUrl = null;
  
      if (miscImage) {
        // Extract the misc image URL
        miscImageUrl = miscImage.getAttribute('src');

  

      }
      return {
        type: 4,
        imageUrl: imageUrl,
        miscImageUrl: miscImageUrl, // Include the misc image URL if found
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
  
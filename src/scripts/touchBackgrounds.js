export function touchBackgrounds(backgrounds,projectName) {
    // Select all sections with the "data-slides" attribute
    const sections = document.querySelectorAll('[data-slides]');

    // console.log("backgrounds",)
  
    // Ensure backgrounds array and sections exist
    if (!backgrounds || backgrounds.length === 0 || sections.length === 0) {
      // console.error('Backgrounds or sections not found.');
      return;
    }
  
    // Loop through each section and each background
    sections.forEach((section, index) => {
      const background = backgrounds[index];

      // console.log("backgrounds.slidesId",background.slidesId,projectName)

      if (background.slidesId === projectName) return
  
      if (!background) {
        // console.warn(`No background found for section ${index + 1}`);
        return;
      }
  
      // Check background type and apply specific logic
      if (background.type === 3) {
        // Add "grunge" class to the section for background type 3
        section.classList.add('grunge');
        // console.log(`Added "grunge" class to section ${index + 1}`);
        return; // Skip appending elements for type 3
      }
  
      if (background.type === 4) {
        // Add "bg-massgrey" class to the section for background type 4
        section.classList.add('bg-massgrey');
        // console.log(`Added "bg-massgrey" class to section ${index + 1}`);
        return; // Skip appending elements for type 4
      }
  
      // For other background types, append the element and add "absolute" and "inset-0"
      if (background.element) {
        background.element.classList.add('absolute', 'inset-0','z-[-1]');
        section.appendChild(background.element);
        // console.log(`Moved background element to section ${index + 1}`);
      }
    });
  }
  
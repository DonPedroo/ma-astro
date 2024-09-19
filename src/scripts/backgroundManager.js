import { TextureLoader, LinearFilter, VideoTexture, Color } from 'three';

export function createBackgroundsArray(gl) {
  const sections = document.querySelectorAll('#media-storage>div');
  const backgrounds = [];

  if (!sections) return;
  let textureLoader = null
  if (gl) {
   textureLoader = new TextureLoader();
  }


  console.log("DOM backgrounds init", backgrounds);

  sections.forEach(section => {

    const slidesId = section.getAttribute('data-bg-id');

    
    let background;
    const bgType = section.getAttribute('data-bg-type');

    // Logic for bgType === '1' (video)
    if (bgType === '1') {
      const video = section.querySelector('video');
      if (video) {
        background = {
          type: 1,
          element: video,
          src: video.querySelector('source').getAttribute('src'),
          slidesId: slidesId, 
          section: section
        };
        if (gl) {
        video.load();
          video.play();
          const videoTexture = new VideoTexture(video);
          videoTexture.minFilter = LinearFilter;
          videoTexture.magFilter = LinearFilter;
          videoTexture.name = slidesId;
          
          background.gl = {
            texture: videoTexture,
            color: null,
            scaleFactor: null
          };
        }
      }
    }

    // Logic for bgType === '2' (image)
    if (bgType === '2') {
      const img = section.querySelector('img');
      if (img) {
        background = {
          type: 2,
          element: img,
          src: img.getAttribute('src'),
          slidesId: slidesId,
          section: section
        };
        if (gl) {
          
          const imageTexture = textureLoader.load(img.src);
          imageTexture.minFilter = LinearFilter;
          imageTexture.magFilter = LinearFilter;
          imageTexture.name = slidesId
            
            background.gl = {
              texture: imageTexture,
              color: null,
              scaleFactor: null
            };
          }
      }
    }

    // Logic for bgType === '3' (another type of image, for example)
    if (bgType === '3') {
      const img = section.querySelector('img');
      if (img) {
        background = {
          type: 3,
          element: img,
          src: img.getAttribute('src'),
          slidesId: slidesId,
          section: section
        };
        if (gl) {
          
          const imageTexture = textureLoader.load(img.src);
          imageTexture.minFilter = LinearFilter;
          imageTexture.magFilter = LinearFilter;
          imageTexture.name = slidesId
            
            background.gl = {
              texture: imageTexture,
              color: null,
              scaleFactor: .5
            };
          }
      }
    }

    // Logic for bgType === '4' (color background)
    if (bgType === '4') {
      const color = section.getAttribute('data-color') || '#EAEAEA'; // Default color if not found
      background = {
        type: 4,
        color: color,
        slidesId: slidesId,
        section: section
      };
      if (gl) {
          
       
          
          background.gl = {
            texture: null,
            color:new Color(color),
            scaleFactor: null
          };
        }
    }

    // Add the background object to the array if it exists
    if (background) {
      backgrounds.push(background);
    }
  });

  return backgrounds;
}

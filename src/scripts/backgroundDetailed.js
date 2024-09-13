import { TextureLoader, VideoTexture, LinearFilter } from 'three';

export function backgroundDetailed() {
  const section = document.querySelector('[data-detailed-media]');
  
  if (!section) {
    console.warn('No section with data-detailed-media found.');
    return null;
  }

  const video = section.querySelector('video');
  const img = section.querySelector('img');
  const textureLoader = new TextureLoader();

  if (video) {
    // Handle video backgrounds
    video.load();
    video.play();
    const videoTexture = new VideoTexture(video);
    videoTexture.minFilter = LinearFilter;
    videoTexture.magFilter = LinearFilter;

    return {
      type: 1,
      texture: videoTexture,
      color: null,
    };
  } else if (img) {
    // Handle image backgrounds
    const imageSrc = img.getAttribute('src');
    const imageTexture = textureLoader.load(imageSrc);
    imageTexture.minFilter = LinearFilter;
    imageTexture.magFilter = LinearFilter;

    return {
      type: 2,
      texture: imageTexture,
      color: null,
    };
  } else {
    console.warn('No video or image found in the section.');
    return null;
  }
}

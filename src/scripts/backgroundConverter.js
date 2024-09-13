import { TextureLoader, LinearFilter, VideoTexture, Color } from 'three';

export function convertToGlBackgrounds(backgrounds) {
  const textureLoader = new TextureLoader();

  return backgrounds.map((bg) => {
    switch (bg.type) {
      case 1: // Handle video backgrounds
        const video = bg.element;
        video.load(); 
        video.play();
        const videoTexture = new VideoTexture(video);
        videoTexture.minFilter = LinearFilter;
        videoTexture.magFilter = LinearFilter;

        videoTexture.name = bg.slidesId
        
        return {
          type: 1,
          texture: videoTexture,
          color: null,
        };

      case 2: // Handle image backgrounds
        const imageTexture = textureLoader.load(bg.src);
        imageTexture.minFilter = LinearFilter;
        imageTexture.magFilter = LinearFilter;
        imageTexture.name = bg.slidesId

        return {
          type: 2,
          texture: imageTexture,
          color: null,
        };

      case 3: // Handle solid color backgrounds
        const color = new Color(bg.color);
        return {
          type: 3,
          texture: null, // No texture for solid colors
          color: color,
        };

      case 4: // Handle background image from URL
        const bgImageTexture = textureLoader.load(bg.imageUrl);
        bgImageTexture.minFilter = LinearFilter;
        bgImageTexture.magFilter = LinearFilter;
        bgImageTexture.name = bg.slidesId

        return {
          type: 4,
          texture: bgImageTexture,
          color: null,
        };

      default:
        console.warn(`Unsupported background type: ${bg.type}`);
        return null;
    }
  }).filter(Boolean); // Filter out null values for unsupported types
}

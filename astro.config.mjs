import { defineConfig } from 'astro/config';
import glsl from 'vite-plugin-glsl';

// https://astro.build/config
// export default defineConfig({});


export default defineConfig({
    vite: {
      plugins: [glsl()]
    }
  });

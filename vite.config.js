import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['gsap/ScrollSmoother']
    }
  },
  optimizeDeps: {
    include: ['gsap/ScrollSmoother']
  }
});

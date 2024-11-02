import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tailwindcss from 'tailwindcss';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    outDir: '../server/dist',
  },
  // base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

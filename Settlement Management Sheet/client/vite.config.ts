import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      app: '/src/app',
      components: '/src/components',
      features: '/src/features',
      hooks: '/src/hooks',
      context: '/src/context',
      utility: '/src/utility',
      services: '/src/services',
      // Specific aliases for features
      attribute: '/src/features/Attributes',
      category: '/src/features/Categories',
      event: '/src/features/Events',
      listener: '/src/features/Listeners',
      status: '/src/features/Status',
      weather: '/src/features/Weather',
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../server/public'), // Server folder to store built assets
    emptyOutDir: true, // Clears the output directory before building
  },
  server: {
    port: 5173, // Dev server port
  },
});

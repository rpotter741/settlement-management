import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, '../server/public'), // Server folder to store built assets
    emptyOutDir: true, // Clears the output directory before building
  },
  server: {
    port: 5173, // Dev server port
  },
});

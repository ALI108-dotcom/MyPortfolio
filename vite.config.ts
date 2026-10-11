import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { portfolioApiPlugin } from './server/apiMiddleware';

export default defineConfig({
  plugins: [react(), portfolioApiPlugin()],
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
});

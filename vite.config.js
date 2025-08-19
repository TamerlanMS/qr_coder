import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // приложение развёрнуто в подкаталоге IIS /qr_coder/
  base: '/qr_coder/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

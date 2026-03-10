import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Ramadan-Tracker/',
  plugins: [react()],
  build: {
    outDir: 'www',
    emptyOutDir: true,
  },
});

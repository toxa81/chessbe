import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative assets work locally, on GitHub project Pages, and on custom domains.
  base: './',
});

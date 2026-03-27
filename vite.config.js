import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // ✅ IMPORTANT: for subdomain (employee.trakjobs.com)

  plugins: [react()],

  server: {
    port: 5174,
    strictPort: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/self-expense-tracker/',
  plugins: [react()],
  define: {
    'process.env': process.env
  }
});

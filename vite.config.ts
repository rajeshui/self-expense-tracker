import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from "vite-plugin-pwa";
import type { VitePWAOptions } from "vite-plugin-pwa";

const manifestForPlugIn: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico'],
  scope: '/',
  devOptions: {
    enabled: true,
    type: 'module',
  },
  manifest: {
    name: "Expense Tracker",
    short_name: "Expense Tracker",
    description: "Track your expenses and manage your budget.",
    theme_color: '#171717',
    background_color: '#f0e7db',
    display: "standalone",
    scope: '/self-expense-tracker/',
    start_url: "/self-expense-tracker/",
    icons: [
      {
        src: 'android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: 'android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: 'apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    categories: ['productivity'],
    screenshots: [
      {
        src: 'android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        form_factor: 'narrow'
      },
      {
        src: 'android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        form_factor: 'wide'
      }
    ]
  },
  workbox: {
    navigateFallback: '/self-expense-tracker/index.html',
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}']
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/self-expense-tracker/' : '/',
  plugins: [react(), VitePWA(manifestForPlugIn)],
  define: { 
    'process.env': {}
  }
});

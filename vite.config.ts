import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/metmenu/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'MetMenu – Metioniinihaku',
        short_name: 'MetMenu',
        description: 'Metioniinipitoisuuksien hakusovellus',
        lang: 'fi',
        display: 'standalone',
        theme_color: '#4CAF50',
        background_color: '#ffffff',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      // The service worker precaches the app shell only. Spreadsheet data is
      // cached separately in localStorage (src/storage.ts) so the UI can show
      // freshness state and offline indicators.
    }),
  ],
});

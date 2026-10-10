import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        profil: resolve(__dirname, 'profil.html'),
        infografis: resolve(__dirname, 'infografis.html'),
        kkt: resolve(__dirname, 'kkt.html'),
      },
    },
  },
});

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html', // Página principal
        privacy: 'privacy-policy.html' // Política de privacidade
      },
    },
  },
});

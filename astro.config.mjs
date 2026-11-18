// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://viaja.libertycondominio.online',
  output: 'static',
  integrations: [sitemap({ filter: (pagina) => !pagina.includes('/404') })],
  vite: {
    plugins: [tailwindcss()],
  },
});

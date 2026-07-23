import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://alyosha31.github.io',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { htmlPartials } from './build/html-partials.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const landingPage = 'architectural_landing_page.html';

function rewriteRoot(request, _response, next) {
  if (request.url === '/') request.url = `/${landingPage}`;
  next();
}

const serveLandingPage = {
  name: 'serve-landing-page',
  configureServer(server) {
    server.middlewares.use(rewriteRoot);
  },
  configurePreviewServer(server) {
    server.middlewares.use(rewriteRoot);
  },
};

export default defineConfig({
  plugins: [serveLandingPage, htmlPartials({ root })],
  server: { host: '0.0.0.0' },
  preview: { host: '0.0.0.0' },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: { input: path.resolve(root, landingPage) },
  },
});

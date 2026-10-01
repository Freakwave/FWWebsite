import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const includePattern = /<!--\s*@include\s+([\w./-]+)\s*-->/g;

async function expandIncludes(html, stack = []) {
  const matches = [...html.matchAll(includePattern)];
  for (const match of matches) {
    const includePath = path.resolve(projectRoot, match[1]);
    if (!includePath.startsWith(`${projectRoot}${path.sep}`)) {
      throw new Error(`HTML include escapes project root: ${match[1]}`);
    }
    if (stack.includes(includePath)) {
      throw new Error(`Circular HTML include detected: ${match[1]}`);
    }
    const fragment = await readFile(includePath, 'utf8');
    html = html.replace(match[0], await expandIncludes(fragment, [...stack, includePath]));
  }
  return html;
}

export default defineConfig({
  plugins: [{
    name: 'html-partials',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (request.url === '/') request.url = '/architectural_landing_page.html';
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (request.url === '/') request.url = '/architectural_landing_page.html';
        next();
      });
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return expandIncludes(html);
      },
    },
  }],
  server: { host: '0.0.0.0' },
  preview: { host: '0.0.0.0' },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(projectRoot, 'architectural_landing_page.html'),
    },
  },
});

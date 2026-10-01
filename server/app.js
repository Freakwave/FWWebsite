import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(serverDirectory, '..');
const distDirectory = path.join(projectRoot, 'dist');
const pageName = 'architectural_landing_page.html';

export function createApp({ staticDirectory = distDirectory } = {}) {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", 'data:'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));
  app.use(compression());
  app.get('/healthz', (_request, response) => response.status(200).json({ status: 'ok' }));
  app.use(express.static(staticDirectory, {
    index: false,
    maxAge: 0,
    setHeaders(response, filePath) {
      if (/-[a-z0-9_-]{8,}\.[a-z0-9]+$/i.test(path.basename(filePath))) {
        response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  }));
  app.get('/', (_request, response, next) => {
    response.sendFile(path.join(staticDirectory, pageName), (error) => {
      if (error) next(error);
    });
  });
  app.use((_request, response) => response.status(404).json({ error: 'Not found' }));

  return app;
}

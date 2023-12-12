import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import compression from 'express-compression';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { EntryLoader, TtlCache } from './src/app/server/ttl-cache';
import { onRequest } from "firebase-functions/v2/https";
import { articlesLoader } from './src/app/shared/loaders/articles-loader';
import { tagsLoader } from './src/app/shared/loaders/tags-loader';

// The Express app is exported so that it can be used by serverless Functions.
export function createApp() {//}: express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.use(compression({ brotli: { enabled: true, zlib: {} } }));

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  const loaders = new Map([['/api/articles', articlesLoader], ['/api/tags', tagsLoader]]);

  /**
   * Data cache
   */
  const dataCache = new TtlCache(20, loaders);

  // Serve static files from browser dist. folder
  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Angular engine
  server.get(
    '*',
    async (req: any, res: any, next: any) => {
      const path = req.path as string;
      if (loaders.has(path)) {
        const loader = loaders.get(path) as EntryLoader;
        const cached = await dataCache.get(path, loader);
        if (cached) {
          res.send(cached);
        }
      } else {
        next();
      }
    },
    (req: any, res: any, next: any) => {
      const { protocol, originalUrl, baseUrl, headers } = req;
      commonEngine
        .render({
          bootstrap,
          documentFilePath: indexHtml,
          url: `${protocol}://${headers.host}${originalUrl}`,
          publicPath: browserDistFolder,
          providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
        })
        .then((html) => res.send(html))
        .catch((err) => next(err));
    }
  );

  return onRequest(server);
}

export const app = createApp();

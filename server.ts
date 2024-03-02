import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import compression from 'express-compression';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { TtlCache } from './src/app/server/ttl-cache';
import { onRequest } from "firebase-functions/v2/https";
import { ArticlesLoader } from './src/app/shared/loaders/articles-loader';
import { TagsLoader } from './src/app/shared/loaders/tags-loader';
import { CacheLoader } from './src/app/server/cache-loader';

/**
 * Express app. to serve Angular as well as cached data resources
 * @returns Express app (exported for serverless function hosting)
 */
export function createApp() {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.use(compression({ brotli: { enabled: true, zlib: {} } }));

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  const loaders: CacheLoader[] = [new ArticlesLoader(), new TagsLoader()];

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

  // Other routes use SSR or failing that, Angular engine
  server.get(
    '*',
    async (req: any, res: any, next: any) => {
      const path = req.url as string;
      const pathLoader = loaders.find(loader => loader.matches(path));
      if (pathLoader?.cacheable(path)) {
        const cached = await dataCache.get(path, pathLoader);
        res.send(cached);
      } else if (pathLoader) {
        const resource = await pathLoader.load(path);
        res.send(resource);
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

/**
 * Express app.
 */
export const app = createApp();

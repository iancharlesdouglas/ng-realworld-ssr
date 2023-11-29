import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import compression from 'express-compression';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { TtlCache } from './src/app/server/ttl-cache';
import { ArticleApiResponse } from './src/app/features/home/model/article-api-response';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.use(compression({ brotli: { enabled: true, zlib: {} } }));

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  const refDataCache = new TtlCache<ArticleApiResponse>(60);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
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
      console.info('middleware invoked; req.path', req.path);
      if (req.path === '/api/articles') {
        const cached = await refDataCache.get(req.path, async () => {
          const response = await fetch(
            `https://api.realworld.io/api/articles?limit=5`
          );
          if (response.ok) {
            console.log('got response from remote articles server; storing');
            const articlesPayload = await response.json();
            return articlesPayload;
          } else {
            return null;
          }
        });
        if (cached) {
          console.log('returning from cache');
          res.send(cached);
        } else {
          console.log('not found in cache - api/articles called');
          // const response = await fetch(
          //   `https://api.realworld.io/api/articles?limit=5`
          // );
          // if (response.ok) {
          //   const articlesPayload = await response.json();
          //   refDataCache.put(req, articlesPayload);
          //   res.send(articlesPayload);
          // } else {
          //   next('Cannot retrieve remote articles list');
          // }
        }
      } else {
        next();
      }
    },
    (req: any, res: any, next: any) => {
      console.log('Angular middleware invoked');
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

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();

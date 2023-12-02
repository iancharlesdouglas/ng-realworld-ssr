import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import compression from 'express-compression';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { EntryLoader, TtlCache } from './src/app/server/ttl-cache';
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

  /**
   * Function that loads articles from the remote service
   * @returns Articles
   */
  const articlesLoader: EntryLoader<ArticleApiResponse> = async () => {
    const response = await fetch(
      `https://api.realworld.io/api/articles?limit=20`
    );
    if (response.ok) {
      const articlesPayload = await response.json();
      return articlesPayload;
    } else {
      return null;
    }
  };

  /**
   * Articles cache
   */
  const articlesCache = new TtlCache<ArticleApiResponse>(
    20,
    new Map([['/api/articles', articlesLoader]])
  );

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
      const path = req.path as string;
      if (path.startsWith('/api/articles')) {
        const cached = await articlesCache.get(req.path, articlesLoader);
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

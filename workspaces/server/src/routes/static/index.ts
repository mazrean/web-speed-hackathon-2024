import path from 'node:path';

import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';

import { CLIENT_STATIC_PATH, TEXT_PATH } from '../../constants/paths';
import { immutableCacheControlMiddleware } from '../../middlewares/cacheControlMiddleware';

const app = new Hono();

app.use(
  '*',
  immutableCacheControlMiddleware,
  serveStatic({
    root: path.relative(process.cwd(), CLIENT_STATIC_PATH),
  }),
);
app.use(
  '/text/*',
  immutableCacheControlMiddleware,
  serveStatic({
    rewriteRequestPath: (requestPath) => requestPath.replace(/^\/text/, ''),
    root: path.relative(process.cwd(), TEXT_PATH),
  }),
);

export { app as staticApp };

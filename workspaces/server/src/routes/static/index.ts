import path from 'node:path';

import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';

import { CLIENT_STATIC_PATH, TEXT_PATH } from '../../constants/paths';

const app = new Hono();

app.use(
  '*',
  serveStatic({
    root: path.relative(process.cwd(), CLIENT_STATIC_PATH),
  }),
);
app.use(
  '/text/*',
  serveStatic({
    rewriteRequestPath: (requestPath) => requestPath.replace(/^\/text/, ''),
    root: path.relative(process.cwd(), TEXT_PATH),
  }),
);

export { app as staticApp };

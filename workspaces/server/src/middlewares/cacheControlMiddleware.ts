import { createMiddleware } from 'hono/factory';

export const cacheControlMiddleware = createMiddleware(async (c, next) => {
  c.header('Cache-Control', 'private, no-store');
  await next();
});

export const immutableCacheControlMiddleware = createMiddleware(async (c, next) => {
  c.header('Cache-Control', 'public, max-age=31536000, immutable');
  await next();
});

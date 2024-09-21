import fs from 'node:fs/promises';

import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { z } from 'zod';

import { authorApiClient } from '@wsh-2024/app/src/features/author/apiClient/authorApiClient';
import { featureApiClient } from '@wsh-2024/app/src/features/feature/apiClient/featureApiClient';
import { rankingApiClient } from '@wsh-2024/app/src/features/ranking/apiClient/rankingApiClient';
import { releaseApiClient } from '@wsh-2024/app/src/features/release/apiClient/releaseApiClient';
import { ClientApp } from '@wsh-2024/app/src/index';
import { getDayOfWeekStr } from '@wsh-2024/app/src/lib/date/getDayOfWeekStr';
import type { RouterProp } from '@wsh-2024/app/src/routes';

import { getAuthorEditDate } from '../../cache/author';
import { INDEX_HTML_PATH } from '../../constants/paths';

const app = new Hono();

async function createData(dayOfWeek: string, authorId?: string) {
  const [release, featureList, rankingList, author ] = await Promise.all([
    releaseApiClient.fetch({ params: { dayOfWeek } }),
    featureApiClient.fetchList({ query: {} }),
    rankingApiClient.fetchList({ query: {} }),
    authorId ? authorApiClient.fetch({ params: { authorId } }) : Promise.resolve(null),
  ]);

  return {
    author,
    featureList,
    rankingList,
    release,
  } as RouterProp;
}

async function createHTML({
  body,
  data,
  styleTags,
}: {
  body: string;
  data: RouterProp;
  styleTags: string;
}): Promise<string> {
  const htmlContent = await fs.readFile(INDEX_HTML_PATH, 'utf-8');

  const content = htmlContent
    .replaceAll('<div id="root"></div>', `<div id="root">${body}</div>`)
    .replaceAll('<style id="tag"></style>', styleTags)
    .replaceAll(
      '<script id="inject-data"></script>',
      `<script id="inject-data">
        window.__INITIAL_DATA__ = ${JSON.stringify(data).replace(/</g, '\\u003c')}
      </script>`,
    );

  return content;
}

app.get('/authors/:authorId',
  zValidator(
    'param',
    z.object({
      authorId: z.string(),
    }),
  ), async (c) => {
  const dayOfWeek = getDayOfWeekStr(new Date());
  const { authorId } = c.req.valid('param');

  const ifModifiedSince = c.req.header('If-Modified-Since');
  const authorEditDate = getAuthorEditDate(authorId);
  if (ifModifiedSince && authorEditDate && new Date(ifModifiedSince).getTime() >= authorEditDate.getTime()) {
    return c.status(304);
  }

  const data = await createData(dayOfWeek, authorId);
  const sheet = new ServerStyleSheet();

  try {
    const body = ReactDOMServer.renderToString(
      sheet.collectStyles(
        <StaticRouter location={c.req.path}>
          <ClientApp data={data} />
        </StaticRouter>,
      ),
    );

    const styleTags = sheet.getStyleTags();
    const html = await createHTML({ body, data, styleTags });

    if (authorEditDate) {
      c.header('Cache-Control', 'public, max-age=3600');
      c.header('Last-Modified', authorEditDate.toUTCString());
    }

    return c.html(html);
  } catch (cause) {
    throw new HTTPException(500, { cause, message: 'SSR error.' });
  } finally {
    sheet.seal();
  }
});

app.get('*', async (c) => {
  const dayOfWeek = getDayOfWeekStr(new Date());

  switch (c.req.path) {
  case '/':
    for (const key of c.req.header('If-None-Match')?.split(',') ?? []) {
      if (key === `"${dayOfWeek}"`) {
        return c.status(304);
      }
    }
    break;
  }

  const data = await createData(dayOfWeek);
  const sheet = new ServerStyleSheet();

  try {
    const body = ReactDOMServer.renderToString(
      sheet.collectStyles(
        <StaticRouter location={c.req.path}>
          <ClientApp data={data} />
        </StaticRouter>,
      ),
    );

    const styleTags = sheet.getStyleTags();
    const html = await createHTML({ body, data, styleTags });

    return c.html(html);
  } catch (cause) {
    throw new HTTPException(500, { cause, message: 'SSR error.' });
  } finally {
    sheet.seal();
  }
});

export { app as ssrApp };

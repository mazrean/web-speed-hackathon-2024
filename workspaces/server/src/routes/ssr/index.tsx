import fs from 'node:fs/promises';

import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { z } from 'zod';

import { authorApiClient } from '@wsh-2024/app/src/features/author/apiClient/authorApiClient';
import { bookApiClient } from '@wsh-2024/app/src/features/book/apiClient/bookApiClient';
import { episodeApiClient } from '@wsh-2024/app/src/features/episode/apiClient/episodeApiClient';
import { featureApiClient } from '@wsh-2024/app/src/features/feature/apiClient/featureApiClient';
import { rankingApiClient } from '@wsh-2024/app/src/features/ranking/apiClient/rankingApiClient';
import { releaseApiClient } from '@wsh-2024/app/src/features/release/apiClient/releaseApiClient';
import { ClientApp } from '@wsh-2024/app/src/index';
import { getDayOfWeekStr } from '@wsh-2024/app/src/lib/date/getDayOfWeekStr';
import type { RouterProp } from '@wsh-2024/app/src/routes';

import { getAuthorEditDate, setAuthorEditDate } from '../../cache/author';
import { getBookEditDate } from '../../cache/book';
import { INDEX_HTML_PATH } from '../../constants/paths';

const app = new Hono();

async function createTopData(dayOfWeek: string) {
  const [release, featureList, rankingList] = await Promise.all([
    releaseApiClient.fetch({ params: { dayOfWeek } }),
    featureApiClient.fetchList({ query: {} }),
    rankingApiClient.fetchList({ query: {} }),
  ]);

  return {
    topPage: {
      featureList,
      rankingList,
      release,
    },
  } as RouterProp;
}

async function createAuthorDetailData(authorId: string) {
  const author = await authorApiClient.fetch({ params: { authorId } });

  return {
    authorDetailPage: {
      author,
    },
  } as RouterProp;
}

async function createBookDetailData(bookId: string) {
  const [book, episodeList] = await Promise.all([
    bookApiClient.fetch({ params: { bookId } }),
    episodeApiClient.fetchList({ query: { bookId } }),
  ]);

  return {
    bookDetailPage: {
      book,
      episodeList,
    },
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
  const { authorId } = c.req.valid('param');

  const ifModifiedSince = c.req.header('If-Modified-Since');
  const authorEditDate = getAuthorEditDate(authorId);
  if (ifModifiedSince && authorEditDate && new Date(ifModifiedSince).getTime() >= authorEditDate.getTime()) {
    return c.status(304);
  }

  const data = await createAuthorDetailData(authorId);
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

    c.header('Cache-Control', 'public, max-age=3600');
    if (authorEditDate) {
      c.header('Last-Modified', authorEditDate.toUTCString());
    } else {
      setAuthorEditDate(authorId, new Date());
      c.header('Last-Modified', new Date().toUTCString());
    }

    return c.html(html);
  } catch (cause) {
    throw new HTTPException(500, { cause, message: 'SSR error.' });
  } finally {
    sheet.seal();
  }
});

app.get('/books/:bookId',
  zValidator(
    'param',
    z.object({
      bookId: z.string(),
    }),
  ), async (c) => {
  const { bookId } = c.req.valid('param');

  const ifModifiedSince = c.req.header('If-Modified-Since');
  const bookEditDate = getBookEditDate(bookId);
  if (ifModifiedSince && bookEditDate && new Date(ifModifiedSince).getTime() >= bookEditDate.getTime()) {
    return c.status(304);
  }

  const data = await createBookDetailData(bookId);
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

    c.header('Cache-Control', 'public, max-age=3600');
    if (bookEditDate) {
      c.header('Last-Modified', bookEditDate.toUTCString());
    } else {
      setAuthorEditDate(bookId, new Date());
      c.header('Last-Modified', new Date().toUTCString());
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

  let data: RouterProp = {}
  switch (c.req.path) {
  case '/':
    for (const key of c.req.header('If-None-Match')?.split(',') ?? []) {
      if (key === `"${dayOfWeek}"`) {
        return c.status(304);
      }
    }
    data = await createTopData(dayOfWeek);

    c.header('Cache-Control', 'public, max-age=3600');
    c.header('ETag', `"${dayOfWeek}"`);

    break;
  }

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

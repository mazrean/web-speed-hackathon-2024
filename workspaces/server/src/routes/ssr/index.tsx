import fs from 'node:fs/promises';

import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ServerStyleSheet } from 'styled-components';

import { featureApiClient } from '@wsh-2024/app/src/features/feature/apiClient/featureApiClient';
import { rankingApiClient } from '@wsh-2024/app/src/features/ranking/apiClient/rankingApiClient';
import { releaseApiClient } from '@wsh-2024/app/src/features/release/apiClient/releaseApiClient';
import { ClientApp } from '@wsh-2024/app/src/index';
import { getDayOfWeekStr } from '@wsh-2024/app/src/lib/date/getDayOfWeekStr';
import type { RouterProp } from '@wsh-2024/app/src/routes';

import { INDEX_HTML_PATH } from '../../constants/paths';

const app = new Hono();

async function createData() {
  const dayOfWeek = getDayOfWeekStr(new Date());

  const [release, featureList, rankingList] = await Promise.all([
    releaseApiClient.fetch({ params: { dayOfWeek } }),
    featureApiClient.fetchList({ query: {} }),
    rankingApiClient.fetchList({ query: {} }),
  ]);

  return {
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

app.get('*', async (c) => {
  const data = await createData();
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

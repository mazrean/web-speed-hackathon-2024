import $ from 'jquery';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { ClientApp } from '@wsh-2024/app/src/index';
import type { RouterProp } from '@wsh-2024/app/src/routes';

import { preloadImages } from './utils/preloadImages';

const main = async () => {
  await preloadImages();

  const data = (window as unknown as {
    __INITIAL_DATA__: RouterProp;
  }).__INITIAL_DATA__;

  $(document).ready(() => {
    ReactDOM.hydrateRoot(
      $('#root').get(0)!,
      <SWRConfig value={{ revalidateIfStale: true, revalidateOnFocus: false, revalidateOnReconnect: false }}>
        <BrowserRouter>
          <ClientApp data={data} />
        </BrowserRouter>
      </SWRConfig>,
    );
  });
};

main().catch(console.error);

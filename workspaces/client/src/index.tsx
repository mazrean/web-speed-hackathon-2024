import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { ClientApp } from '@wsh-2024/app/src/index';
import type { RouterProp } from '@wsh-2024/app/src/routes';

const main = async () => {
  const data = (window as unknown as {
    __INITIAL_DATA__: RouterProp;
  }).__INITIAL_DATA__;

  document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.hydrateRoot(
      document.getElementById('root')!,
      <SWRConfig value={{ revalidateIfStale: true, revalidateOnFocus: false, revalidateOnReconnect: false }}>
        <BrowserRouter>
          <ClientApp data={data} />
        </BrowserRouter>
      </SWRConfig>,
    );
  });
};

main().catch(console.error);

//import './side-effects';

import $ from 'jquery';
import ReactDOM from 'react-dom/client';

import { AdminApp } from '@wsh-2024/admin/src/index';

import { preloadImages } from './utils/preloadImages';

const main = async () => {
  await preloadImages();

  $(document).ready(() => {
    ReactDOM.createRoot($('#root').get(0)!).render(<AdminApp />);
  });
};

main().catch(console.error);

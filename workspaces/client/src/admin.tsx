import ReactDOM from 'react-dom/client';

import { AdminApp } from '@wsh-2024/admin/src/index';

const main = async () => {
  document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.createRoot(document.getElementById('root')!).render(<AdminApp />);
  });
};

main().catch(console.error);

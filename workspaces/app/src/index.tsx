import { Dialog } from './foundation/components/Dialog';
import { GlobalStyle } from './foundation/styles/GlobalStyle';
import type { RouterProp } from './routes';
import { Router } from './routes';

export const ClientApp: React.FC<{
  data: RouterProp;
}> = ({data}) => {
  return (
    <>
      <GlobalStyle />
      <Dialog />
      <Router data={data} />
    </>
  );
};

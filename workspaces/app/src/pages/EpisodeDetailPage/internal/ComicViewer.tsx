import styled from 'styled-components';

import { ComicViewerCore } from '../../../features/viewer/components/ComicViewerCore';

const IMAGE_WIDTH = 1075;
const IMAGE_HEIGHT = 1518;

const MIN_VIEWER_HEIGHT = 500;
const MAX_VIEWER_HEIGHT = 650;

const MIN_PAGE_WIDTH = Math.floor((MIN_VIEWER_HEIGHT / IMAGE_HEIGHT) * IMAGE_WIDTH);

const _Container = styled.div`
  position: relative;
`;

const _Wrapper = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  overflow: hidden;
  --page-count-per-view: 2;
  @container (width < ${2*MIN_PAGE_WIDTH}px) {
    --page-count-per-view: 1;
  }
  --page-width: calc(100cqw / var(--page-count-per-view));
  --page-height: calc(var(--page-width) * ${IMAGE_HEIGHT} / ${IMAGE_WIDTH});
  height: var(--page-height);
  min-height: ${MIN_VIEWER_HEIGHT}px;
  max-height: ${MAX_VIEWER_HEIGHT}px;
`;

type Props = {
  episode: {
    id: string;
    pages: {
        id: string;
        image: {
            id: string;
        };
    }[];
  };
};

export const ComicViewer: React.FC<Props> = ({ episode }) => {
  return (
    <_Container>
      <_Wrapper>
        <ComicViewerCore episode={episode} />
      </_Wrapper>
    </_Container>
  );
};

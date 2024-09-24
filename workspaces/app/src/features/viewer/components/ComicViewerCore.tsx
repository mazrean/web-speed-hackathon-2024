import { type PointerEvent, Suspense, useCallback, useState } from 'react';
import styled from 'styled-components';

import { ComicViewerPage } from './ComicViewerPage';

const IMAGE_WIDTH = 1075;
const IMAGE_HEIGHT = 1518;

const _Container = styled.div`
  position: relative;
  overflow: hidden;
  container-type: size;
`;

const _Wrapper = styled.div`
  background-color: black;

  display: grid;
  grid-auto-flow: column;
  width: ${IMAGE_WIDTH * 200 / IMAGE_HEIGHT}cqh;
  grid-auto-columns: ${IMAGE_WIDTH * 100 / IMAGE_HEIGHT}cqh;
  @container (width > ${IMAGE_WIDTH * 100 / IMAGE_HEIGHT}cqh) {
    padding-inline: calc(50cqw - ${IMAGE_WIDTH * 100 / IMAGE_HEIGHT}cqh);
    scroll-padding: calc(50cqw - ${IMAGE_WIDTH * 100 / IMAGE_HEIGHT}cqh);
  }
  @container (width <= ${IMAGE_WIDTH * 100 / IMAGE_HEIGHT}cqh) {
    padding-inline: calc(50cqw - ${IMAGE_WIDTH * 50 / IMAGE_HEIGHT}cqh);
    scroll-padding: calc(50cqw - ${IMAGE_WIDTH * 50 / IMAGE_HEIGHT}cqh);
  }

  scroll-snap-type: x mandatory;
  cursor: grab;
  direction: rtl;
  scroll-behavior: smooth;

  height: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  overscroll-behavior: none;
  touch-action: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const _PaddingPage = styled.div`
  height: 100%;
  width: 100%;
  scroll-snap-align: start;
  @container (width <= ${IMAGE_WIDTH * 100 / IMAGE_HEIGHT}cqh) {
    display: none;
  }
`;

const _Page = styled.div<{
  even: boolean;
}>`
  height: 100%;
  width: 100%;

  @container (width > ${IMAGE_WIDTH * 100 / IMAGE_HEIGHT}cqh) {
    scroll-snap-align: ${({ even }) => even ? 'start' : 'none'};
  }
  @container (width <= ${IMAGE_WIDTH * 100 / IMAGE_HEIGHT}cqh) {
    scroll-snap-align: start;
  }
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

const ComicViewerCore: React.FC<Props> = ({ episode }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = useCallback((ev: PointerEvent) => {
    const scrollView = ev.currentTarget as HTMLDivElement;
    scrollView.setPointerCapture(ev.pointerId);
    setIsPressed(true);
  }, []);

  const handlePointerMove = useCallback((ev: PointerEvent) => {
    if (isPressed) {
      const scrollView = ev.currentTarget as HTMLDivElement;
      scrollView.scrollBy({
        behavior: 'instant',
        left: -ev.movementX,
      });
    }
  }, [isPressed]);

  const handlePointerUp = useCallback((ev: PointerEvent) => {
    const scrollView = ev.currentTarget as HTMLDivElement;
    scrollView.releasePointerCapture(ev.pointerId);
    setIsPressed(false);
  }, []);

  return (
    <_Container>
      <_Wrapper
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{cursor: isPressed? "grabbing" : 'grab', scrollSnapType: isPressed? 'none' : 'x mandatory'}}
        >
        <_PaddingPage />
        {episode.pages.map((page, idx) => {
          return (
            <_Page key={page.id} even={idx%2 === 1}>
              <Suspense fallback={null}>
                <ComicViewerPage pageImageId={page.image.id} />
              </Suspense>
            </_Page>
          );
        })}
        <_PaddingPage />
      </_Wrapper>
    </_Container>
  );
};

export { ComicViewerCore };

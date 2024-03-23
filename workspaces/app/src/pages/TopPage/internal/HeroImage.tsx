import styled from 'styled-components';

import { getImageUrl } from '../../../lib/image/getImageUrl';

const _Wrapper = styled.div`
  aspect-ratio: 16 / 9;
  width: 100%;
`;

const _Image = styled.img`
  display: inline-block;
  width: 100%;
  object-fit: fill;
  height: 100%;
`;

export const HeroImage: React.FC = () => {
  const dpr = window.devicePixelRatio;
  const width = window.innerWidth > 1024 ? 1024 : window.innerWidth;
  const height = (width / 16) * 9;
  const src = getImageUrl({ format: 'webp', height: height*dpr, imageId: '4a2c68cf-53eb-4b66-a4de-e1c2bf1c13c8', width: width*dpr});
  return (
    <_Wrapper>
      <_Image alt="Cyber TOON" src={src} />
    </_Wrapper>
  );
};

import styled from 'styled-components';

import { getImageUrl } from '../../../lib/image/getImageUrl';

const _Wrapper = styled.div`
  aspect-ratio: 16 / 9;
  width: 100%;
`;

const _Image = styled.img`
  display: inline-block;
  width: 100%;
`;

export const HeroImage: React.FC = () => {
  return (
    <_Wrapper>
      <_Image alt="Cyber TOON" height={576} src={getImageUrl({
        format: 'webp',
        height: 576,
        imageId: '9e4ad110-bced-41f7-a2d8-11a2f12a5b91',
        width: 1024,
      })} width={1024} />
    </_Wrapper>
  );
};

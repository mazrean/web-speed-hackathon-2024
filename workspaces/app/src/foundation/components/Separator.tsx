import styled from 'styled-components';

import { Color } from '../styles/variables';

const _Separator = styled.div`
  display: block;
  background-color: ${Color.MONO_30};
  width: 100%;
  height: 1px;
`;

export const Separator: React.FC = () => <_Separator />;

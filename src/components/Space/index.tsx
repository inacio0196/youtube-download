import styled from 'styled-components';

interface ISpace {
  vertical?: number;
  horizontal?: number;
}

const Space = styled.div<ISpace>`
  ${({ vertical }) => vertical ? `height: ${vertical}px;` : null}
  ${({ horizontal }) => horizontal ? `width: ${horizontal}px;` : null}
`;

export default Space;

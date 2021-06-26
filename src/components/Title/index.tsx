import React from 'react';
import styled from 'styled-components';
import { Box } from 'grommet';

import { IF, Space } from '../../components';

const TitleComponent = styled.span<{
  color?: string;
}>`
  font-size: 4em;
  font-family: Roboto;
  color: #000;
  ${({ color }) => (color ? `color: ${color}` : null)};
`;

interface ITitle {
  title?: string[];
  colors?: string[];
}

const Title: React.FC<ITitle> = ({ children, title, colors }) => {
  return (
    <>
      <IF condition={children}>
        <TitleComponent>{children}</TitleComponent>
      </IF>
      <IF condition={!children && title?.length > 0 && colors?.length > 0}>
        <Box flex direction="row">
          {title.length > 0 &&
            title?.map((text, index) => (
              <>
                <TitleComponent
                  key={text + index}
                  color={colors?.length > 0 && colors[index]}
                >
                  {text}
                </TitleComponent>
                {/ $/.test(text) && <Space horizontal={20} />}
              </>
            ))}
        </Box>
      </IF>
    </>
  );
};

export default Title;

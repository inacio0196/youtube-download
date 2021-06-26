import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { Grommet } from 'grommet';
import { theme } from './config/theme';

render(
  <Grommet theme={theme}>
    <App />
  </Grommet>,
  document.getElementById('root')
);

import React from 'react';

interface Iif {
  condition?: any;
}

const IF: React.FC<Iif> = ({ condition, children }) => (
  <>{condition && children}</>
);

export default IF;

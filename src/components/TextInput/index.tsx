import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ReactSVG } from 'react-svg';

import SearchIcon from '../../assets/search.svg';
import { IF } from '../../components';

interface ITextInput {
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchIcon?: boolean;
  onSearchClick?: () => void;
  errorMessage?: string;
}

const Container = styled.div`
  background-color: #fff;
  padding: 5px 10px 5px 15px;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: 10px 5px 5px #0003;
`;

const StyledInput = styled.input`
  padding: 20px;
  background-color: #fff;
  border-color: transparent;
  width: 500px;
  font-size: 1.5em;
  outline-width: 0;
`;

const ErrorMessage = styled.span`
  color: #f33423;
  font-weight: bold;
  margin-top: 5px;
  margin-left: 5px;
  font-size: 1.2em;
`;

const TextInput: React.FC<ITextInput> = ({
  value = "",
  onChange,
  placeholder,
  searchIcon,
  onSearchClick,
}) => {
  // States
  const [error, setError] = useState<boolean>(false);

  return (
    <>
      <Container>
        <IF condition={searchIcon}>
          <ReactSVG
            onClick={onSearchClick}
            src={SearchIcon}
            style={{ width: 50, height: 50, cursor: 'pointer' }}
          />
        </IF>
        <StyledInput
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </Container>
      <IF condition={error}>
        <ErrorMessage>{ErrorMessage}</ErrorMessage>
      </IF>
    </>
  );
};

export default TextInput;

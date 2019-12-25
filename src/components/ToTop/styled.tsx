import styled from 'styled-components';

export const ToTopButton = styled.button`
  position: fixed;
  bottom: 20px;
  left: 30px;
  z-index: 99;
  font-size: 18px;
  border: none;
  outline: none;
  background-color: rgba(0, 144, 193, 0.4);
  color: white;
  cursor: pointer;
  padding: 15px;
  border-radius: 4px;

  &&:hover {
    background-color: rgba(0, 144, 193, 1);
  }
`;

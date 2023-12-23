import { styled } from 'styled-components';

export const LayoutContainer = styled.div`
  max-width: 74rem;
  height: calc(100vh - 10rem);
  display: flex;
  flex-direction: column;
  margin: 5rem auto;
  padding: 2.5rem;
  background: ${(props) => props.theme['gray-800']};
  border-radius: 8px;
`;

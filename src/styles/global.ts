import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :focus {
    outline: none;
    box-shadow: 0 0 0 2px ${(props) => props.theme['green-500']};
  }

  body {
    background: ${(props) => props.theme['gray-900']};
    color: ${(props) => props.theme['gray-300']};
  }

  body, input, textarea, button {
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 1rem;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    border-radius: 8px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme['scroll-500']};
    border-radius: 8px;
    width: 8px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme['gray-500']};
  }

  :root {
    scrollbar-color: ${(props) => props.theme['scroll-500']} transparent;
    scrollbar-width: thin;
  }

  ::-moz-selection {
    color: ${(props) => props.theme['white']};
    background: ${(props) => props.theme['green-700']};
  }

  ::selection {
    color: ${(props) => props.theme['white']};
    background: ${(props) => props.theme['green-700']};
  }
`;

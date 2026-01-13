import { keyframes } from '@emotion/react';

export const pulseBorder = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.5);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
`;

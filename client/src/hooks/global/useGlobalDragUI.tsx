import { useState } from 'react';
import useTheming from '../layout/useTheming.js';

const useGlobalDragUI = () => {
  const { getAlphaColor, lightenColor } = useTheming();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const hoverColor = getAlphaColor({
    color: 'success',
    key: 'main',
    opacity: 0.3,
  });

  return {
    hoverIndex,
    setHoverIndex,
    hoverColor,
  };
};

export default useGlobalDragUI;

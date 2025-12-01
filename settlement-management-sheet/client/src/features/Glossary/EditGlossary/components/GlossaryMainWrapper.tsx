import { panelOpen, panelWidth } from '@/app/selectors/panelSelectors.js';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import useTheming from '@/hooks/layout/useTheming.js';
import { useSelector } from 'react-redux';

const GlossaryMainWrapper = ({ children }: { children: React.ReactNode }) => {
  const panelIsOpen = useSelector(panelOpen);
  const width = useSelector(panelWidth);

  const maxWidth = panelIsOpen
    ? `calc(100vw - 48px - ${width}px)`
    : 'calc(100vw - 48px)';

  const { getHexValue } = useTheming();

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        width: maxWidth,
      }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      layout
      layoutId="glossary-main"
      sx={{ overflow: 'hidden' }}
    >
      {children}
    </MotionBox>
  );
};

export default GlossaryMainWrapper;

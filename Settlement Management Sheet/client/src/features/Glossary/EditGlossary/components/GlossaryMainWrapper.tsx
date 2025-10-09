import { panelOpen } from '@/app/selectors/panelSelectors.js';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import { useSelector } from 'react-redux';

const GlossaryMainWrapper = ({ children }: { children: React.ReactNode }) => {
  const panelIsOpen = useSelector(panelOpen);

  const maxWidth = panelIsOpen ? 'calc(100vw - 348px)' : 'calc(100vw - 48px)';

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, width: maxWidth }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      layout
      layoutId="glossary-main"
      sx={{ overflowX: 'hidden' }}
    >
      {children}
    </MotionBox>
  );
};

export default GlossaryMainWrapper;

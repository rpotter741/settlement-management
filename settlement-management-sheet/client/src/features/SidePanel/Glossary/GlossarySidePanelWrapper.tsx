import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import { AnimatePresence } from 'framer-motion';
import SelectGlossary from './SelectGlossary.js';
import useGlossaryManager from '@/hooks/glossary/useGlossaryManager.js';
import { dispatch } from '@/app/constants.js';
import fetchSubTypesByUserId from '@/services/glossary/subTypes/fetchSubTypesByUserId.js';
import fetchSubTypesByUserIdThunk from '@/app/thunks/glossary/subtypes/fetchSubTypesByUserIdThunk.js';

const GlossarySidePanelWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { handleSelect, glossary } = useGlossaryManager();
  dispatch(fetchSubTypesByUserIdThunk());

  return (
    <MotionBox
      layout
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: 2,
        height: '100%',
        position: 'relative',
      }}
    >
      <AnimatePresence mode="wait">
        {!glossary ? (
          <SelectGlossary handleSelect={handleSelect} />
        ) : (
          <>{children}</>
        )}
      </AnimatePresence>
    </MotionBox>
  );
};

export default GlossarySidePanelWrapper;

import {
  selectActiveId,
  selectAllEditGlossaries,
} from '@/app/selectors/glossarySelectors.js';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Glossary } from '@/features/Glossary/Directory/GlossarySidePanel.js';

import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import { AnimatePresence } from 'framer-motion';
import GlossaryListSelect from './SelectGlossary.js';
import GlossaryNavList from './GlossaryNavList.js';
import useGlossaryManager from '@/hooks/glossary/useGlossaryManager.js';

const GlossarySidePanelWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { handleSelect, glossary } = useGlossaryManager();

  console.log(glossary);

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
          <MotionBox
            layout
            layoutId="glossary-sidebar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <GlossaryListSelect handleSelect={handleSelect} />
          </MotionBox>
        ) : (
          <MotionBox
            layout
            layoutId="glossary-sidebar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </MotionBox>
        )}
      </AnimatePresence>
    </MotionBox>
  );
};

export default GlossarySidePanelWrapper;

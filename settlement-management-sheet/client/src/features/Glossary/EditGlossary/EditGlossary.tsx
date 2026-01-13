import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import GlossaryOverview from './Overview/GlossaryOverview.js';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';
import CustomizePalette from './Palette/CustomizePalette.js';
import GlossaryTermsEditor from './Terms/GlossaryTermsTab.js';
import TemplateManager from './Templates/TemplateManager.js';
import EntriesViewer from '../Entries/EntriesViewer.js';
import GlossaryGraph from './Graph/GlossaryGraph.js';
import { AnimatePresence } from 'framer-motion';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';

const EditGlossary: React.FC = () => {
  const {
    ui,
    updatePaletteColor,
    savePaletteSettings,
    resetPaletteToDefault,
    activeId,
  } = useGlossaryEditor();

  const editGlossaryComponentMap = useMemo(
    () => ({
      Overview: () => <GlossaryOverview />,
      Graph: () => <GlossaryGraph />,
      Entries: () => <EntriesViewer />,
      'Entry Types': () => <GlossaryTermsEditor />,
      Templates: () => <TemplateManager />,
      Palette: () => (
        <CustomizePalette
          column={false}
          onChange={updatePaletteColor}
          onSave={savePaletteSettings}
          onReset={resetPaletteToDefault}
        />
      ),
      Calendar: () => <TemplateManager />,
    }),
    [activeId]
  );

  const Component =
    editGlossaryComponentMap[
      ui.activeTab as keyof typeof editGlossaryComponentMap
    ] || (() => <MotionBox layoutId="glossary-main">Not Found</MotionBox>);

  return (
    <AnimatePresence mode="wait">
      <Component key={ui.activeTab} />
    </AnimatePresence>
  );
};

export default EditGlossary;

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Tab } from '@/app/types/SidePanelTypes.js';
import CreateGlossaryShell from '@/components/shared/CreateShell/CreateGlossaryShell.js';
import { selectEntryById } from '@/app/selectors/glossarySelectors.js';
import { useSelector } from 'react-redux';
import EditLandmarkForm from './EditLandmarkForm.js';
import PreviewGlossaryWithShell from '../PreviewGlossaryWithShell.js';

interface LandmarkFormProps {
  tab: Tab;
}

const LandmarkForm: React.FC<LandmarkFormProps> = ({ tab }) => {
  const [lastSaved, setLastSaved] = useState<Record<string, any>>({});
  if (!tab.glossaryId || tab.tool !== 'landmark') return null;
  const entry: any = useSelector(selectEntryById(tab.glossaryId, tab.id));
  console.log(entry, 'entry in LandmarkForm');

  const theme = useTheme();

  useEffect(() => {
    console.log(lastSaved, 'lastSaved in LandmarkForm');
  });

  return (
    <CreateGlossaryShell
      tab={tab}
      editComponent={EditLandmarkForm}
      editComponentProps={{ lastSaved, setLastSaved }}
      previewComponent={PreviewGlossaryWithShell}
      previewComponentProps={{}}
      pageVariant="fullWidth"
    />
  );
};

export default LandmarkForm;

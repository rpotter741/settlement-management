import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Tab } from '@/app/types/SidePanelTypes.js';
import CreateGlossaryShell from '@/components/shared/CreateShell/CreateGlossaryShell.js';
import { selectEntryById } from '@/app/selectors/glossarySelectors.js';
import { useSelector } from 'react-redux';
import EditContinentForm from './EditContinentForm.js';
import EditGlossaryEntryForm from '../EditGlossaryWithShell.js';
import PreviewGlossaryWithShell from '../PreviewGlossaryWithShell.js';

interface GeographyFormProps {
  tab: Tab;
}

const ContinentForm: React.FC<GeographyFormProps> = ({ tab }) => {
  const [lastSaved, setLastSaved] = useState<Record<string, any>>({});
  if (!tab.glossaryId || tab.tool !== 'continent') return null;

  return (
    <CreateGlossaryShell
      tab={tab}
      editComponent={EditGlossaryEntryForm}
      editComponentProps={{ lastSaved, setLastSaved }}
      previewComponent={PreviewGlossaryWithShell}
      previewComponentProps={{}}
    />
  );
};

export default ContinentForm;

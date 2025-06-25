import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Tab } from '@/app/types/SidePanelTypes.js';
import CreateGlossaryShell from '@/components/shared/CreateShell/CreateGlossaryShell.js';
import { selectEntryById } from '@/app/selectors/glossarySelectors.js';
import { useSelector } from 'react-redux';
import EditDomainForm from './EditDomainForm.js';
import EditGlossaryEntryForm from '../EditGlossaryWithShell.js';
import PreviewGlossaryWithShell from '../PreviewGlossaryWithShell.js';

interface DomainFormProps {
  tab: Tab;
}

const DomainForm: React.FC<DomainFormProps> = ({ tab }) => {
  const [lastSaved, setLastSaved] = useState<Record<string, any>>({});
  if (!tab.glossaryId || tab.tool !== 'domain') return null;
  const entry: any = useSelector(selectEntryById(tab.glossaryId, tab.id));
  console.log(entry, 'entry in DomainForm');

  const theme = useTheme();

  useEffect(() => {
    console.log(lastSaved, 'lastSaved in DomainForm');
  });

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

export default DomainForm;

import React, { useState } from 'react';
import { Tab } from '@/app/types/SidePanelTypes.js';
import CreateGlossaryShell from '@/components/shared/CreateShell/CreateGlossaryShell.js';
import EditGlossaryEntryForm from '../EditGlossaryWithShell.js';
import PreviewGlossaryWithShell from '../PreviewGlossaryWithShell.js';

interface LocationFormProps {
  tab: Tab;
}

const LocationForm: React.FC<LocationFormProps> = ({ tab }) => {
  const [lastSaved, setLastSaved] = useState<Record<string, any>>({});
  if (!tab.glossaryId || tab.tool !== 'location') return null;

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

export default LocationForm;

import React, { useState } from 'react';
import { Tab } from '@/app/types/SidePanelTypes.js';
import CreateGlossaryShell from '@/components/shared/CreateShell/CreateGlossaryShell.js';
import EditGlossaryEntryForm from '../EditGlossaryWithShell.js';
import PreviewGlossaryWithShell from '../PreviewGlossaryWithShell.js';

interface SettlementFormProps {
  tab: Tab;
}

const SettlementForm: React.FC<SettlementFormProps> = ({ tab }) => {
  const [lastSaved, setLastSaved] = useState<Record<string, any>>({});
  if (!tab.glossaryId || tab.tool !== 'settlement') return null;

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

export default SettlementForm;

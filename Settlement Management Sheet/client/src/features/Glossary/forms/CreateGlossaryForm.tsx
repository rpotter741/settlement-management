import { Tab } from '@/app/types/SidePanelTypes.js';
import CreateGlossaryShell from '@/components/shared/CreateShell/CreateGlossaryShell.js';
import EditGlossaryEntryForm from './EditGlossaryEntryWithShell.js';
import PreviewGlossaryWithShell from './PreviewGlossaryWithShell.js';

interface LandmarkFormProps {
  tab: Tab;
}

const GlossaryEntryForm: React.FC<LandmarkFormProps> = ({ tab }) => {
  return (
    <CreateGlossaryShell
      tab={tab}
      editComponent={EditGlossaryEntryForm}
      editComponentProps={{}}
      previewComponent={PreviewGlossaryWithShell}
      previewComponentProps={{}}
    />
  );
};

export default GlossaryEntryForm;

import { Tab } from '@/app/types/TabTypes.js';
import CreateGlossaryShell from '@/components/shared/CreateShell/CreateGlossaryShell.js';
import EditGlossaryEntryForm from './EditGlossaryEntryWithShell.js';
import PreviewGlossaryWithShell from './PreviewGlossaryWithShell.js';
import PreviewOrchestrator from '../EditGlossary/Templates/components/PreviewOrchestrator.js';

interface LandmarkFormProps {
  tab: Tab;
}

const GlossaryEntryForm: React.FC<LandmarkFormProps> = ({ tab }) => {
  return (
    <CreateGlossaryShell
      tab={tab}
      editComponent={PreviewOrchestrator}
      editComponentProps={{}}
      previewComponent={PreviewGlossaryWithShell}
      previewComponentProps={{}}
    />
  );
};

export default GlossaryEntryForm;

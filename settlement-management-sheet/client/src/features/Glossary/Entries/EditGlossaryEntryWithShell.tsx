import { useShellContext } from '@/context/ShellContext.js';
import PreviewOrchestrator from '../EditGlossary/Templates/components/PreviewOrchestrator.js';
import { useSelector } from 'react-redux';
import {
  selectAllSubTypes,
  selectSubTypeById,
} from '@/app/selectors/subTypeSelectors.js';
import { GenericContext } from '@/context/GenericContext.js';
import { useAutosave } from '@/hooks/utility/useAutosave/useAutosave.js';
import glossaryEntryAutosaveConfig from '@/hooks/utility/useAutosave/configs/glossaryEntryConfig.js';

interface EditGlossaryEntryFormProps {
  height: string;
}

const EditGlossaryEntryForm: React.FC<EditGlossaryEntryFormProps> = ({
  height = '100%',
}) => {
  const { id, node, entry } = useShellContext();

  const subType = useSelector(selectSubTypeById(node?.subTypeId || ''));
  if (!subType) return null;

  useAutosave(
    glossaryEntryAutosaveConfig({
      glossaryId: node?.glossaryId || '',
      entryId: id,
      name: entry?.name || 'Glossary Entry',
      subTypeId: node?.subTypeId || '',
    })
  );

  return (
    <GenericContext.Provider value={{ source: entry }}>
      <PreviewOrchestrator
        subType={subType}
        mode={'preview'}
        editId={id}
        mt={0}
        disableResize={true}
      />
    </GenericContext.Provider>
  );
};

export default EditGlossaryEntryForm;

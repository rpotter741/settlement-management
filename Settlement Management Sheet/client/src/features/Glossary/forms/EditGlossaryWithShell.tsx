import { useShellContext } from '@/context/ShellContext.js';
import useNodeEditor from '@/hooks/useNodeEditor.js';
import { Box } from '@mui/system';
import propertyArrayMap from '../helpers/entryTypePropertyArray.js';
import PropertyMapTabs from '../wrappers/PropertyMapTabs.js';

interface EditGlossaryEntryFormProps {
  height: string;
}

const EditGlossaryEntryForm: React.FC<EditGlossaryEntryFormProps> = ({
  height = '100%',
}) => {
  const { glossaryId, id, mode, side } = useShellContext();
  const { node } = useNodeEditor(glossaryId, id);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height,
        mt: 2,
        alignContent: 'start',
        justifyContent: 'start',
        gap: 2,
        borderRadius: mode === 'edit' ? 2 : 0,
        boxSizing: 'border-box',
        overflowY: 'scroll',
        width: '100%',
      }}
    >
      <PropertyMapTabs propertyMap={propertyArrayMap[node.entryType]} />
    </Box>
  );
};

export default EditGlossaryEntryForm;

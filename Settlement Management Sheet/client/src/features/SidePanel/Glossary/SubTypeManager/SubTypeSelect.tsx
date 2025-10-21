import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  TextField,
  Typography,
} from '@mui/material';
import {
  GlossaryEntryType,
  glossaryEntryTypeOptions,
} from '../../../../../../shared/types/index.js';
import { useMemo, useState } from 'react';
import { useModalActions } from '@/hooks/global/useModal.js';
import capitalize from '@/utility/inputs/capitalize.js';
import { usePropertyLabel } from '@/features/Glossary/utils/getPropertyLabel.js';
import useGlossaryManager from '@/hooks/glossary/useGlossaryManager.js';
import makeNewSubType from '@/features/Glossary/EditGlossary/Templates/generics/genericContinent.js';
import SubTypeSelectButton from './components/SubTypeSelectButton.js';

const SubTypeSelect = ({
  type,
  setType,
  editId,
  onSubmit,
}: {
  type: GlossaryEntryType | string;
  setType: (type: GlossaryEntryType | string) => void;
  editId: string | null;
  onSubmit: (subType: any) => void;
}) => {
  const [listState, setListState] = useState<'all' | 'custom' | 'system'>(
    'all'
  );
  const { showModal } = useModalActions();
  const { getPropertyLabel } = usePropertyLabel();

  const { glossary } = useGlossaryManager();

  const existingSubTypes = useMemo(() => {
    if (!glossary) return [];
    const subTypes = glossary.subTypes || [];

    if (type) {
      return Object.values(subTypes[type] || {});
    } else {
      return Object.keys(subTypes);
    }
  }, [glossary, type]);

  const typeOptions = glossaryEntryTypeOptions
    .map((type) => {
      const { label, defaultLabel } = getPropertyLabel('system', type);
      return {
        label: label || capitalize(defaultLabel || type),
        value: type,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const onNewSubType = () => {
    if (!type) {
      const entry = {
        id: 'new-subType-id',
        componentKey: 'NameNewSubType',
        props: {},
      };
      return showModal({ entry });
    }
    const name = getPropertyLabel('system', type).label || type;
    const { subType } = makeNewSubType(name, type as GlossaryEntryType);
    onSubmit(subType);
    return;
  };

  const handleButtonClick = (subType: any) => {
    onSubmit(subType);
  };

  return (
    <>
      <Autocomplete
        disablePortal
        options={typeOptions}
        renderInput={(params) => (
          <TextField {...params} label="Select a Type..." />
        )}
        getOptionLabel={(option) => option.label || ''}
        sx={{ pt: 2 }}
        value={
          type
            ? {
                label: capitalize(
                  getPropertyLabel('system', type as GlossaryEntryType).label ||
                    type
                ),
                value: type as GlossaryEntryType,
              }
            : null
        }
        onChange={(_, newValue) => {
          setType(newValue ? (newValue.value as GlossaryEntryType) : '');
        }}
      />
      <ButtonGroup fullWidth sx={{ mt: 2, mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => setListState('all')}
          size="small"
          sx={{
            backgroundColor:
              listState === 'all' ? 'success.main' : 'secondary.main',
          }}
        >
          All
        </Button>
        <Button
          variant="contained"
          onClick={() => setListState('custom')}
          size="small"
          sx={{
            backgroundColor:
              listState === 'custom' ? 'success.main' : 'secondary.main',
          }}
        >
          Custom
        </Button>
        <Button
          variant="contained"
          onClick={() => setListState('system')}
          size="small"
          sx={{
            backgroundColor:
              listState === 'system' ? 'success.main' : 'secondary.main',
          }}
        >
          System
        </Button>
      </ButtonGroup>
      <Box>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          fullWidth
          onClick={onNewSubType}
        >
          {type
            ? `Create ${capitalize(getPropertyLabel('system', type).label || type)} SubType`
            : 'Create New Sub-Type'}
        </Button>
        {type
          ? existingSubTypes.map((subType: any) => (
              <SubTypeSelectButton
                key={subType.id}
                subType={subType}
                editId={editId}
                onClick={() => handleButtonClick(subType)}
              />
            ))
          : (existingSubTypes as string[]).map((subTypeKey) => (
              <Box key={subTypeKey}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  {capitalize(
                    getPropertyLabel('system', subTypeKey).label || subTypeKey
                  )}
                </Typography>
                {Object.values(glossary.subTypes?.[subTypeKey] || {}).map(
                  (subType: any) => (
                    <SubTypeSelectButton
                      key={subType.id}
                      subType={subType}
                      editId={editId}
                      onClick={() => handleButtonClick(subType)}
                    />
                  )
                )}
              </Box>
            ))}
      </Box>
    </>
  );
};

export default SubTypeSelect;

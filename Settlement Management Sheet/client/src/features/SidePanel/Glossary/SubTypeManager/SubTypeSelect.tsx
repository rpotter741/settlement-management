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
import { useSelector } from 'react-redux';
import { selectAllSubTypes } from '@/app/selectors/subTypeSelectors.js';
import { SubType } from '@/app/slice/subTypeSlice.js';

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

  const allSubTypes = useSelector(selectAllSubTypes);

  const existingSubTypes = useMemo(() => {
    if (!allSubTypes) return [];

    const contentType =
      listState === 'custom'
        ? 'CUSTOM'
        : listState === 'system'
          ? 'SYSTEM'
          : null;

    return allSubTypes.filter((subType) => {
      if (type && subType.entryType !== type) return false;
      if (contentType && subType.contentType !== contentType) return false;
      return true;
    });
  }, [allSubTypes, type, listState]);

  const typeOptions = glossaryEntryTypeOptions
    .map((type) => {
      const { label, defaultLabel } = getPropertyLabel(type);
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
    const name = getPropertyLabel(type).label || type;
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
                label: capitalize(getPropertyLabel(type).label || type),
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
            ? `Create ${capitalize(getPropertyLabel(type).label || type)} SubType`
            : 'Create New Sub-Type'}
        </Button>
        {existingSubTypes.map((subType: SubType) => (
          <SubTypeSelectButton
            key={subType.id}
            subType={subType}
            editId={editId}
            onClick={() => handleButtonClick(subType)}
          />
        ))}
      </Box>
    </>
  );
};

export default SubTypeSelect;

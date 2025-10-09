import { Autocomplete, Box, Button, TextField } from '@mui/material';
import {
  GlossaryEntryType,
  glossaryEntryTypeOptions,
} from '../../../../../../shared/types/index.js';
import { useState } from 'react';
import { useModalActions } from '@/hooks/global/useModal.js';
import capitalize from '@/utility/inputs/capitalize.js';
import { usePropertyLabel } from '@/features/Glossary/utils/getPropertyLabel.js';
import { useRelayPub } from '@/hooks/global/useRelay.js';
import useGlossaryManager from '@/hooks/glossary/useGlossaryManager.js';
import { v4 as newId } from 'uuid';

interface SubTypeShape {
  name: string;
  id: string;
}

const makeDefaultSubType = ({
  name,
  type,
}: {
  name: string;
  type: GlossaryEntryType;
}): SubTypeShape => ({
  name: `New ${capitalize(name)} Sub-Type`,
  id: newId(),
});

const SubTypeSelect = ({
  setSubTypeId,
}: {
  setSubTypeId: (subTypeId: any) => void;
}) => {
  const { showModal } = useModalActions();
  const { getPropertyLabel } = usePropertyLabel();
  const { openRelay } = useRelayPub<SubTypeShape>({ id: 'subType-editor' });
  const { glossary } = useGlossaryManager();

  const [type, setType] = useState<GlossaryEntryType | null>(null);

  const glossarySubTypes = glossary?.templates || {};
  const existingSubTypes = type ? glossarySubTypes[type] || [] : [];

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
        props: { setSubTypeId },
      };
      return showModal({ entry });
    }
    const name = getPropertyLabel('system', type).label || type;
    const subType = makeDefaultSubType({ name, type });
    openRelay(subType, 'complete');
    return setSubTypeId(subType.id);
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
                  getPropertyLabel('system', type).label || type
                ),
                value: type,
              }
            : null
        }
        onChange={(_, newValue) => {
          setType(newValue ? (newValue.value as GlossaryEntryType) : null);
        }}
      />
      <Box>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          fullWidth
          onClick={onNewSubType}
        >
          {type
            ? `Create ${capitalize(getPropertyLabel('system', type).label || 'broke')} SubType`
            : 'Create New Sub-Type'}
        </Button>
        {existingSubTypes.map((subType: any) => (
          <Button key={subType.id}>{subType.name}</Button>
        ))}
      </Box>
    </>
  );
};

export default SubTypeSelect;

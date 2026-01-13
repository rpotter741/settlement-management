import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import makeNewSubType from '../EditGlossary/Templates/generics/genericContinent.js';
import { Glossary } from '../Directory/GlossarySidePanel.js';
import {
  GlossaryEntryType,
  glossaryEntryTypeOptions,
} from '../../../../../shared/types/index.js';
import { useRelayChannel, useRelayPub } from '@/hooks/global/useRelay.js';
import { useState } from 'react';
import { usePropertyLabel } from '../utils/getPropertyLabel.js';
import { useSelector } from 'react-redux';
import { selectAllSubTypes } from '@/app/selectors/subTypeSelectors.js';
import forkSubTypeThunk from '@/app/thunks/glossary/subtypes/forkSubTypeThunk.js';
import { useModalActions } from '@/hooks/global/useModal.js';
import addSubTypeThunk from '@/app/thunks/glossary/subtypes/addSubTypeThunk.js';

const NameNewSubType = () => {
  const { openRelay } = useRelayChannel({ id: 'create-new-subtype' });
  const { getPropertyLabel } = usePropertyLabel();

  const [name, setName] = useState<string>('');
  const [type, setType] = useState<GlossaryEntryType | null>('continent');
  const [cloneFrom, setCloneFrom] = useState<any>(null);

  const { closeModal } = useModalActions();

  const allSubTypes = useSelector(selectAllSubTypes);

  const handleCancel = () => {
    openRelay({
      data: { cancel: true },
      status: 'complete',
    });
  };

  const handleNewSubType = () => {
    if (!cloneFrom) {
      const { subType } = makeNewSubType(name, type as GlossaryEntryType);
      addSubTypeThunk({ subType });
      closeModal();
    } else {
      const subTypeToClone = allSubTypes.find(
        (subType) => subType.name === cloneFrom
      );
      if (subTypeToClone) {
        forkSubTypeThunk({
          subType: subTypeToClone,
          name,
        });
        closeModal();
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ width: '100%', textAlign: 'center' }}
      >
        Name New Sub-Type
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter sub-type name"
          fullWidth
        />
        <Select
          value={type || ''}
          onChange={(e) => setType(e.target.value as GlossaryEntryType)}
          displayEmpty
          fullWidth
        >
          {glossaryEntryTypeOptions.map((option: GlossaryEntryType) => (
            <MenuItem key={option} value={option}>
              {getPropertyLabel(option).label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          mt: 2,
          gap: 2,
        }}
      >
        <Typography variant="body1" color="textSecondary" sx={{ width: '25%' }}>
          Clone From:
        </Typography>
        <Select
          value={cloneFrom || ''}
          onChange={(e) => setCloneFrom(e.target.value)}
          displayEmpty
          fullWidth
        >
          {allSubTypes.map((subType) => (
            <MenuItem key={subType.id} value={subType.name}>
              {subType.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <Button variant="contained" color="primary" onClick={handleNewSubType}>
          Create Sub-Type
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default NameNewSubType;

// makeNewSubType(name, type as GlossaryEntryType)

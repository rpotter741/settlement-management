import { useModalActions } from '@/hooks/global/useModal.js';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { usePropertyLabel } from '../utils/getPropertyLabel.js';
import deleteSubTypeThunk from '@/app/thunks/glossary/subtypes/schemas/deleteSubTypeThunk.ts';
import { useRelayChannel } from '@/hooks/global/useRelay.js';

const ConfirmDeleteSubType = ({ subType }: { subType: any }) => {
  //
  const [subTypeName, setSubTypeName] = useState<string>('');
  const { closeModal } = useModalActions();
  const { getPropertyLabel } = usePropertyLabel();

  const { openRelay } = useRelayChannel({ id: 'subType-sidebar-template' });

  const handleDelete = () => {
    // Call the deleteSubTypeService with the subTypeId
    deleteSubTypeThunk({ subTypeId: subType.id });
    closeModal();
    openRelay({ data: { isDeleting: true }, status: 'complete' });
  };

  return (
    <Box
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Are you sure you want to delete the sub-type "{subType?.name}"?
      </Typography>
      <Typography variant="body1">
        This action will permanently remove all associated data, forcing any
        associated entries to fallback to their glossary's default{' '}
        <strong>{getPropertyLabel(subType.entryType).label}</strong> sub-type
        assignment.
      </Typography>
      <Typography
        variant="body1"
        color="error"
        sx={{ mt: 2 }}
        fontWeight="bold"
      >
        This action cannot be undone.
      </Typography>
      <Box>
        <Divider />
        <Typography variant="body1" sx={{ my: 2 }}>
          Affected Entries per Glossary:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            alignItems: 'center',
            mb: 1,
            px: 4,
          }}
        >
          <Typography variant="body1" fontWeight="bold">
            Vals'kar
          </Typography>
          <Typography variant="body2" sx={{ textDecoration: 'underline' }}>
            3 entries
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            alignItems: 'center',
            mb: 1,
            px: 4,
          }}
        >
          <Typography variant="body1" fontWeight="bold">
            Doscari
          </Typography>
          <Typography variant="body2" sx={{ textDecoration: 'underline' }}>
            9 entries
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            alignItems: 'center',
            mb: 1,
            px: 4,
          }}
        >
          <Typography variant="body1" fontWeight="bold">
            Eclorea
          </Typography>
          <Typography variant="body2" sx={{ textDecoration: 'underline' }}>
            1 entry
          </Typography>
        </Box>
        <Divider />
      </Box>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Please type in the name of the sub-type to confirm:{' '}
        <strong>{subType?.name}</strong>
      </Typography>
      <TextField
        value={subTypeName}
        onChange={(e) => setSubTypeName(e.target.value)}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="outlined" color="primary" onClick={() => closeModal()}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={subTypeName !== subType?.name}
          onClick={handleDelete}
        >
          Delete Sub-Type
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmDeleteSubType;

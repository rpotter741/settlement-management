import updateEntryById from '@/app/thunks/glossary/entries/updateEntryById.js';
import { Box, Button, Typography } from '@mui/material';
import { dispatch } from '@/app/constants.js';
import { useModalActions } from '@/hooks/global/useModal.js';
import {
  removeGlossaryEntry,
  updateGlossaryNode,
} from '@/app/slice/glossarySlice.js';
import changeEntrySubTypeService from '@/services/glossary/entry/changeEntrySubTypeService.js';

const ConfirmChangeSubType = ({
  updatedEntry,
  oldEntry,
  newSubTypeId,
  removed,
  preserved,
  glossaryId,
}: {
  updatedEntry: any;
  oldEntry: any;
  newSubTypeId: string;
  removed: String[];
  preserved: String[];
  glossaryId: string;
}) => {
  //
  const { closeModal } = useModalActions();

  const handleConfirm = async () => {
    await changeEntrySubTypeService({
      entryId: updatedEntry.id,
      newSubTypeId,
    });
    dispatch(
      removeGlossaryEntry({
        glossaryId,
        entryId: updatedEntry.id,
      })
    );
    dispatch(
      updateGlossaryNode({
        glossaryId,
        nodeId: updatedEntry.id,
        nodeData: {
          subTypeId: newSubTypeId,
        },
      })
    );
    closeModal();
  };

  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ width: '100%', textAlign: 'center' }}
      >
        Confirm Subtype Change
      </Typography>
      <Box>
        <Typography variant="body1" color="warning">
          Changing subtypes will result in the removal of {removed.length}{' '}
          properties and all their associated data:
        </Typography>
        <Box sx={{ my: 1, px: 1 }}>
          {removed.map((name, index) => (
            <Box sx={{ my: 0.5, px: 1 }} key={index}>
              - {name}
            </Box>
          ))}
        </Box>
        <Typography variant="body1" sx={{ my: 2 }} color="success">
          You will keep {preserved.length} properties:
        </Typography>
        <Box sx={{ my: 1, px: 1 }}>
          {preserved.map((name, index) => (
            <Box sx={{ my: 0.5, px: 1 }} key={index}>
              - {name}
            </Box>
          ))}
        </Box>
      </Box>
      <Button onClick={handleConfirm}>Confirm</Button>
      <Button onClick={() => closeModal()}>Cancel</Button>
    </Box>
  );
};

export default ConfirmChangeSubType;

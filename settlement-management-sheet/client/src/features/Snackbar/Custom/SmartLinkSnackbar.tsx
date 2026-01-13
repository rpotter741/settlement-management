import { ModalQueueEntry } from '@/app/types/ModalTypes.js';
import { useModalActions } from '@/hooks/global/useModal.js';
import { Box, Button } from '@mui/material';

const SmartLinkSnackbar = ({
  message,
  closeSnackbar,
  syncSpaceProps,
}: {
  message: string;
  closeSnackbar: () => void;
  syncSpaceProps: any;
}) => {
  const { showModal } = useModalActions();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {message}
      <Button
        size="small"
        sx={{ p: 0, m: 0, px: 1, width: 75, textTransform: 'none' }}
        variant="contained"
        color="warning"
        onClick={() => {
          const modalEntry: ModalQueueEntry = {
            id: 'all-smart-links',
            componentKey: 'ReviewSyncChanges',
            props: {
              ...syncSpaceProps,
            },
          };
          showModal({ entry: modalEntry });
          closeSnackbar();
        }}
      >
        Review
      </Button>
      <Button
        size="small"
        sx={{ p: 0, m: 0, px: 1, width: 75, textTransform: 'none' }}
        variant="contained"
        color="success"
      >
        Approve
      </Button>
    </Box>
  );
};

export default SmartLinkSnackbar;

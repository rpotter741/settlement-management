import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { ModalContent } from './TabbedContainer.js';
import { Tab } from '@/app/types/SidePanelTypes.js';
import toolList from '@/utility/toolList.js';
import toolServices from '@/services/toolServices.js';
import { useTools } from '@/hooks/useTools.js';
import { ToolName } from 'types/common.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { cancelToolEdit } from '@/app/thunks/toolThunks.js';
import { AppDispatch } from '@/app/store.js';
import { tabMap } from '@/maps/tabMap.js';
import { set } from 'lodash';
import { useSidePanel } from '@/hooks/useSidePanel.js';
import { useModalActions } from '@/hooks/useModal.js';

const ConfirmDirtyClose: React.FC<{
  tab: Tab;
}> = ({ tab }) => {
  const dispatch: AppDispatch = useDispatch();
  const { removeById } = useSidePanel();
  const { closeModal } = useModalActions();
  const { tool, id, side, name, tabId } = tab;

  const onClose = () => {
    removeById(tab.tabId, tab.side, false);
  };

  const { edit } =
    tool && toolList.includes(tool as ToolName)
      ? useTools(tool as ToolName, id)
      : { edit: null };

  const handleSaveClose = async () => {
    if (!tool || !edit) return;
    if (toolList.includes(tool as ToolName)) {
      try {
        await toolServices.saveTool({ tool: tool as ToolName, data: edit });
        onClose();
        closeModal();
      } catch (error: any) {
        localStorage.setItem(`${tool}-${id}`, JSON.stringify(edit));
        closeModal();
        dispatch(
          showSnackbar({
            message: `Failed to save ${name} to database. Try again later.`,
            type: 'error',
          })
        );
        return;
      }
    }
  };

  const handleCancel = () => {
    closeModal();
  };

  const handleCloseNoSave = () => {
    dispatch(
      cancelToolEdit({
        tool: tool as ToolName,
        id,
        tabId,
        side,
        validationFields:
          tabMap[tab.tabType][tool as ToolName].validationFields || [],
      })
    );
    closeModal();
    onClose();
  };

  return (
    <Box sx={{ p: 2, textAlign: 'center', minWidth: 500 }}>
      <Typography variant="h6" gutterBottom>
        Unsaved Changes
      </Typography>
      <Typography variant="body1" gutterBottom>
        You have unsaved changes. Close <strong>{tab.name}</strong> without
        saving?
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" color="success" onClick={handleSaveClose}>
          Save and Close
        </Button>
        <Button
          variant="outlined"
          color="info"
          onClick={handleCancel}
          sx={{ ml: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleCloseNoSave}
          sx={{ ml: 2 }}
        >
          Close Without Saving
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmDirtyClose;

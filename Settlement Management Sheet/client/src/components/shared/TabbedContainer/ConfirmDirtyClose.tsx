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
import { tabMap } from '@/utility/tabMap.js';
import { set } from 'lodash';

const ConfirmDirtyClose: React.FC<{
  onClose: () => void;
  tab: Tab;
  side: 'left' | 'right';
  setModalContent: (
    content: {
      component: React.ComponentType;
      props?: Record<string, any>;
    } | null
  ) => void;
}> = ({ onClose, side, tab, setModalContent }) => {
  const dispatch: AppDispatch = useDispatch();
  const { tool, id, name, tabId } = tab;

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
        setModalContent(null);
      } catch (error: any) {
        localStorage.setItem(`${tool}-${id}`, JSON.stringify(edit));
        setModalContent(null);
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
    setModalContent(null);
  };

  const handleCloseNoSave = () => {
    dispatch(
      cancelToolEdit({
        tool: tool as ToolName,
        id,
        tabId,
        side,
        validationFields: tabMap[tool as ToolName].validationFields,
      })
    );
    console.log('before modal content');
    setModalContent(null);
    console.log('after modal content');
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

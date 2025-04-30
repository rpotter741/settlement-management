import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'context/SnackbarContext.jsx';
import { Box, Typography, Modal } from '@mui/material';
import ValidationChecklist from 'components/shared/ValidationChecklist/ValidationChecklist.jsx';
import DesktopMenu from 'components/shared/ToolMenu/DesktopMenu.jsx';
import MobileMenu from 'components/shared/ToolMenu/MobileMenu.jsx';
import LoadTool from 'components/shared/LoadTool/LoadTool.jsx';
import useServer from 'services/useServer.js';
import prefetchToolContent from 'services/prefetchTools.js';
import { useTools } from 'hooks/useTool.jsx';
import { useInitializeTool } from 'hooks/useInitializeTool.jsx';
import { useDispatch } from 'react-redux';
import { initializeTool as initialize } from '../../../app/toolSlice.js';
import { ToolContext } from 'context/ToolContext.jsx';

const CreateShell = ({
  tool,
  id,
  initializeTool,
  validationFields,
  editComponent,
  previewComponent,
  checklistContent,
  loadDisplayName,
  editComponentProps = {},
  previewComponentProps = {},
  modalComponents = {},
  modalComponentsProps = {},
  mode,
  side,
}) => {
  const { current, edit, allIds, saveToolEdit, errors } = useTools(tool, id);

  const { errorCount } = useInitializeTool({
    tool,
    id,
    allIds,
    current,
    errorData: errors,
    initializeFn: initializeTool,
    validationFields,
  });

  const { showSnackbar } = useSnackbar();

  const [editMode, setEditMode] = useState(mode === 'edit');
  const [showModal, setShowModal] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const allCapsTool = tool.toUpperCase();

  const handleCancel = () => {
    setEditMode(false);
    setShowModal(null);
  };

  const handleSave = async () => {
    try {
      const response = await useServer({
        tool,
        type: 'save',
        data: { ...edit },
      });
      saveToolEdit(edit.refId, true);
      setEditMode(false);
      showSnackbar(response.message, 'success');
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const handlePublish = async () => {
    try {
      const response = await useServer({
        tool,
        type: 'publish',
        data: { ...edit },
      });
      showSnackbar(response.message, 'success');
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const dispatch = useDispatch();

  const handleAdd = async () => {
    const newTool = initializeTool(tool);
    dispatch(initialize({ tool, data: newTool }));
  };

  const buttonActions = {
    add: () => handleAdd(),
    edit: () => setEditMode(true),
    save: () => handleSave(),
    cancel: () => handleCancel(),
    publish: () => handlePublish(),
    loadHover: () => prefetchToolContent(tool),
    load: () => setShowModal('Load Tool'),
  };

  if (!current) {
    return <Box>Loading...</Box>;
  }

  if (current !== null) {
    return (
      <ToolContext.Provider value={{ tool, id, mode, side }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            height: '100%',
            flexShrink: 0,
            flexGrow: 2,
          }}
          className="create-shell"
        >
          {errorCount !== undefined && errors && current && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 20,
                height: 'auto',
                backgroundColor: 'background.paper',
                boxShadow: 4,
                borderRadius: 4,
                transition: 'transform 0.4s ease-in-out',
                zIndex: 1000,
              }}
            >
              <ValidationChecklist
                errorCount={errorCount}
                defaultExpand={expanded}
                checklistContent={checklistContent}
                errors={errors}
                tool={tool}
              />
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'start',
              flexDirection: 'column',
              alignItems: 'center',
              px: 4,
              mb: 7,
              overflowY: 'scroll',
              boxShadow: 4,
              borderRadius: 4,
              backgroundColor: 'background.paper',
              width: ['100%'],
              maxWidth: ['100%', '100%', 800],
              position: 'relative',
              flexShrink: 1,
              height: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                pt: 4,
                backgroundColor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'dividerDark',
              }}
            >
              <DesktopMenu
                mode={editMode}
                tool={tool}
                isValid={errorCount === 0}
                actions={buttonActions}
              />
            </Box>
            <Modal open={showModal !== null} onClose={() => setShowModal(null)}>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'background.default',
                  border: '2px solid #000',
                  borderColor: 'secondary.light',
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 4,
                  ml: 1,
                }}
              >
                {showModal === 'Load Tool' && (
                  <LoadTool
                    setShowModal={setShowModal}
                    tool={tool}
                    displayName={loadDisplayName}
                  />
                )}
                {modalComponents[showModal] &&
                  React.createElement(modalComponents[showModal], {
                    ...modalComponentsProps[showModal],
                    setShowModal,
                  })}
              </Box>
            </Modal>
            {editMode
              ? React.createElement(editComponent, {
                  ...editComponentProps,
                  setShowModal,
                })
              : React.createElement(previewComponent, {
                  ...previewComponentProps,
                  setShowModal,
                })}
          </Box>
        </Box>
      </ToolContext.Provider>
    );
  }
};

export default CreateShell;

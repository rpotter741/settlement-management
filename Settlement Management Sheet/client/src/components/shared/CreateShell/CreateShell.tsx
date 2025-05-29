import React, { useEffect, useState, lazy } from 'react';
import { useSnackbar } from 'context/SnackbarContext.jsx';
import { Box, Typography, Modal } from '@mui/material';
import ValidationChecklist from 'components/shared/ValidationChecklist/ValidationChecklist.jsx';
import DesktopMenu from 'components/shared/ToolMenu/DesktopMenu.jsx';
import MobileMenu from 'components/shared/ToolMenu/MobileMenu.jsx';
import LoadTool from 'components/shared/LoadTool/LoadTool.jsx';
import useServer from 'services/useServer.js';
import prefetchToolContent from 'services/prefetchTools.js';
import { useTools } from 'hooks/useTool.tsx';
import { useInitializeTool } from 'hooks/useInitializeTool.tsx';
import { initializeTool as initialize } from '../../../app/toolSlice.js';
import { ToolContext } from 'context/ToolContext.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { updateTab } from 'features/sidePanel/sidePanelSlice.js';
import { useDebounce } from 'hooks/useDebounce.jsx';
import useDebouncedEffect from 'hooks/useDebouncedEffect.jsx';

const CreateShell = ({
  tool,
  id,
  toolName = tool,
  initializeTool,
  validationFields,
  editComponent,
  previewComponent,
  checklistContent,
  loadDisplayName,
  editComponentProps = {},
  previewComponentProps = {},
  mode,
  side,
  width,
  tabId,
  page = true,
  setModalContent,
}) => {
  const { current, edit, allIds, saveToolEdit, errors } = useTools(tool, id);

  const TestComp = () => {
    return (
      <Box>
        <Typography variant="h6">Test Component</Typography>
      </Box>
    );
  };

  const { errorCount } = useInitializeTool({
    tool,
    id,
    allIds,
    current,
    errorData: errors,
    initializeFn: initializeTool,
    validationFields,
  });
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const [editMode, setEditMode] = useState(mode === 'edit');
  const [showModal, setShowModal] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const debouncedEdit = useDebounce(edit, 1000);

  useDebouncedEffect(
    () => {
      if (!edit) return;
      const name = edit?.name.trim() || `Untitled`;
      if (edit.name !== current.name) {
        dispatch(
          updateTab({
            tabId: tabId,
            side,
            keypath: 'name',
            updates: name,
          })
        );
      }
    },
    300,
    [debouncedEdit?.name, dispatch, tabId, side]
  );

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
    load: () =>
      setModalContent({
        component: LoadTool,
        props: {
          tool,
          displayName: loadDisplayName,
          setShowModal: setModalContent,
        },
      }),
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
            overflowY: 'scroll',
            overflowX: 'hidden',
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
              px: page ? 4 : 0,
              mb: page ? 7 : 0,
              boxShadow: page ? 4 : 0,
              borderRadius: page ? 4 : 0,
              backgroundColor: page ? 'background.paper' : 'background.default',
              width: page ? ['100%', '90%', '80%'] : '100%',
              maxWidth: page ? ['100%', '100%', 800] : '100%',
              position: 'relative',
              flexShrink: 1,
              height: '100%',
              overflowY: 'scroll',
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
                pt: page ? 4 : 0,
                backgroundColor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'dividerDark',
              }}
            >
              <DesktopMenu
                mode={editMode}
                tool={toolName}
                isValid={errorCount === 0}
                actions={buttonActions}
                toolName={toolName}
                page={page}
              />
            </Box>
            {editMode
              ? React.createElement(editComponent, {
                  ...editComponentProps,
                  setShowModal,
                  setModalContent,
                })
              : React.createElement(previewComponent, {
                  ...previewComponentProps,
                  setShowModal,
                  setModalContent,
                })}
          </Box>
        </Box>
      </ToolContext.Provider>
    );
  }
};

export default CreateShell;

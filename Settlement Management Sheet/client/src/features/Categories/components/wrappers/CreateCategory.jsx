import React, { useEffect, useState } from 'react';

// redux
import { useDispatch } from 'react-redux';
import initializeCategory from 'features/Categories/helpers/initializeCategory.js';
import { initializeTool, initializeEdit } from '../../../../app/toolSlice.js';
import { useTools } from 'hooks/useTool.jsx';

import { useSnackbar } from 'context/SnackbarContext.jsx';
import { selectKey, selectTool } from 'features/selection/selectionSlice.js';

// validation
import {
  initializeValidation,
  getErrorCount,
  validateTool,
} from 'features/validation/validationSlice.js';

// mui components
import { Box, Typography, Modal } from '@mui/material';

// custom components
import ValidationChecklist from 'components/shared/ValidationChecklist/ValidationChecklist.jsx';
import DesktopMenu from 'components/shared/ToolMenu/DesktopMenu.jsx';
import EditCategory from './EditCategory';
import PreviewCategory from './PreviewCategory.jsx';
import LoadCategory from './LoadCategory.jsx';

// axios imports
import useServer from 'services/useServer.js';

import prefetchTools from 'services/prefetchTools.js';

const checklistContent = [];

const CreateCategory = () => {
  const {
    current: category,
    edit,
    allIds,
    edit: editCategory,
    updateTool: updateCategory,
    saveEditTool: saveEditCategory,
    errors,
    setCurrentTool,
  } = useTools('category');
  const { showSnackbar } = useSnackbar();
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [errorCount, setErrorCount] = useState(undefined);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    console.log('Category:', category);
  }, [category]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(selectTool('category'));
  }, []);

  useEffect(() => {
    const count = getErrorCount(errors);
    setErrorCount(count);
    if (category) {
      if (count === 0 && !category.isValid) {
        updateCategory('isValid', true);
      } else if (count > 0 && category.isValid) {
        updateCategory('isValid', false);
      }
    }
  }, [errors]);

  useEffect(() => {
    if (!category) {
      const initialData = initializeCategory();
      console.log(initialData, 'initialData');
      dispatch(initializeTool({ tool: 'category', data: initialData }));
      setCurrentTool(initialData);
    }
  }, [category, dispatch]);

  useEffect(() => {
    if (!category && allIds.length > 0) {
      const lastId = allIds[allIds.length - 1];
      dispatch(selectKey({ key: 'category', value: lastId }));
    }
  }, [category, allIds, dispatch]);

  useEffect(() => {
    if (category) {
      dispatch(initializeEdit({ refId: category.refId, tool: 'category' }));
      dispatch(initializeValidation({ tool: 'category', obj: category }));
    }
  }, [category, dispatch]);

  useEffect(() => {
    if (category) {
      dispatch(
        validateTool({
          tool: 'category',
          fields: ['name', 'description'],
          refObj: category,
        })
      );
    }
  }, [category, dispatch]);

  const handleSave = async () => {
    try {
      const response = await useServer({
        tool: 'category',
        type: 'save',
        data: { ...edit },
      });
      saveEditCategory(edit.refId, true);
      setEditMode(false);
      showSnackbar(response.message, 'success');
    } catch (error) {
      showSnackbar('Error saving category', 'error');
    }
  };

  const handleLoad = () => {
    setShowModal('load');
  };

  const buttonActions = {
    edit: () => setEditMode(true),
    cancel: () => setEditMode(false),
    save: async () => handleSave(),
    load: () => handleLoad(),
    loadHover: () => prefetchTools('category'),
    publish: async () => {},
  };

  if (!category) {
    return <Box>Loading...</Box>;
  }

  if (category !== null) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'start',
          flexDirection: 'column',
          alignItems: 'center',
          width: ['100%'],
          position: 'relative',
          height: '100%',
          mb: 4,
        }}
      >
        {errorCount !== undefined && category && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
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
            mb: 2,
            overflowY: 'scroll',
            overflowX: 'show',
            boxShadow: 4,
            borderRadius: 4,
            backgroundColor: 'background.paper',
            width: ['100%'],
            maxWidth: ['100%', '100%', 800],
            position: 'relative',
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
            <Typography
              variant="h4"
              sx={{
                width: '100%',
                textAlign: 'center',
                gridColumn: 'span 3',
                color: 'primary.main',
                mt: 4,
                mb: 4,
              }}
            >
              CUSTOM CATEGORY
            </Typography>
            <DesktopMenu
              mode={editMode}
              tool="Category"
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
              {showModal === 'load' && (
                <LoadCategory setShowModal={setShowModal} />
              )}
            </Box>
          </Modal>
          <Box
            sx={{
              gridColumn: 'span 3',
              display: 'flex',
              gap: 2,
              width: '100%',
            }}
          >
            {editMode ? (
              <EditCategory setShowModal={setShowModal} />
            ) : (
              <PreviewCategory />
            )}
          </Box>
        </Box>
      </Box>
    );
  }
};

export default CreateCategory;

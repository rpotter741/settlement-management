import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useAttribute } from '../../hooks/useEditAttribute.jsx';
import {
  initializeAttribute,
  initializeEdit,
} from '../../state/attributeSlice.js';
import { useSnackbar } from 'context/SnackbarContext.jsx';
import { selectKey, selectTool } from 'features/selection/selectionSlice.js';

import {
  initializeValidation,
  getErrorCount,
  validateTool,
} from 'features/validation/validationSlice.js';

import { Box, Button, Typography, Modal } from '@mui/material';

import IconSelector from 'components/shared/IconSelector/IconSelector.jsx';
import EditAttribute from './EditAttribute.jsx';
import PreviewAttribute from './PreviewAttribute.jsx';
import checklistContent from '../../helpers/attributeChecklist.js';

import ValidationChecklist from 'components/shared/ValidationChecklist/ValidationChecklist.jsx';

const CreateAttribute = () => {
  const {
    attribute,
    allIds,
    editAttribute,
    updateAttribute,
    saveEditAttribute,
    errors,
  } = useAttribute();
  const { showSnackbar } = useSnackbar();
  const [editMode, setEditMode] = useState(false);
  const [localAttr, setLocalAttr] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [firstRender, setFirstRender] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(attribute);
  }, [attribute]);

  useEffect(() => {
    dispatch(selectTool('attribute'));
  }, [dispatch]);

  useEffect(() => {
    setErrorCount(getErrorCount(errors));
  }, [errors]);

  // if no active attr, create a new one
  useEffect(() => {
    console.log(attribute);
    if (!attribute) {
      setEditMode(true);
      dispatch(initializeAttribute());
    }
  }, [attribute, dispatch]);

  // if no active attr, select the newly created one
  useEffect(() => {
    if (!attribute && allIds.length > 0) {
      const lastId = allIds[allIds.length - 1];
      dispatch(selectKey({ key: 'attribute', value: lastId }));
    }
  }, [attribute, allIds, dispatch]);

  useEffect(() => {
    if (attribute) {
      setLocalAttr(attribute);
      dispatch(initializeEdit({ id: attribute.id }));
      dispatch(initializeValidation({ tool: 'attribute', obj: attribute }));
    }
  }, [attribute]);

  useEffect(() => {
    if (Object.keys(editAttribute).length > 0 && firstRender) {
      console.log('initial validation');
      dispatch(
        validateTool({
          tool: 'attribute',
          fields: [
            'name',
            'description',
            'balance',
            'thresholds',
            'settlementPointCost',
          ],
          refObj: editAttribute,
        })
      );
      setFirstRender(false);
    }
  }, [editAttribute]);

  const handleIconUpdate = (icon, color) => {
    updateAttribute('icon', icon);
    updateAttribute('iconColor', color);
    setShowModal(null);
  };

  const handleIconColorChange = (iconColor) => {
    updateAttribute('iconColor', iconColor);
  };

  const handleCancelLoad = () => {
    if (editMode) {
      setEditMode(false);
      dispatch(initializeValidation({ tool: 'attribute', obj: attr }));
    } else {
      console.log('Load attribute');
    }
  };

  const handleSaveEdit = () => {
    if (editMode) {
      if (errorCount > 0) {
        showSnackbar('Please correct the errors on the form.', 'error');
        setExpanded(true);
        //enable validation errors to be pulled out on button press again
        setTimeout(() => setExpanded(false), 1000);
        return;
      } else {
        console.log('teeest');
        setEditMode(false);
        saveEditAttribute(attribute);
      }
    } else {
      setEditMode(true);
    }
  };

  if (!attribute) {
    return <Box>Loading...</Box>;
  }

  if (attribute !== null) {
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
        }}
      >
        {/* form preview */}
        {editMode && attribute && (
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
            p: 4,
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
          <Button
            variant="contained"
            sx={{
              position: 'absolute',
              top: 24,
              right: 32,
              backgroundColor: editMode ? 'primary.main' : 'accent.main',
              color: editMode ? 'common.white' : 'text.primary',
            }}
            onClick={() => {
              handleCancelLoad();
            }}
          >
            {editMode ? 'Cancel Edit' : 'Load Attribute'}
          </Button>
          <Button
            variant="contained"
            sx={{
              position: 'absolute',
              top: 24,
              left: 32,
              backgroundColor: editMode ? 'success.main' : 'info.main',
            }}
            onClick={() => handleSaveEdit()}
          >
            {editMode ? 'Save Attribute' : 'Edit Attribute'}
          </Button>
          <Typography
            variant="h4"
            sx={{
              width: '100%',
              textAlign: 'center',
              gridColumn: 'span 3',
              color: 'primary.main',
              mt: 4,
              mb: 8,
            }}
          >
            CUSTOM ATTRIBUTE
          </Typography>
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
              }}
            >
              {showModal === 'Change Icon' && (
                <IconSelector
                  initialIcon={editAttribute.icon}
                  color={editAttribute.iconColor}
                  setColor={handleIconColorChange}
                  onConfirm={handleIconUpdate}
                />
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
              <EditAttribute
                attr={localAttr}
                setAttr={setLocalAttr}
                setShowModal={setShowModal}
                errors={errors}
                setErrors={() => {}}
              />
            ) : (
              <PreviewAttribute attr={localAttr} />
            )}
          </Box>
        </Box>
      </Box>
    );
  }
};

export default CreateAttribute;

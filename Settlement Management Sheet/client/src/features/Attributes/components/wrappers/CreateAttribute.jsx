import React, { useEffect, useState } from 'react';

// redux
import { useDispatch } from 'react-redux';
import { useAttribute } from '../../hooks/useEditAttribute.jsx';
import {
  initializeAttribute,
  initializeEdit,
} from '../../state/attributeSlice.js';
import { useSnackbar } from 'context/SnackbarContext.jsx';
import { selectKey, selectTool } from 'features/selection/selectionSlice.js';

// validation
import {
  initializeValidation,
  getErrorCount,
  validateTool,
} from 'features/validation/validationSlice.js';

import queryClient from 'context/QueryClient.js';
import api from 'services/interceptor.js';

// mui components
import { Box, Typography, Modal } from '@mui/material';

// custom components
import IconSelector from 'components/shared/IconSelector/IconSelector.jsx';
import EditAttribute from './EditAttribute.jsx';
import PreviewAttribute from './PreviewAttribute.jsx';
import checklistContent from '../../helpers/attributeChecklist.js';
import ValidationChecklist from 'components/shared/ValidationChecklist/ValidationChecklist.jsx';
import DesktopMenu from 'components/shared/ToolMenu/DesktopMenu.jsx';
import LoadAttribute from './LoadAttribute.jsx';
import MobileMenu from 'components/shared/ToolMenu/MobileMenu.jsx';

// axios imports
import saveAttributeAPI from '../../helpers/saveAttributeAPI.js';
import publishAttributeAPI from '../../helpers/publishAttributeAPI.js';

import useServer from 'services/useServer.js';

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
  const [showModal, setShowModal] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [errorCount, setErrorCount] = useState(undefined);
  const [firstRender, setFirstRender] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(selectTool('attribute'));
  }, []);

  useEffect(() => {
    const count = getErrorCount(errors);
    setErrorCount(count);
    if (attribute) {
      if (count === 0 && !attribute.isValid) {
        updateAttribute('isValid', true);
      } else if (count > 0 && attribute.isValid) {
        updateAttribute('isValid', false);
      }
    }
  }, [errors, attribute]);

  // if no active attr, create a new one
  useEffect(() => {
    if (!attribute) {
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
      dispatch(initializeEdit({ refId: attribute.refId }));
      dispatch(initializeValidation({ tool: 'attribute', obj: attribute }));
    }
  }, [attribute]);

  useEffect(() => {
    if (attribute) {
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
          refObj: attribute,
        })
      );
    }
  }, [attribute]);

  useEffect(() => {
    if (Object.keys(editAttribute).length > 0 && firstRender) {
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

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleLoad = () => {
    setShowModal('Load Attribute');
  };

  const handleSave = async () => {
    try {
      showSnackbar('Saving...', 'info');
      const response = await useServer({
        tool: 'attribute',
        type: 'save',
        data: { ...editAttribute },
      });
      saveEditAttribute(attribute);
      setEditMode(false);
      showSnackbar(response.message, 'success');
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const handlePublish = async () => {
    try {
      showSnackbar('Publishing...', 'info');
      const response = await publishAttributeAPI(editAttribute);
      showSnackbar(response.message, 'success');
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const prefetchAttributes = () => {
    // prefetch
    queryClient.prefetchQuery({
      queryKey: ['attributes', 'personal', ''],
      queryFn: async () => {
        const { data } = await api.get(`/attributes/personal`, {
          params: { limit: 10, offset: pageParam, search },
        });
        return data;
      },
    });
    queryClient.prefetchQuery({
      queryKey: ['attributes', 'personal', ''],
      queryFn: async () => {
        const { data } = await api.get(`/attributes/community`, {
          params: { limit: 10, offset: pageParam, search },
        });
        return data;
      },
    });
  };

  const buttonActions = {
    edit: () => setEditMode(true),
    save: () => handleSave(),
    load: () => handleLoad(),
    loadHover: () => prefetchAttributes(),
    cancel: () => handleCancel(),
    publish: () => handlePublish(),
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
          mb: 4,
        }}
      >
        {/* validation checklist baby */}
        {errorCount !== undefined && attribute && (
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
              CUSTOM ATTRIBUTE
            </Typography>
            <DesktopMenu
              mode={editMode}
              tool="Attribute"
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
              {showModal === 'Change Icon' && (
                <IconSelector
                  initialIcon={editAttribute.icon}
                  color={editAttribute.iconColor}
                  setColor={handleIconColorChange}
                  onConfirm={handleIconUpdate}
                />
              )}
              {showModal === 'Load Attribute' && (
                <LoadAttribute setShowModal={setShowModal} />
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
              <EditAttribute setShowModal={setShowModal} />
            ) : (
              <PreviewAttribute />
            )}
          </Box>
        </Box>
      </Box>
    );
  }
};

export default CreateAttribute;

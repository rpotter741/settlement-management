import React, { lazy } from 'react';
import { useTools } from 'hooks/useTools.jsx';
import { useShellContext } from '@/context/ShellContext.js';

import { attributeFields } from '../../helpers/attributeFormData.js';
import { Icon as CustomIcon } from '@/components/index.js';
import ToolInput from 'components/shared/DynamicForm/ToolInput.jsx';

import { Box, Typography, Button, Tooltip, Switch } from '@mui/material';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { useDebounce } from '@/hooks/useDebounce.js';
import useDebouncedEffect from '@/hooks/useDebouncedEffect.js';
import { updateTab } from '@/app/slice/sidePanelSlice.js';

interface AttrMetaDataProps {}

const AttrMetaData: React.FC<AttrMetaDataProps> = () => {
  const { tool, id, showModal, tabId, side } = useShellContext();
  const { edit: attr, updateTool: updateAttribute } = useTools(tool, id);

  const dispatch: AppDispatch = useDispatch();

  const { edit, current } = useTools(tool, id);

  const debouncedEdit = useDebounce(edit, 1000);

  useDebouncedEffect(
    () => {
      if (!edit) return;
      const name = edit?.name ? edit.name.trim() : `Untitled`;
      if (edit.name !== current.name) {
        dispatch(
          updateTab({
            tabId,
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

  return (
    <>
      <Box
        sx={{
          gridColumn: 'span 3',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            flexGrow: 1,
            flexShrink: 2,
          }}
        >
          <Typography variant="h6">Icon</Typography>
          <Button
            onClick={() => {
              const entry = {
                componentKey: 'IconSelector',
                props: { tool, id },
                id: 'icon-selector',
              };
              showModal({ entry });
            }}
            sx={{
              boxShadow: 4,
              borderRadius: '50%',
              height: 64,
              width: 64,
            }}
          >
            <CustomIcon
              viewBox={attr?.icon?.viewBox || '0 0 664 512'}
              path={attr?.icon?.d || ''}
              size={24}
              color={attr?.icon?.color || 'primary'}
              backgroundColor={
                attr?.icon?.backgroundColor || 'background.paper'
              }
            />
          </Button>
        </Box>
        <ToolInput
          inputConfig={attributeFields.name}
          style={{ flexGrow: 2, flexShrink: 1, px: 1 }}
        />
      </Box>
      <ToolInput
        inputConfig={attributeFields.description}
        style={{ gridColumn: 'span 3', px: 1 }}
        multiline
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pl: 2,
          gap: 16,
          gridColumn: 'span 3',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Tooltip title="Positive type is best a high scores. Negative type is best a low scores.">
            <Typography variant="h6">Attribute Type</Typography>
          </Tooltip>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1">
              {attr?.positive ? 'Positive' : 'Negative'}
            </Typography>
            <Switch
              checked={attr?.positive === true}
              onChange={(e) => {
                updateAttribute('positive', e.target.checked);
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AttrMetaData;

import React, { lazy } from 'react';
import { useTools } from 'hooks/useTools.jsx';
import { useShellContext } from '@/context/ShellContext.js';

import { attributeFields } from '../../helpers/attributeFormData.js';
import { Icon as CustomIcon } from '@/components/index.js';
import ToolInput from 'components/shared/DynamicForm/ToolInput.jsx';

import {
  Box,
  Typography,
  Button,
  Tooltip,
  Switch,
  IconButton,
  Select,
  MenuItem,
} from '@mui/material';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { useDebounce } from '@/hooks/utility/useDebounce.js';
import useDebouncedEffect from '@/hooks/utility/useDebouncedEffect.js';
import { updateTab } from '@/app/slice/sidePanelSlice.js';

interface AttrMetaDataProps {
  columns: number;
}

const AttrMetaData: React.FC<AttrMetaDataProps> = ({ columns }) => {
  const { tool, id, showModal, tabId, side, tab } = useShellContext();
  const { edit: attr, updateTool: updateAttribute } = useTools(tool, id);

  const dispatch: AppDispatch = useDispatch();

  const { edit, current } = useTools(tool, id);

  const debouncedEdit = useDebounce(edit, 1000);

  useDebouncedEffect(
    () => {
      if (!edit) return;
      const name = edit?.name ? edit.name.trim() : `Untitled`;
      if (name !== current.name) {
        dispatch(
          updateTab({
            tabId,
            side,
            keypath: 'name',
            updates: name.length > 0 ? name : `Untitled`,
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
          gridColumn: `span ${columns}`,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            flexGrow: 1,
          }}
        >
          <Typography variant="h6">Icon:</Typography>
          <CustomIcon
            viewBox={attr?.icon?.viewBox || '0 0 664 512'}
            path={attr?.icon?.d || ''}
            size={24}
            color={attr?.icon?.color || 'primary'}
            backgroundColor={attr?.icon?.backgroundColor || 'background.paper'}
            onClick={() => {
              const entry = {
                componentKey: 'IconSelector',
                props: { tool, id },
                id: 'icon-selector',
              };
              showModal({ entry });
            }}
          />
        </Box>
        <ToolInput
          inputConfig={attributeFields.name}
          style={{ flexGrow: 2, flexShrink: 1, px: 1 }}
        />
      </Box>
      <ToolInput
        inputConfig={attributeFields.description}
        style={{ gridColumn: `span ${columns}`, px: 1 }}
        multiline
      />
    </>
  );
};

export default AttrMetaData;

import React, { useEffect } from 'react';
import { useTools } from 'hooks/tools/useTools.jsx';
import { useShellContext } from '@/context/ShellContext.js';

import { attributeFields } from '../../helpers/attributeFormData.js';
import { Icon as CustomIcon } from '@/components/index.js';
import ToolInput from 'components/shared/DynamicForm/ToolInput.jsx';

import { Box, Typography } from '@mui/material';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { updateTab } from '@/app/slice/tabSlice.js';

interface AttrMetaDataProps {
  columns: number;
}

const AttrMetaData: React.FC<AttrMetaDataProps> = ({ columns }) => {
  const dispatch: AppDispatch = useDispatch();
  const { tool, id, showModal, tabId, side } = useShellContext();
  const { edit } = useTools(tool, id);

  useEffect(() => {
    if (!edit?.name) return;
    dispatch(
      updateTab({
        tabId,
        side,
        keypath: 'name',
        updates: edit?.name.trim().length > 0 ? edit?.name.trim() : `Untitled`,
      })
    );
    dispatch(
      updateTab({
        tabId,
        side,
        keypath: 'viewState.isDirty',
        updates: true,
      })
    );
  }, [edit?.name, dispatch, tabId, side]);

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
            viewBox={edit?.icon?.viewBox || '0 0 664 512'}
            path={edit?.icon?.d || ''}
            size={24}
            color={edit?.icon?.color || 'primary'}
            backgroundColor={edit?.icon?.backgroundColor || 'background.paper'}
            onClick={() => {
              const entry = {
                componentKey: 'IconSelector',
                props: { tool, id, tabId, side },
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

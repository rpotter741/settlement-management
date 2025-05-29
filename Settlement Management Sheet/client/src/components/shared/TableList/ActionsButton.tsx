import React from 'react';

import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';

const ActionsButton = React.memo((props) => {
  const { onActionClick, refId, id, options, onDelete } = props;

  return (
    <SpeedDial
      direction="left"
      FabProps={{ size: 'small' }}
      ariaLabel="SpeedDial"
      sx={{
        height: '2rem',
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: 'translateY(-50%)',
      }}
      icon={<SpeedDialIcon />}
    >
      {options.map((option) => (
        <SpeedDialAction
          sx={{ zIndex: 1000, mx: 1 }}
          key={option.name}
          icon={option.icon}
          tooltipTitle={option.name}
          onClick={async (e) => {
            e.stopPropagation();
            if (option.name === 'delete') {
              try {
                await onActionClick(e, option.name, {
                  refId,
                  id,
                }); // do the actual delete
                onDelete(e, refId); // only remove from local state after success
              } catch (error) {
                console.error('Failed to delete:', error);
              }
            } else {
              onActionClick(e, option.name, { refId, id });
            }
          }}
        />
      ))}
    </SpeedDial>
  );
});

export default ActionsButton;

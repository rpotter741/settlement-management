import React from 'react';

import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';

const ActionsButton = (props) => {
  const { onActionClick, refId, id, options } = props;

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
          sx={{ zIndex: 1000 }}
          key={option.name}
          icon={option.icon}
          tooltipTitle={option.name}
          onClick={(e) => {
            onActionClick(e, option.name, { refId, id });
          }}
        />
      ))}
    </SpeedDial>
  );
};

export default ActionsButton;

import React, { useState } from 'react';
import { Button, Collapse } from '@mui/material';

const CardCollapse = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        sx={{
          width: '100%',
          justifyContent: 'flex-start',
          typography: 'h6',
          backgroundColor: '#f5f0e6',
        }}
      >
        {title}
      </Button>

      <Collapse in={open}>
        <div>{children}</div>
      </Collapse>
    </>
  );
};

export default CardCollapse;

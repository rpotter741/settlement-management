import React, { useState, useCallback } from 'react';
import { useTools } from 'hooks/useTool.jsx';
import { useSnackbar } from 'context/SnackbarContext.jsx';

import { Box, Typography, Button } from '@mui/material';
import TitledCollapse from 'components/shared/TitledCollapse/TitledCollapse.jsx';
import Dependency from 'components/shared/Metadata/Dependency.jsx';

const EditDependency = ({ tool, id }) => {
  const { selectValue, updateTool, validateToolField } = useTools(tool, id);
  const data = selectValue('dependencies.data');
  const order = selectValue('dependencies.order');
  const { showSnackbar } = useSnackbar();
  const [open, setOpen] = useState(new Array(order.length).fill(false));

  React.useEffect(() => {
    console.log('order', order);
  }, [order]);

  const handleModifierChange = useCallback(
    (updates, { id, index }) => {
      updateTool(
        `dependencies.data.${id}.thresholds.${index}.modifier`,
        updates
      );
      validateToolField(`dependencies.data.${id}.modifier`, updates);
    },
    [updateTool, validateToolField]
  );

  const handleRemove = useCallback((id) => {
    const newOrder = order.filter((item) => item !== id);
    const newData = { ...data };
    delete newData[id];

    updateTool('dependencies.data', newData);
    updateTool('dependencies.order', newOrder);
  });

  return (
    <Box>
      {order.map(
        (id, index) =>
          data[id] && (
            <TitledCollapse
              defaultState={open[index]}
              key={id}
              title={data[id].name}
              noDefaultHandler={() => {
                const newOpen = [...open];
                newOpen[index] = !newOpen[index];
                setOpen(newOpen);
              }}
            >
              {data[id].thresholds.map((thresh, n) => (
                <Dependency
                  threshold={thresh}
                  key={thresh.name}
                  index={n}
                  id={id}
                  handleModifierChange={handleModifierChange}
                />
              ))}
              <Button variant="contained" onClick={() => handleRemove(id)}>
                Remove {data[id].name} Dependency
              </Button>
            </TitledCollapse>
          )
      )}
    </Box>
  );
};

export default EditDependency;

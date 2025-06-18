import React, { useState, useCallback, useContext } from 'react';
import { useTools } from 'hooks/useTools.jsx';

import { Box, Button } from '@mui/material';
import TitledCollapse from 'components/shared/TitledCollapse/TitledCollapse.jsx';
import Dependency, {
  DependencyThreshold,
} from 'components/shared/Metadata/Dependency.jsx';
import { useShellContext } from '@/context/ShellContext.js';

const EditDependency = () => {
  const { tool, id } = useShellContext();
  const { selectEditValue, updateTool, validateToolField } = useTools(tool, id);
  const data = selectEditValue('dependencies.data');
  const order = selectEditValue('dependencies.order');
  const [open, setOpen] = useState(new Array(order.length).fill(false));

  const handleRemove = useCallback(
    (id: string) => {
      const newOrder = order.filter((item: any) => item !== id);
      const newData = { ...data };
      delete newData[id];

      updateTool('dependencies.data', newData);
      updateTool('dependencies.order', newOrder);
    },
    [order, data, updateTool]
  );

  return (
    <Box>
      {order.map(
        (id: string, index: number) =>
          data[id] && (
            <TitledCollapse
              open={open[index]}
              key={id}
              title={data[id].name}
              toggleOpen={() => {
                const newOpen = [...open];
                newOpen[index] = !newOpen[index];
                setOpen(newOpen);
              }}
            >
              {data[id].thresholds.map(
                (thresh: DependencyThreshold, n: number) => (
                  <Dependency
                    threshold={thresh}
                    keypath={`dependencies.data.${id}.thresholds.${n}.modifier`}
                  />
                )
              )}
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

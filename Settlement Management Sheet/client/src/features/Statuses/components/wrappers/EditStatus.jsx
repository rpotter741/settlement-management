import React, { useEffect, useState } from 'react';
import { useTools } from 'hooks/useTool.jsx';
import { useToolContext } from 'context/ToolContext.jsx';

import { Box, Divider, Button, Typography } from '@mui/material';
import { TitledCollapse } from '../../../../components/index.js';
import statusFormData from '../../helpers/statusFormData.js';

import EditNameDescription from 'components/shared/Metadata/EditNameDescription.jsx';
import StatusSettings from '../forms/StatusSettings.jsx';
import ImpactSelect from 'components/shared/Impacts/ImpactSelect.jsx';

const EditStatus = ({}) => {
  const { tool, id } = useToolContext();
  const { edit: status, updateTool } = useTools(tool, id);
  const [advanced, setAdvanced] = useState(false);
  const [steps, setSteps] = useState([false, false, false, false, false]);

  const addImpact = (currentImpacts, stepIndex) => {
    const impacts = [...currentImpacts];
    impacts.push({
      system: '',
      key: '',
      target: '',
      value: 'add',
    });
    updateTool(`steps.${stepIndex}.impacts`, impacts);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: ['1fr', '1fr 1fr', 'repeat(3, 1fr)'],
        gridTemplateRows: 'auto',
        alignItems: 'start',
        justifyContent: 'center',
        my: 2,
        gap: 2,
        backgroundColor: 'background.paper',
        width: '100%',
        position: 'relative',
        pb: 2,
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 200px)',
      }}
    >
      <EditNameDescription tool={tool} fields={statusFormData} id={id} />
      <Divider sx={{ gridColumn: 'span 3' }} />
      <StatusSettings />
      {status?.mode === 'Advanced' ? (
        <Typography sx={{ gridColumn: 'span 3' }}>
          Advanced Creation Mode enables you to assign varying impacts to each
          step, allowing significantly more customization to the status that
          doesn't follow a linear progression, as well as giving you access to
          advanced customization logic.
        </Typography>
      ) : (
        <Typography sx={{ gridColumn: 'span 3' }}>
          Simple Creation Mode streamlines the status creation process by
          automatically scaling the Step 1 impacts to the rest of the steps.
          Simply put, a Step 1 Impact of Food (Current) - 1 will automatically
          result in a Step 2 Impact of Food (Current) - 2.{' '}
        </Typography>
      )}
      {status?.mode === 'Advanced' && (
        <Box
          sx={{
            gridColumn: 'span 3',
            display: 'flex',
            gap: 2,
            flexDirection: 'column',
          }}
        >
          {status.steps.map((entry, index) => (
            <TitledCollapse
              key={index}
              title={`Step ${index + 1}`}
              titleType="h6"
              defaultState={steps[index]}
              noDefaultHandler={() => {
                const newSteps = [...steps];
                newSteps[index] = !newSteps[index];
                setSteps(newSteps);
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
                className="status-impacts"
              >
                {entry.impacts.map((impact, i) => (
                  <ImpactSelect
                    key={i}
                    index={i}
                    keypath={`steps.${index}.impacts.${i}`}
                    isAdvanced={status.mode === 'Advanced'}
                  />
                ))}
              </Box>
              <Button
                onClick={() => {
                  addImpact(entry.impacts, index);
                }}
              >
                Add Impact
              </Button>
            </TitledCollapse>
          ))}
        </Box>
      )}
      {status?.mode === 'Simple' && (
        <Box
          sx={{
            gridColumn: 'span 3',
            display: 'flex',
            gap: 2,
            flexDirection: 'column',
          }}
        >
          {status.steps[0].impacts.map((impact, i) => (
            <ImpactSelect keypath={`steps.0.impacts.${i}`} />
          ))}
          <Button
            onClick={() => {
              addImpact(entry.impacts, 0);
            }}
          >
            Add Impact
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EditStatus;

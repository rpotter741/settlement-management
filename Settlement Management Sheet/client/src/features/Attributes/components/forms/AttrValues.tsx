import React, { useContext, useState } from 'react';
import { useTools } from 'hooks/useTools.jsx';
import autobalanceSteps from '../../helpers/attributeAutoBalance.js';
import { attributeFields } from '../../helpers/attributeFormData.js';

import {
  Box,
  Typography,
  Tooltip,
  FormControl,
  Switch,
  FormLabel,
} from '@mui/material';
import { ShellContext } from '@/context/ShellContext.js';
import ToolInput from '@/components/shared/DynamicForm/ToolInput.js';
import { Info as InfoIcon } from '@mui/icons-material';

interface AttrValuesProps {
  columns: number;
}

const AttrValues: React.FC<AttrValuesProps> = ({ columns }) => {
  const { tool, id } = useContext(ShellContext);
  const { selectEditValue } = useTools(tool, id);

  const [autobalance, setAutobalance] = useState(false);

  // const handleAutobalanceChange = ({ field, value, values, setValues }) => {
  //   if (field === 'costPerLevel' || 'maxPerLevel') {
  //     const stepMap = autobalanceSteps[field];
  //     if (!stepMap) {
  //       return;
  //     }
  //     const closestStep = Object.keys(stepMap).reduce((closest, current) => {
  //       return Math.abs(current - value) < Math.abs(closest - value)
  //         ? current
  //         : closest;
  //     }, Object.keys(stepMap)[0]);

  //     if (field === 'costPerLevel') {
  //       setValues({
  //         ...values,
  //         costPerLevel: value, // User input
  //         ...stepMap[closestStep], // Adjust related fields
  //       });
  //     }
  //     if (field === 'maxPerLevel') {
  //       setValues({
  //         ...values,
  //         maxPerLevel: value,
  //         ...stepMap[closestStep],
  //       });
  //     }
  //   }
  // };

  return (
    <Box>
      <FormControl
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
          gridColumn: 'span 3',
        }}
      >
        <FormLabel sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography>Autobalance</Typography>
          <Tooltip title="Automatically adjust related values to maintain a balanced configuration.">
            <InfoIcon
              sx={{
                fontSize: 18,
                color: 'text.secondary',
                cursor: 'pointer',
              }}
            />
          </Tooltip>
        </FormLabel>
        <Switch
          checked={autobalance}
          onChange={(e) => setAutobalance(e.target.checked)}
        />
      </FormControl>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr', '1fr', `repeat(${columns}, 1fr)`],
          gridTemplateRows: 'auto',
          alignItems: 'start',
          justifyContent: 'center',
          my: 2,
          gap: 2,
          backgroundColor: 'background.paper',
          width: '100%',
          position: 'relative',
          gridColumn: 'span 3',
        }}
      >
        <ToolInput inputConfig={attributeFields.maxPerLevel} />
        <ToolInput inputConfig={attributeFields.healthPerLevel} />
        <ToolInput inputConfig={attributeFields.costPerLevel} />
      </Box>
    </Box>
  );
};

export default AttrValues;

import { React, useEffect, useState } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTools } from 'hooks/useTool.tsx';
import { useToolContext } from 'context/ToolContext.jsx';

const PhaseTypeSelect = ({ phaseId }) => {
  const { id } = useToolContext();
  const { edit, updateTool } = useTools('event', id);
  const phase = edit?.phases.data[phaseId];
  const [eventType, setEventType] = useState(edit?.type || 'default');

  useEffect(() => {
    if (phase) {
      setEventType(phase.type);
    }
  }, [edit]);

  const handleChange = (event) => {
    setEventType(event.target.value);
    updateTool(`phases.data.${phaseId}.type`, event.target.value);
  };

  const phaseOptions = [
    {
      label: 'Immediate',
      tooltip:
        'Immediate phases apply their impacts immediately without mitigation.',
    },
    {
      label: 'Active',
      tooltip:
        'Active phases apply their impacts until all productivity requirements are met.',
    },
    {
      label: 'Passive',
      tooltip: 'Passive phases apply their impacts for the duration listed.',
    },
    {
      label: 'Indefinite',
      tooltip:
        'Indefinite phases apply their impacts until resolved in-game via actual TTRPG play.',
    },
  ];

  return (
    <FormControl fullWidth sx={{ width: '100%' }} variant="outlined">
      <InputLabel id="phase-type-select-label">Phase Type</InputLabel>
      <Select
        labelId="phase-type-select-label"
        id="phase-type-select"
        value={eventType}
        label="Phase Type"
        onChange={handleChange}
        sx={{ width: '100%' }}
      >
        {phaseOptions.map((option) => (
          <MenuItem key={option.label} value={option.label}>
            <Tooltip
              title={<Typography>{option.tooltip}</Typography>}
              arrow
              placement="left"
            >
              <Typography>{option.label}</Typography>
            </Tooltip>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PhaseTypeSelect;

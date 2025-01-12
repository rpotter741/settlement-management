import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Slider,
  Tooltip,
} from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';

import ValidatedInput from '../../utils/ValidatedTextArea/ValidatedInput';
import TitledCollapse from '../../utils/TitledCollapse/TitledCollapse';
import NewImpactTable from '../../Events/Create/components/NewImpactTable';

import {
  emptyWeather,
  emptyEffect,
  emptyEvent,
} from '../../../helpers/weather/emptyWeatherObject.js';

import { useDynamicSidebar } from '../../../context/SidebarContext';
import weatherSidebar from '../../../helpers/weather/weatherSidebar.js';

const CreateWeather = ({ weather, setWeather }) => {
  const { updateHandlers, updateContent } = useDynamicSidebar();

  const [severity, setSeverity] = useState(1.0);
  const handleImpactUpdate = (impacts, step) => {
    console.log(step, weather);
    setWeather({
      ...weather,
      effects: {
        ...weather.effects, // Copy the existing effects
        [step]: impacts, // Update the specific step
      },
    });
  };

  const handleAddImpact = (step) => {
    const newImpacts = [...(weather.effects[step] || []), { ...emptyEffect }];
    setWeather({
      ...weather,
      effects: {
        ...weather.effects,
        [step]: newImpacts,
      },
    });
  };

  useEffect(() => {
    updateContent(weatherSidebar);
    updateHandlers([handleAddImpact]);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        gap: 2,
        p: 2,
        width: '100%',
        backgroundColor: 'background.default',
        borderRadius: 4,
        boxShadow: 4,
      }}
    >
      <Typography variant="h4">Create Weather Object</Typography>
      <ValidatedInput
        label="Name"
        value={weather.name}
        onChange={(name) => setWeather({ ...weather, name })}
        type="text"
        required
        validated={weather.name?.length > 3}
        validation={(name) => name?.length > 3}
        errorText="Name must be at least 3 characters long"
      />
      Some Biome tags!
      {/* Biomes tags, baby! */}
      <ValidatedInput
        label="Max Steps"
        value={weather.maxSteps}
        onChange={(maxSteps) => setWeather({ ...weather, maxSteps })}
        type="number"
        required
        validated={weather.maxSteps > 0 && weather.maxSteps <= 5}
        validation={(maxSteps) => maxSteps > 0 && maxSteps <= 5}
        errorText="Max steps must be between 1 and 5"
      />
      <Typography variant="body2" span>
        <strong>Impact Type: </strong>
        {weather.method}
      </Typography>
      <Switch
        checked={weather.method === 'Complex'}
        onChange={(e) =>
          setWeather({
            ...weather,
            method: e.target.checked ? 'Complex' : 'Simple',
          })
        }
      />
      {weather.method === 'Simple' ? (
        <Box>
          <Typography variant="h6">Effect Per Step</Typography>
          <NewImpactTable
            impacts={weather.effects['1']}
            setImpacts={handleImpactUpdate}
            position={1}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Tooltip
              sx={{ color: 'secondary.main' }}
              title="Severity scales impacts. Trivial reduces by 50%, Catastrophic increases by 50%."
            >
              <InfoIcon />
            </Tooltip>
            <Typography variant="h6" span>
              <strong>Severity:</strong>
              {severity}
            </Typography>
          </Box>

          <Slider
            value={severity}
            min={0.5}
            max={1.5}
            step={0.01}
            marks={[
              { value: 0.5, label: 'Trivial' },
              { value: 0.75, label: 'Minor' },
              { value: 1.0, label: 'Moderate' },
              { value: 1.25, label: 'Major' },
              { value: 1.5, label: 'Catastrophic' },
            ]}
            onChange={(e, newValue) => setSeverity(newValue)}
          />
          <Button onClick={() => handleAddImpact('1')} variant="contained">
            <Typography variant="h6">Add Impact</Typography>
          </Button>
        </Box>
      ) : (
        <Box>I'm complex!</Box>
      )}
    </Box>
  );
};

export default CreateWeather;

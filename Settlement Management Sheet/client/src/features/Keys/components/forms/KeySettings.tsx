import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Select, MenuItem } from '@mui/material';
import { useShellContext } from '@/context/ShellContext.js';
import { useTools } from 'hooks/tools/useTools.jsx';
import { useSidePanel } from 'hooks/global/useSidePanel.jsx';

import { KeyTool, EventSeverity, KeySettings } from '../../../../../../types';

const KeySettingsComp = ({ selectedKey }: { selectedKey: KeyTool }) => {
  const { tool, id } = useShellContext();
  const { options } = useSidePanel();
  const { edit } = useTools(tool, id);
  const [selectedSettings, setSelectedSettings] = useState<KeySettings>({
    name: 'Default',
    delay: 1,
    duration: 7,
    baseSeverity: 'Random',
    minSeverity: 'Trivial',
    maxSeverity: 'Major',
    type: 'Constant',
  });

  const severityLevels: EventSeverity[] = [
    'Trivial',
    'Minor',
    'Notable',
    'Significant',
    'Major',
  ];

  const handleSettingsChange = (e: any, field: string) => {
    const value = e.target.value;
    setSelectedSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 0 }}>
        Key Settings
      </Typography>
      <Box
        sx={{ display: 'flex', justifyContent: 'end', width: '100%', mt: 2 }}
      >
        <Select
          onChange={(e: any) => setSelectedSettings(e.target.value)}
          value={selectedSettings.name}
          sx={{ width: '55%' }}
        >
          <MenuItem value={'Default'}>Default</MenuItem>
          {selectedKey?.keySettings &&
            selectedKey.keySettings.map((setting) => (
              <MenuItem key={setting.id} value={setting.id}>
                {setting.name}
              </MenuItem>
            ))}
          <MenuItem value={'New'}>Create New Settings+</MenuItem>
        </Select>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mt: 2,
        }}
      >
        <Typography sx={{ width: '25%', textAlign: 'start' }} variant="body1">
          Delay (in turns):
        </Typography>
        <TextField
          sx={{ width: '55%' }}
          type="number"
          value={selectedSettings.delay}
          onChange={(e) => handleSettingsChange(e, 'delay')}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mt: 2,
        }}
      >
        <Typography sx={{ width: '25%', textAlign: 'start' }} variant="body1">
          Duration (in turns):
        </Typography>
        <TextField
          sx={{ width: '55%' }}
          type="number"
          value={selectedSettings.duration}
          onChange={(e) => handleSettingsChange(e, 'duration')}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mt: 2,
        }}
      >
        <Typography sx={{ width: '25%', textAlign: 'start' }} variant="body1">
          Severity Change Over Time:
        </Typography>
        <Select
          sx={{ width: '55%' }}
          value={selectedSettings?.type}
          onChange={(e) => handleSettingsChange(e, 'type')}
        >
          <MenuItem value={'Constant'}>Constant</MenuItem>
          <MenuItem value={'Increasing'}>Increasing</MenuItem>
          <MenuItem value={'Decreasing'}>Decreasing</MenuItem>
        </Select>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mt: 2,
        }}
      >
        <Typography sx={{ width: '25%', textAlign: 'start' }} variant="body1">
          Baseline Severity:
        </Typography>
        <Select
          sx={{ width: '55%' }}
          value={selectedSettings?.baseSeverity}
          onChange={(e) => handleSettingsChange(e, 'baseSeverity')}
        >
          <MenuItem value={'Random'}>Random</MenuItem>
          {severityLevels.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </Select>
      </Box>
      {selectedSettings?.type !== 'Constant' && (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              mt: 2,
            }}
          >
            <Typography
              sx={{ width: '25%', textAlign: 'start' }}
              variant="body1"
            >
              Minimum Severity:
            </Typography>
            <Select
              sx={{ width: '55%' }}
              value={selectedSettings?.minSeverity}
              onChange={(e) => handleSettingsChange(e, 'minSeverity')}
            >
              <MenuItem value={'Random'}>Random</MenuItem>
              {severityLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              mt: 2,
            }}
          >
            <Typography
              sx={{ width: '25%', textAlign: 'start' }}
              variant="body1"
            >
              Maximum Severity:
            </Typography>
            <Select
              sx={{ width: '55%' }}
              value={selectedSettings?.maxSeverity}
              onChange={(e) => handleSettingsChange(e, 'maxSeverity')}
            >
              <MenuItem value={'Random'}>Random</MenuItem>
              {severityLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </>
      )}
    </Box>
  );
};

export default KeySettingsComp;

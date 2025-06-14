import React, { useEffect, useState } from 'react';
import {
  Box,
  Divider,
  Autocomplete,
  TextField,
  IconButton,
  Typography,
  Chip,
  Collapse,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSidePanel } from 'hooks/useSidePanel.jsx';
import { useTools } from 'hooks/useTools.jsx';
import { useShellContext } from '@/context/ShellContext.js';
import { get } from 'lodash';

import { returnTool } from '@/app/thunks/toolThunks.js';

import sortByKey from 'utility/sortByKey.js';

import impactMap from './impactMap.js';
import kOptions from './keyOptions.js';

const ImpactSelect = ({
  disabled = false,
  index,
  keypath,
  onRemove = () => {},
  isAdvanced = false,
}) => {
  const { tool, id } = useShellContext();
  const { edit, updateTool } = useTools(tool, id);
  const [step, setStep] = useState(0);
  const { getOptions, options } = useSidePanel();
  const [systemOptions, setSystemOptions] = useState(impactMap.system);
  const [keyOptions, setKeyOptions] = useState([]);
  const [targetOptions, setTargetOptions] = useState([]);
  const [valueOptions, setValueOptions] = useState([]);
  const [helperText, setHelperText] = useState('');
  const [advanced, setAdvanced] = useState(false);
  const impact = get(edit, keypath);

  useEffect(() => {
    if (impact.system?.name !== (null || undefined)) {
      setTargetOptions(
        sortByKey(get(options, impact.system.value, []), 'name')
      );
      const koptions = sortByKey(kOptions[impact.system.value], 'name');
      setKeyOptions(koptions);
    }
  }, [options, impact.system]);

  useEffect(() => {
    updateTool(`${keypath}.target`, null);
  }, [impact.system]);

  useEffect(() => {
    updateTool(`${keypath}.key`, null);
  }, [impact.target]);

  useEffect(() => {
    updateTool(`${keypath}.value`, null);
  }, [impact.key]);

  useEffect(() => {
    const fetchData = async () => {
      const system = impact.system;
      const target = impact.target;

      if (system && target) {
        switch (system.value) {
          case 'attribute':
            try {
              const attr = await returnTool({
                tool: 'attribute',
                id: target.id?.[0],
                refId: target.refId?.[0],
              });
              if (attr) {
                setHelperText(
                  `${attr.name} max per level is ${attr.balance.maxPerLevel}`
                );
              }
            } catch (err) {
              console.error('Failed to fetch attribute:', err);
            }
            break;
          // Add more cases as needed
        }
      }
    };

    fetchData();
  }, [impact.system, impact.target]);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'space-around',
        my: 1,
        borderRadius: 2,
        backgroundColor: 'background.default',
        p: 1,
        boxShadow: 2,
        borderColor: 'accent.light',
        boxSizing: 'border-box',
        flexWrap: 'wrap',
        pb: isAdvanced ? 0 : 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: '100%',
          height: 48,
          mb: 1,
        }}
      >
        <Typography>{helperText}</Typography>
        <IconButton
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            color: 'warning.main',
          }}
          onClick={onRemove}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
          width: '50%',
        }}
      >
        <Autocomplete
          value={impact.system || { name: '-Select-', value: '' }}
          label={'System'}
          onChange={(e, newValue) => {
            updateTool(`${keypath}.system`, newValue);
          }}
          disabled={disabled}
          options={systemOptions}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="System"
              variant="outlined"
              size="small"
            />
          )}
          sx={{ width: '100%' }}
        />
        <Autocomplete
          value={impact.target || { name: '-Select-', value: '' }}
          onChange={(e, newValue) => {
            updateTool(`${keypath}.target`, newValue);
            setStep(step + 1);
          }}
          disabled={impact.system === null}
          options={targetOptions}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Target"
              variant="outlined"
              size="small"
            />
          )}
          sx={{ width: '100%' }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
          width: '50%',
        }}
      >
        <Autocomplete
          value={impact.key || { name: '-Select-', value: '' }}
          onChange={(e, newValue) => {
            updateTool(`${keypath}.key`, newValue);
          }}
          disabled={impact.target === null}
          options={keyOptions}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Key"
              variant="outlined"
              size="small"
            />
          )}
          sx={{ width: '100%' }}
        />

        <TextField
          value={impact.value || 0}
          onChange={(e) => {
            updateTool(`${keypath}.value`, Number(e.target.value));
          }}
          disabled={impact.key === null}
          label="Value"
          variant="outlined"
          size="small"
          sx={{ width: '100%' }}
          type="number"
        />
      </Box>
      {isAdvanced && (
        <>
          <Divider flexItem sx={{ width: '100%' }}>
            <Chip
              label="Advanced"
              onClick={() => {
                setAdvanced(!advanced);
              }}
              sx={{ my: 2, cursor: 'pointer' }}
            />
          </Divider>
          <Collapse in={advanced} timeout="auto" unmountOnExit>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                width: '100%',
                my: 2,
              }}
            ></Box>
          </Collapse>
        </>
      )}
    </Box>
  );
};

export default ImpactSelect;

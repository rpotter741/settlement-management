import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Autocomplete,
  TextField,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RightArrowIcon from '@mui/icons-material/ArrowRight';
import LeftArrowIcon from '@mui/icons-material/ArrowLeft';
import { useSidePanel } from 'hooks/global/useSidePanel.jsx';
import { useTools } from 'hooks/tools/useTools.jsx';
import { useShellContext } from '@/context/ShellContext.js';
import { get } from 'lodash';

import { returnTool } from 'app/toolThunks.js';

import sortByKey from 'utility/sortByKey.js';

import impactMap from './impactMap.js';
import tOptions from 'features/Statuses/helpers/targetOptions.js';

const ImpactCard = ({ keypath }) => {
  const [step, setStep] = useState(0);
  const { tool, id } = useShellContext();
  const { edit, updateTool } = useTools(tool, id);
  const { getOptions, options } = useSidePanel();
  const [systemOptions, setSystemOptions] = useState(impactMap.system);
  const [keyOptions, setKeyOptions] = useState([]);
  const [targetOptions, setTargetOptions] = useState([]);
  const [valueOptions, setValueOptions] = useState([]);
  const impact = get(edit, keypath);

  return (
    <Box>
      <SystemTarget impact={impact} keypath={keypath} step={step} />
    </Box>
  );
};

const SystemTarget = ({ impact, index, keypath, step }) => {
  if (step === 0) {
    return (
      <Autocomplete
        value={impact.system || { label: '-Select-', value: '' }}
        label={'System'}
        onChange={(e, newValue) => {
          updateTool(`${keypath}.system`, newValue);
        }}
        options={systemOptions}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <TextField
            {...params}
            label="System"
            variant="outlined"
            size="small"
          />
        )}
        sx={{ width: '23%' }}
      />
    );
  }
};

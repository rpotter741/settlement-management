import React, { useContext, useState } from 'react';
import { useTools } from 'hooks/tools/useTools.jsx';
import autobalanceSteps from '../../helpers/attributeAutoBalance.js';
import { attributeFields } from '../../helpers/attributeFormData.js';

import {
  Box,
  Typography,
  Tooltip,
  FormControl,
  Switch,
  FormLabel,
  Slider,
} from '@mui/material';
import { ShellContext } from '@/context/ShellContext.js';
import ToolInput from '@/components/shared/DynamicForm/ToolInput.js';
import { Info as InfoIcon } from '@mui/icons-material';
import { Attribute } from 'types/index.js';
import ToolSwitch from '@/components/shared/DynamicForm/ToolSwitch.js';
import CollapseOnRemoval from '@/components/shared/Layout/Motion/CollapseOnRemoval.js';
import { borderRadius, boxSizing } from '@mui/system';
import themeOptions from '@/themes/themeOptions.js';
import { get } from 'lodash';
import ValueToggleHell from '../wrappers/ValueToggleHell.js';

interface AttrValuesProps {
  columns: number;
}

const AttrValues: React.FC<AttrValuesProps> = ({ columns }) => {
  const { tool, id } = useContext(ShellContext);
  const { selectEditValue, edit } = useTools(tool, id);

  const [autobalance, setAutobalance] = useState(false);
  const [slide, setSlide] = useState(5);

  const getValueTooltip = (property: string) => {
    const source = edit.balance[property];
    const { base, perLevel, valuePerLevel, interval, scaleToggle } = source;

    if (scaleToggle) {
      return `Floor(${slide} / ${interval}) * ${valuePerLevel} + ${base})`;
    } else if (perLevel) {
      return `Floor(${slide} / ${interval}) * ${base})`;
    } else {
      return `${base}`;
    }
  };

  const getValueByLevel = (property: string) => {
    const source = edit.balance[property];
    const {
      base,
      perLevel,
      valuePerLevel,
      interval,
      scaleToggle,
      scaleCurve,
      valuesPerInterval,
    } = source;

    if (base === undefined) return '0';

    switch (scaleToggle) {
      case true: {
        const steps = slide / interval;
        switch (scaleCurve) {
          case 'linear':
            return (Math.floor(steps) * valuePerLevel + base).toFixed(0);
          case 'slow-exponential':
            return (Math.pow(steps, 1.5) * valuePerLevel + base).toFixed(0);
          case 'fast-exponential':
            return (Math.pow(steps, 2) * valuePerLevel + base).toFixed(0);
          case 'custom': {
            if (!valuesPerInterval?.length) return base.toFixed(0);
            const index = Math.floor(steps);
            if (index < 0 || index - 1 >= valuesPerInterval.length)
              return base.toFixed(0);
            const values = valuesPerInterval.slice(0, index);
            const sum = values.reduce(
              (acc: number, val: any) => acc + val.value,
              0
            );
            return (sum + base).toFixed(0);
          }
          default:
            return base.toFixed(0);
        }
      }
      case false:
        return perLevel
          ? (Math.max(1, Math.floor(slide / interval)) * base).toFixed(0)
          : base.toFixed(0);
      default:
        return base.toFixed(0);
    }
  };

  if (!edit) return null;

  return (
    <Box
      id={`attr-values-${id}`}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <FormControl
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
          height: '100%',
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
          gridTemplateColumns: '5fr 1fr',
          gridTemplateRows: 'auto',
          alignItems: 'center',
          justifyContent: 'start',
          my: 2,
          width: '100%',
          position: 'relative',
          gridColumn: 'span 3',
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            gridColumn: 'span 2',
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              boxSizing: 'border-box',
              px: 4,
            }}
          >
            <Slider
              valueLabelDisplay="auto"
              color="secondary"
              defaultValue={slide}
              value={slide}
              onChange={(e, value) => {
                setSlide(value as number);
              }}
              min={1}
              max={20}
              step={1}
            />
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 'bold', width: '100%' }}
              >
                {`Values at Level ${slide}: `}
              </Typography>
              <Tooltip title={getValueTooltip('max')}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    cursor: 'help',
                    color: 'success.main',
                  }}
                >
                  Max: {getValueByLevel('max')}
                </Typography>
              </Tooltip>
              {edit.canHurt && (
                <Tooltip title={getValueTooltip('health')}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                      cursor: 'help',
                      color: 'error.main',
                    }}
                  >
                    Health: {getValueByLevel('health')}
                  </Typography>
                </Tooltip>
              )}
              {edit.isTradeable && (
                <Tooltip title={getValueTooltip('cost')}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                      cursor: 'help',
                      color: 'honey.main',
                    }}
                  >
                    Cost: {getValueByLevel('cost')}
                  </Typography>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Box>
        <ValueToggleHell
          disabled={false}
          property="max"
          fields={attributeFields}
          slide={slide}
          setSlide={setSlide}
          slideLabel="Max Value"
          borderColor="dividerDark"
        />
        <ValueToggleHell
          disabled={!!!edit.canHurt}
          property="health"
          fields={attributeFields}
          slide={slide}
          setSlide={setSlide}
          slideLabel="Total Drain"
          borderColor="dividerDark"
          accentColor="error.main"
        />
        <ValueToggleHell
          disabled={!!!edit.isTradeable}
          property="cost"
          fields={attributeFields}
          slide={slide}
          setSlide={setSlide}
          slideLabel="Total Cost"
          borderColor="dividerDark"
          accentColor="honey.main"
        />
      </Box>
    </Box>
  );
};

export default AttrValues;

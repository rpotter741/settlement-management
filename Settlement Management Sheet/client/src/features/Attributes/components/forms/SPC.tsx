import React, { useState, useMemo, useCallback, useEffect } from 'react';

import { useTools } from 'hooks/useTools.jsx';
import { useShellContext } from '@/context/ShellContext.js';
import useOrderedData from '@/hooks/utility/useOrderedData.js';

import {
  Box,
  Typography,
  Divider,
  Tooltip,
  IconButton,
  Autocomplete,
  TextField,
  Chip,
} from '@mui/material';
import { ArrowForward, Delete } from '@mui/icons-material';

import sPCFormData from '../../helpers/sPCFormData.js';
import ToolInput from '@/components/shared/DynamicForm/ToolInput.js';
import { set } from 'lodash';
import TextWithTooltipLink, {
  ContentChunk,
} from '@/components/shared/Layout/TextWithTooltipLink.js';

const settlementTypes = [
  {
    name: 'Fortified',
    description:
      'Fortified Settlements put their trust in theirs walls, preemptive reconnaissance, and well-trained troops.',
    id: '789',
  },
  {
    name: 'Mercantile',
    description:
      'Mercantile Settlements focus on establishing and expanding trade, developing vibrant culture, and welcoming artisans.',
    id: '456',
  },
  {
    name: 'Survivalist',
    description:
      'Survivalists focus on gathering food, supplies, medical items, and constructing durable shelters.',
    id: '123',
  },
];

const content: ContentChunk[] = [
  { type: 'text', value: 'Define the ' },
  {
    type: 'tooltip',
    title:
      'Settlements earn 1 settlement point per level per turn, barring other boons or banes. Click for more information.',
    value: 'Settlement Point Cost',
    onClick: () => console.log('open SPC help panel'),
  },
  {
    type: 'text',
    value: ' of this attribute per Settlement Type. A value of ',
  },
  { type: 'strong', value: '0' },
  {
    type: 'text',
    value:
      ' means this cannot be purchased with settlement points for that settlement type.',
  },
];

const SettlementPointsCost = () => {
  const { tool, id } = useShellContext();
  const {
    data: costs,
    order,
    errors,
    add,
    remove,
  } = useOrderedData(tool, id, 'settlementPointCost');

  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [inputValue, setInputValue] = useState('');

  const available = useMemo(() => {
    const assignedTypes = Object.keys(costs || {}).reduce(
      (types: Array<string>, id) => {
        types.push(id);
        return types;
      },
      []
    );
    const types = settlementTypes.filter(
      (type) => !assignedTypes.includes(type.id)
    );
    return types;
  }, [costs]);

  const fields = useMemo(() => {
    return Object.entries(costs || {}).map(([id, spc]) => {
      const typedSpc = spc as { name: string; value: number };
      return {
        ...sPCFormData,
        name: typedSpc.name,
        label: typedSpc.name.charAt(0).toUpperCase() + typedSpc.name.slice(1),
        tooltip: undefined,
        id,
        keypath: `settlementPointCost.data.${id}.value`,
      };
    });
  }, [costs]);

  if (!order) return <Box>Loading...</Box>;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 0.1fr 1fr',
        // alignItems: 'center',
        gap: 2,
      }}
    >
      <Box sx={{ gridColumn: 'span 3', p: 2 }}>
        <TextWithTooltipLink content={content} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'start', width: '100%' }}>
        <Autocomplete
          inputValue={inputValue}
          options={available}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Settlement Type"
              variant="outlined"
              error={!!errors?.name}
              helperText={errors?.name}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  add({
                    id: selectedValue.id,
                    entry: {
                      name: selectedValue.name,
                      value: 1, // Default value
                    },
                    sort: false,
                  });
                  setInputValue('');
                }
              }}
            />
          )}
          onChange={(event, newValue) => {
            setSelectedValue(newValue);
            setInputValue(newValue?.name || '');
          }}
          renderOption={(props, option) => (
            <Box
              {...props}
              component="li"
              key={option.name}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Tooltip
                title={<Typography>{option.description}</Typography>}
                placement="left"
                arrow
              >
                <Typography>{option.name}</Typography>
              </Tooltip>
            </Box>
          )}
          sx={{ my: 2, width: '100%' }}
        />
      </Box>
      <Divider orientation="vertical" flexItem>
        <Chip
          label={<ArrowForward />}
          onClick={
            () => {
              add({
                id: selectedValue.id,
                entry: {
                  name: selectedValue.name,
                  value: 1, // Default value
                },
                sort: false,
              });
              setInputValue('');
            } // Clear input after adding
          }
          sx={{ width: '100%', color: 'white' }}
        />
      </Divider>
      <Box>
        {order.map((id: string, index: number) => {
          const field = fields.find((f) => f.id === id);
          if (!field) return null;
          return (
            <React.Fragment key={id}>
              <ToolInput
                inputConfig={field}
                style={{
                  width: '100%',
                  m: 0,
                  p: 0,
                }}
                shrink
                onMoreDetails={
                  field.name !== 'default'
                    ? () => {
                        console.log('More details clicked');
                      }
                    : undefined
                }
                onRemove={
                  field.name !== 'default' ? () => remove(id) : undefined
                }
              />
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};

export default SettlementPointsCost;

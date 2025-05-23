import { React, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as newId } from 'uuid';

import { loadTool } from 'app/toolThunks.ts';
import { useSidePanel } from 'hooks/useSidePanel.jsx';

import {
  Box,
  Typography,
  Divider,
  Chip,
  Collapse,
  Autocomplete,
  TextField,
  ButtonGroup,
  Button,
  IconButton,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

import defaultKit from '../helpers/defaultKit.js';
import defaultSettlement from '../helpers/defaultSettlement.js';
import toolChoices from '../helpers/toolChoices.js';
import mergeKit from '../helpers/mergeObjects.js';

const pathToTool = {
  category: 'category',
  attribute: 'attribute',
  region: 'region',
  location: 'location',
  people: 'person',
};

const RenderLeads = ({ obj, keypath }) => {
  const dispatch = useDispatch();

  if (!obj) return null;
  if (!obj.leads) return null;
  const test = Array.isArray(obj.leads);
  if (test) {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {obj.leads.map((entry, n) => (
          <IconButton
            size="small"
            sx={{
              fontSize: '0.75rem',
              color: 'secondary.main',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }}
            key={newId()}
            onClick={() => {
              dispatch(
                loadTool({
                  tool: pathToTool[keypath],
                  id: obj.id[n],
                  refId: obj.refId[0],
                  currentTool: pathToTool[keypath],
                })
              );
            }}
          >
            {' '}
            {`[${entry}]`}
          </IconButton>
        ))}
      </Box>
    );
  } else {
    return <Typography> {`[${obj.leads}]`}</Typography>;
  }
};

const renderShallowPath = (obj, keypath, title) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  if (!obj || !keypath) return null;
  if (!obj[keypath]) return null;
  return (
    <Box key={keypath} sx={{ my: 2 }}>
      <Divider>
        <Chip
          label={title.toUpperCase()}
          sx={{ color: 'white', cursor: 'pointer', width: '150px' }}
          onClick={() => handleClick()}
        />
      </Divider>
      <Collapse in={open} sx={{ py: 1 }}>
        {obj[keypath].length > 0 ? (
          obj[keypath].map((entry, n) => {
            return (
              <Box
                key={entry.refId}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 4,
                  px: 1,
                  py: 0.5,
                  backgroundColor:
                    n % 2 === 0 ? 'dividerDark' : 'background.default',
                }}
              >
                <Typography textAlign="start"> {entry.name}</Typography>
                <RenderLeads obj={entry} keypath={keypath} />
              </Box>
            );
          })
        ) : (
          <Box>
            <Typography textAlign="start"> - No {title}</Typography>
          </Box>
        )}
      </Collapse>
    </Box>
  );
};

const SidePanelKit = ({}) => {
  const { setOptions } = useSidePanel();

  const [kit, setKit] = useState(defaultKit);
  const [settlement, setSettlement] = useState(defaultSettlement);
  const [kitOptions, setKitOptions] = useState([defaultKit]);
  const [settlementOptions, setSettlementOptions] = useState([
    defaultSettlement,
  ]);
  const [toolChoice, setToolChoice] = useState('both');
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    if (toolChoice === 'kit') {
      setCombinedData(mergeKit(kit, {}));
    } else if (toolChoice === 'settlement') {
      setCombinedData(mergeKit({}, settlement));
    } else {
      setCombinedData(mergeKit(kit, settlement));
    }
  }, [toolChoice, kit, settlement]);

  useEffect(() => {
    setOptions(mergeKit(kit, settlement));
  }, [kit, settlement]);

  return (
    <Box sx={{ pb: 3 }}>
      <ButtonGroup
        variant="outlined"
        aria-label="outlined button group"
        sx={{ mb: 2 }}
      >
        {toolChoices.map((entry) => {
          return (
            <Button
              key={entry.id}
              onClick={() => {
                setToolChoice(entry.id);
              }}
              variant={toolChoice === entry.id ? 'contained' : 'outlined'}
              sx={{
                backgroundColor:
                  toolChoice === entry.id ? 'success.dark' : 'divider',
                color: toolChoice === entry.id ? 'white' : 'secondary.light',
                borderColor:
                  toolChoice === entry.id ? 'success.dark' : 'honey.dark',
              }}
            >
              {entry.name}
            </Button>
          );
        })}
      </ButtonGroup>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
        <Autocomplete
          sx={{ mt: 2, width: '100%' }}
          value={kit}
          disablePortal
          id="kit-select"
          options={[...kitOptions, { name: '-Create New Kit-' }]}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Select a Kit" />
          )}
          onChange={(event, newValue) => {
            if (newValue) {
              setKit(newValue);
            } else {
              setKit(defaultKit);
            }
          }}
        />
        <IconButton sx={{ mt: 2 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1,
        }}
      >
        <Autocomplete
          sx={{ mt: 2, width: '100%' }}
          value={settlement}
          disablePortal
          id="settlement-select"
          options={[...settlementOptions, { name: '-Create New Settlement-' }]}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Select a Settlement" />
          )}
          onChange={(event, newValue) => {
            if (newValue) {
              setSettlement(newValue);
            } else {
              setSettlement(defaultSettlement);
            }
          }}
        />
        <IconButton sx={{ mt: 2 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      <Box sx={{ overflowY: 'scroll' }}>
        {renderShallowPath(combinedData, 'attribute', 'Attributes')}
        {renderShallowPath(combinedData, 'category', 'Categories')}
        {renderShallowPath(combinedData, 'region', 'Regions')}
        {renderShallowPath(combinedData, 'location', 'Locations')}
        {renderShallowPath(combinedData, 'people', 'People')}
      </Box>
    </Box>
  );
};

export default SidePanelKit;

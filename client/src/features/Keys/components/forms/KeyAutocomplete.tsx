import { KeyTool } from '../../../../../../types';

import {
  Box,
  TextField,
  Autocomplete,
  Tooltip,
  Link,
  Button,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useDebounce } from '@/hooks/utility/useDebounce.js';
import { useTools } from 'hooks/tools/useTools.jsx';
import { useShellContext } from '@/context/ShellContext.js';
import api from 'services/interceptor.js';
import toSnakeCase from '@/utility/inputs/snakeCase.js';

import { loadTool } from 'app/toolThunks.js';

const KeyAutocomplete = ({
  onAdd,
  hideHelp,
}: {
  onAdd: any;
  hideHelp: boolean;
}) => {
  const dispatch = useDispatch();
  const { tool, id, side } = useShellContext();
  const { runServerActions, edit } = useTools(tool, id);
  const [inputValue, setInputValue] = useState(edit?.name || '');
  const [options, setOptions] = useState([]);
  const [existingKey, setExistingKey] = useState(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [hideHelper, setHideHelper] = useState(hideHelp);

  const debounced = useDebounce(inputValue, 300);

  useEffect(() => {
    console.log(edit, 'edit');
  }, [edit]);

  const editExistingKey = (key: KeyTool) => {
    dispatch(
      loadTool({
        tool: 'key',
        id: key.id,
        refId: key.refId,
        currentTool: 'key',
        mode: 'edit',
        side,
      })
    );
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get('/tools/contentByName', {
          params: { name: debounced, tool: 'key' },
        });
        setIsLoadingOptions(false);
        setOptions(res.data);
      } catch (err) {
        setIsLoadingOptions(false);
        setOptions([]);
        console.error('Error fetching options:', err);
      }
    };
    if (debounced) {
      fetchOptions();
    } else {
      setOptions([]);
    }
  }, [debounced]);

  useEffect(() => {
    if (!debounced) return;

    const checkKey = async () => {
      try {
        const res = await api.get('/tools/keys/check', {
          params: { name: debounced },
        });
        setExistingKey(res.data.exists ? res.data.key : null);
      } catch (err) {
        console.error('Key check failed:', err);
        setExistingKey(null);
      }
    };

    checkKey();
  }, [debounced]);

  const handleAdd = () => {
    if (existingKey) {
      console.log('Key already exists:', existingKey);
    } else {
      runServerActions('save', { ...edit, name: inputValue });
      onAdd({ ...edit, name: inputValue });
      setHideHelper(true);
    }
  };

  const handleBlur = () => {
    if (inputValue.length === 0) {
      setIsLoadingOptions(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        width: '100%',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Autocomplete
        freeSolo
        options={options}
        inputValue={inputValue}
        getOptionLabel={(option) => option.name}
        onBlur={handleBlur}
        onInputChange={(e, newInput) => {
          setIsLoadingOptions(true);
          setInputValue(toSnakeCase(newInput));
        }}
        onChange={(e, newVal) => {
          const val = typeof newVal === 'string' ? newVal : newVal?.name;
          if (val) setInputValue(val);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search / Add Key"
            variant="outlined"
            value={inputValue}
          />
        )}
        sx={{ width: '80%' }}
        value={edit || { name: '' }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20px',
          left: 8,
          fontSize: '0.75rem',
        }}
      >
        {isLoadingOptions ? (
          'Searching...'
        ) : inputValue.length ? (
          existingKey ? (
            <>
              Key already exists.{' '}
              <Link
                sx={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  editExistingKey(existingKey);
                }}
              >
                Click to open in new tab.
              </Link>
            </>
          ) : (
            'Click add to create a new key'
          )
        ) : (
          'Type to search or add a new key'
        )}
      </Box>
      <Button
        disabled={inputValue.length === 0 || existingKey !== null}
        onClick={handleAdd}
        sx={{
          width: '15%',
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          mb: 2.5,
        }}
        variant="contained"
      >
        Add Key
      </Button>
    </Box>
  );
};

export default KeyAutocomplete;

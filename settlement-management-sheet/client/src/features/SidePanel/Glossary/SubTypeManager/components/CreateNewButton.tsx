import { Box, Button, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MotionBox } from '@/components/shared/Layout/Motion/MotionBox.js';
import capitalize from '@/utility/inputs/capitalize.js';
import { Check } from '@mui/icons-material';

const CreateNewButton = <T extends string>({
  onAdd,
  selectOptions,
  label,
}: {
  onAdd: (name: string, type: T) => void;
  selectOptions: T[];
  label: string;
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<T>(
    (selectOptions[0] ?? ('text' as unknown as T)) as T
  );
  const [selectOpen, setSelectOpen] = useState(false);

  return (
    <Box
      tabIndex={-1}
      sx={{
        display: 'flex',
        width: '100%',
        gap: isCreating ? 1 : 0,
        alignItems: 'center',
      }}
      onBlur={(e) => {
        if (selectOpen) return;
        const next = e.relatedTarget;
        const wrapper = e.currentTarget;
        if (!next || (next && !wrapper.contains(next as Node))) {
          setIsCreating(false);
        }
      }}
    >
      <AnimatePresence>
        <MotionBox
          key="name-input"
          initial={{ width: 0 }}
          animate={{
            width: isCreating ? (selectOptions.length ? '50%' : '90%') : '0%',
          }}
          transition={{ duration: 0.25 }}
          exit={{ width: 0 }}
          sx={{ overflow: 'hidden' }}
        >
          <TextField
            size="small"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && name.trim().length > 0) {
                onAdd(name, type);
                setName('');
              }
            }}
          />
        </MotionBox>
        {selectOptions.length > 0 && (
          <MotionBox
            key="type-select"
            initial={{ width: 0 }}
            animate={{ width: isCreating ? '40%' : '0%' }}
            transition={{ duration: 0.25 }}
            exit={{ width: 0 }}
            sx={{ overflow: 'hidden' }}
          >
            <Select
              size="small"
              value={type}
              onChange={(e) => setType(e.target.value as T)}
              onFocus={() => setSelectOpen(true)}
              onBlur={() => setSelectOpen(false)}
            >
              {selectOptions.map((property) => (
                <MenuItem
                  key={property}
                  value={property}
                  sx={{ fontSize: '0.875rem' }}
                >
                  {capitalize(property)}
                </MenuItem>
              ))}
            </Select>
          </MotionBox>
        )}
        <MotionBox
          key="add-button"
          initial={{ width: '100%', maxHeight: 36 }}
          animate={{ width: isCreating ? '10%' : '100%', maxHeight: 36 }}
          transition={{ duration: 0.25 }}
          exit={{ width: 0 }}
          sx={{ overflow: 'hidden' }}
        >
          <Button
            variant="contained"
            onClick={() => {
              if (isCreating) {
                onAdd(name, type);
                setName('');
              } else {
                setIsCreating(true);
              }
            }}
            sx={{
              p: isCreating ? 0.5 : 1,
              m: 0,
              minWidth: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              bgcolor: isCreating ? 'success.main' : 'primary.main',
            }}
          >
            {isCreating ? <Check sx={{ color: 'white' }} /> : label}
          </Button>
        </MotionBox>
      </AnimatePresence>
    </Box>
  );
};

export default CreateNewButton;

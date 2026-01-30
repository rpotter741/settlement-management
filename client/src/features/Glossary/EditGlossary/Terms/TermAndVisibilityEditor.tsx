import GlossaryTermEditor from '@/components/shared/DynamicForm/TermEditor.js';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import useTheming from '@/hooks/layout/useTheming.js';
import { isEven } from '@/utility/booleans/numberTests.js';
import capitalize from '@/utility/inputs/capitalize.js';
import {
  alpha,
  Box,
  Button,
  Checkbox,
  Divider,
  ListItem,
  MenuItem,
  Select,
  Switch,
  Typography,
} from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';

function isDisabled(
  visibility: 'player' | 'resident' | 'collaborator' | 'public',
  settings: any
) {
  switch (visibility) {
    case 'player':
      return !settings.enabled || !settings.visibility.player;
    case 'resident':
      return !settings.enabled || !settings.visibility.resident;
    case 'collaborator':
      return !settings.enabled || !settings.visibility.collaborator;
    case 'public':
      return !settings.enabled || !settings.visibility.public;
  }
}

const TermAndVisibilityEditor = ({
  systemName = '',
  index = 0,
  lastIndex = false,
  label = '',
  defaultLabel = '',
  handleTermChange = (key: string, newTerm: string | null) => {},
  settings = {} as any,
  toggleEnabled = () => {},
  toggleVisibilityByKeypath = (keypath: string) => {},
  changeDefaultSubType = (
    subTypeId: string,
    entryType: GlossaryEntryType
  ) => {},
  subTypeOptions = [] as any[],
  fallbackId = '',
}) => {
  //
  const [isEditing, setIsEditing] = useState(false);
  const { darkenColor, getAlphaColor } = useTheming();

  return (
    <ListItem
      key={`${systemName}-term-row`}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: 'auto',
        minHeight: '70px',
        backgroundColor: isEven(index)
          ? 'background.default'
          : darkenColor({
              color: 'background',
              key: 'default',
              amount: 0.1,
            }),
        borderLeft: '1px solid',
        borderRight: '1px solid',
        borderBottom: lastIndex ? '1px solid' : 'none',
        borderColor: (theme) => alpha(theme.palette.divider, 0.5),
        p: 0,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          width: '100%',
          minHeight: '70px',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            textAlign: 'left',
            fontWeight: 'bold',
            flex: 2,
          }}
        >
          {capitalize(systemName)}
        </Typography>
        <Box sx={{ flex: 4 }}>
          <GlossaryTermEditor
            handleChange={(newTerm) => {
              // Handle term change logic here
              handleTermChange(systemName, newTerm);
            }}
            defaultTerm={label}
            fallback={defaultLabel}
          />
        </Box>
        <Box
          sx={{
            flex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="text"
            sx={{ width: '100%' }}
          >
            Settings
          </Button>
        </Box>
      </Box>
      <AnimatePresence>
        {isEditing && (
          <MotionBox
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              gap: 4,
            }}
          >
            <Box
              sx={{ display: 'flex', py: 2, gap: 2, flexDirection: 'column' }}
            >
              <Typography variant="h6">Visibility Settings</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  sx={{
                    width: '150px',
                    color: isDisabled('collaborator', settings)
                      ? 'text.disabled'
                      : 'text.primary',
                  }}
                >
                  Collaborator
                </Typography>
                <Checkbox
                  disabled={!settings.enabled}
                  checked={settings?.visibility?.collaborator}
                  onChange={() => toggleVisibilityByKeypath('collaborator')}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  sx={{
                    width: '150px',
                    color: isDisabled('player', settings)
                      ? 'text.disabled'
                      : 'text.primary',
                  }}
                >
                  Player
                </Typography>
                <Checkbox
                  disabled={!settings.enabled}
                  checked={settings.visibility.player}
                  onChange={() => toggleVisibilityByKeypath('player')}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  sx={{
                    width: '150px',
                    color: isDisabled('resident', settings)
                      ? 'text.disabled'
                      : 'text.primary',
                  }}
                >
                  Resident
                </Typography>
                <Checkbox
                  disabled={!settings.enabled}
                  checked={settings.visibility.resident}
                  onChange={() => toggleVisibilityByKeypath('resident')}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  sx={{
                    width: '150px',
                    color: isDisabled('public', settings)
                      ? 'text.disabled'
                      : 'text.primary',
                  }}
                >
                  Public
                </Typography>
                <Checkbox
                  disabled={!settings.enabled}
                  checked={settings.visibility.public}
                  onChange={() => toggleVisibilityByKeypath('public')}
                />
              </Box>
            </Box>
            <Divider orientation="vertical" flexItem />
            {systemName !== 'glossary' && (
              <Box sx={{ p: 2 }}>
                <Typography variant="h6"> Default Sub-Type</Typography>
                <Select
                  fullWidth
                  value={settings?.defaultSubType || fallbackId}
                  onChange={(e) => {
                    changeDefaultSubType(
                      e.target.value,
                      systemName as GlossaryEntryType
                    );
                  }}
                  renderValue={() => {
                    const selectedOption = subTypeOptions.find(
                      (option: any) => option.id === settings?.defaultSubType
                    );
                    const fallbackOption = subTypeOptions.find(
                      (option: any) => option.id === fallbackId
                    );
                    return (
                      selectedOption?.name ||
                      fallbackOption?.name ||
                      'Select Sub-Type'
                    );
                  }}
                >
                  {/* Options would be populated dynamically based on available sub-types */}
                  {subTypeOptions.map((subType: any) => (
                    <MenuItem key={subType.id} value={subType.id}>
                      {subType.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            )}
          </MotionBox>
        )}
      </AnimatePresence>
    </ListItem>
  );
};

export default TermAndVisibilityEditor;

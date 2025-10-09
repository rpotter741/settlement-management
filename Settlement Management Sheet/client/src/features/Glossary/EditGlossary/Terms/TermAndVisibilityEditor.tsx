import GlossaryTermEditor from '@/components/shared/DynamicForm/GlossaryTermEditor.js';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import useTheming from '@/hooks/layout/useTheming.js';
import { isEven } from '@/utility/booleans/numberTests.js';
import capitalize from '@/utility/inputs/capitalize.js';
import {
  alpha,
  Box,
  Button,
  ListItem,
  Switch,
  Typography,
} from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import {
  genrePropertyLabelDefaults,
  SubModelTypes,
} from '../../utils/getPropertyLabel.js';
import EcloreanGrid, {
  Row,
} from '@/components/shared/EcloreanGrid/EcloreanGrid.js';
import { makeGlossarySettingsRow } from '../Settings/EditGlossarySettings.js';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';

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
}) => {
  //
  const [isEditing, setIsEditing] = useState(false);
  const { darkenColor, getAlphaColor } = useTheming();

  return (
    <ListItem
      key={systemName}
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
            }}
          >
            <Box
              sx={{ display: 'flex', py: 2, gap: 4, flexDirection: 'column' }}
            >
              {systemName !== 'glossary' && (
                <>
                  <Typography variant="h6">Term Settings</Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ width: '150px' }}>Enabled</Typography>
                    <Switch
                      checked={settings?.enabled}
                      onChange={toggleEnabled}
                    />
                  </Box>
                </>
              )}
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
                <Switch
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
                <Switch
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
                <Switch
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
                <Switch
                  disabled={!settings.enabled}
                  checked={settings.visibility.public}
                  onChange={() => toggleVisibilityByKeypath('public')}
                />
              </Box>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </ListItem>
  );
};

export default TermAndVisibilityEditor;

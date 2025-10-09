import { GlossaryStateEntry } from '@/app/types/GlossaryTypes.js';
import getPropertyLabel, {
  genrePropertyLabelDefaults,
  SubModelTypes,
} from '../../utils/getPropertyLabel.js';
import {
  alpha,
  Box,
  Button,
  capitalize,
  darken,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import GlossaryTermEditor from '@/components/shared/DynamicForm/GlossaryTermEditor.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { isEven } from '@/utility/booleans/numberTests.js';
import useTheming from '@/hooks/layout/useTheming.js';
import updateGlossaryTermThunk from '@/app/thunks/glossary/glossary/updateGlossaryTermThunk.js';
import { useMemo } from 'react';
import { Tab } from '@/app/types/TabTypes.js';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import { AnimatePresence } from 'framer-motion';
import { CommentsDisabledOutlined, More } from '@mui/icons-material';
import TermAndVisibilityEditor from '../Terms/TermAndVisibilityEditor.js';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';
import { Row } from '@/components/shared/EcloreanGrid/EcloreanGrid.js';

function toTitleCase(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

interface SettingsRow {
  id: string;
  cells: {
    component: any;
    props: any;
  }[];
}

export type VisibilitySetting = 'private' | 'standard' | 'open' | 'public';

const defaultVisibilitySettings: Record<
  VisibilitySetting,
  Record<string, boolean>
> = {
  private: {
    collaborator: true,
    player: false,
    resident: false,
    public: false,
  },
  standard: {
    collaborator: true,
    player: true,
    resident: false,
    public: false,
  },
  open: {
    collaborator: true,
    player: true,
    resident: true,
    public: false,
  },
  public: {
    collaborator: true,
    player: true,
    resident: true,
    public: true,
  },
};

export function makeGlossarySettingsRow({
  termKey,
  subModel,
  glossary,
}: {
  termKey: string;
  subModel: SubModelTypes;
  glossary: GlossaryStateEntry;
  toggleEnabled: ({
    subModel,
    termKey,
  }: {
    subModel: SubModelTypes;
    termKey: string;
  }) => void;
  toggleVisibilityByKeypath: ({
    subModel,
    termKey,
    keypath,
  }: {
    subModel: SubModelTypes;
    termKey: string;
    keypath: string;
  }) => void;
}): SettingsRow {
  const { label, defaultLabel } = getPropertyLabel({
    key: termKey,
    subModel,
    glossary,
  });
  const secondaryLabel =
    defaultLabel !== label ? toTitleCase(defaultLabel) : null;
  const settings = glossary.integrationState?.[subModel]?.[termKey] || {};

  const enabled = settings?.enabled ?? true;
  const visibility = {
    collaborator:
      settings.visibility?.collaborator ??
      defaultVisibilitySettings[glossary.visibility]?.collaborator ??
      true,
    player:
      settings.visibility?.player ??
      defaultVisibilitySettings[glossary.visibility]?.player ??
      true,
    resident:
      settings.visibility?.resident ??
      defaultVisibilitySettings[glossary.visibility]?.resident ??
      false,
    public:
      settings.visibility?.public ??
      defaultVisibilitySettings[glossary.visibility]?.public ??
      false,
  };

  const calculatedSettings = {
    id: termKey,
    ...settings,
    enabled,
    visibility: {
      ...visibility,
    },
  };

  return calculatedSettings;
}

const GlossaryPropertyLabels = ({
  subModel,
}: {
  glossary: GlossaryStateEntry;
  subModel: SubModelTypes;
}) => {
  const { darkenColor, getAlphaColor } = useTheming();
  const dispatch: AppDispatch = useDispatch();
  const { glossary, updateGlossary } = useGlossaryEditor();
  const labels =
    genrePropertyLabelDefaults[glossary.genre][
      subModel as keyof (typeof genrePropertyLabelDefaults)[typeof glossary.genre]
    ] || {};

  const handleTermChange = (key: string, newTerm: string | null) => {
    dispatch(
      updateGlossaryTermThunk({
        id: glossary.id,
        key,
        subModel,
        value: newTerm,
      })
    );
  };

  const toggleEnabled = ({
    subModel,
    termKey,
  }: {
    subModel: SubModelTypes;
    termKey: string;
  }) => {
    const currentValue =
      glossary.integrationState?.[subModel]?.[termKey]?.enabled ?? true;

    updateGlossary(
      `integrationState.${subModel}.${termKey}.enabled`,
      !currentValue
    );
  };
  const toggleVisibilityByKeypath = ({
    subModel,
    termKey,
    keypath,
  }: {
    subModel: SubModelTypes;
    termKey: string;
    keypath: string;
  }) => {
    const fallback =
      keypath === 'collaborator' || keypath === 'player' ? true : false;
    const currentState =
      glossary.integrationState?.[subModel]?.[termKey]?.visibility?.[keypath] ??
      fallback;

    updateGlossary(
      `integrationState.${subModel}.${termKey}.visibility.${keypath}`,
      !currentState
    );
  };

  const testRow = useMemo(() => {
    const rowObject: Record<SubModelTypes, Row[]> = {
      system: [],
      geography: [],
      politics: [],
      relationships: [],
      history: [],
      custom: [],
    };
    if (!glossary) return rowObject;
    Object.entries(genrePropertyLabelDefaults[glossary.genre]).forEach(
      ([subModel, keys]) => {
        const rows: Row[] = [];
        Object.entries(keys).forEach(([key, subKey]) => {
          if (key !== 'system') {
            rows.push(
              makeGlossarySettingsRow({
                termKey: key,
                subModel: subModel as SubModelTypes,
                glossary,
                toggleEnabled,
                toggleVisibilityByKeypath,
              })
            );
          }
        });
        rowObject[subModel as SubModelTypes] = rows;
      }
    );
    return rowObject;
  }, [glossary]);

  if (!glossary) return null;

  return (
    <AnimatePresence>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            px: 2,
            minHeight: '54px',
            height: '54px',
            alignItems: 'center',
            border: '1px solid',
            borderColor: (theme) => alpha(theme.palette.divider, 0.5),
          }}
        >
          <Typography
            variant="body1"
            sx={{ flex: 2, textAlign: 'left', fontSize: '1.1rem' }}
          >
            System Name
          </Typography>
          <Typography
            variant="body1"
            sx={{
              flex: 4,
              textAlign: 'left',
              fontSize: '1.1rem',
              pl: '38px',
              mr: '-38px',
            }}
          >
            Custom Name
          </Typography>
          <Typography
            variant="body1"
            sx={{ flex: 2, textAlign: 'center', fontSize: '1.1rem' }}
          >
            Actions
          </Typography>
        </Box>
        <List sx={{ pt: 0 }}>
          {Object.entries(labels).map(([systemName, fallbackName], n) => {
            if (systemName === 'system') return null;
            const { label, defaultLabel } = getPropertyLabel({
              glossary,
              subModel,
              key: systemName,
            });
            return (
              <TermAndVisibilityEditor
                key={systemName}
                systemName={systemName}
                index={n}
                lastIndex={Object.entries(labels).length - 1 === n}
                label={label}
                defaultLabel={defaultLabel}
                handleTermChange={handleTermChange}
                settings={testRow[subModel][n]}
                toggleEnabled={() =>
                  toggleEnabled({ subModel, termKey: systemName })
                }
                toggleVisibilityByKeypath={(keypath: string) =>
                  toggleVisibilityByKeypath({
                    subModel,
                    termKey: systemName,
                    keypath,
                  })
                }
              />
            );
          })}
        </List>
      </MotionBox>
    </AnimatePresence>
  );
};

export default GlossaryPropertyLabels;

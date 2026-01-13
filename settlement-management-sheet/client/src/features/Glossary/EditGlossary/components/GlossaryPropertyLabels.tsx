import { GlossaryStateEntry } from '@/app/types/GlossaryTypes.js';
import getPropertyLabel, {
  genrePropertyLabelDefaults,
  SubModelTypes,
  usePropertyLabel,
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
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import useTheming from '@/hooks/layout/useTheming.js';
import updateGlossaryTermThunk from '@/app/thunks/glossary/glossary/updateGlossaryTermThunk.js';
import React, { useMemo } from 'react';
import { Tab } from '@/app/types/TabTypes.js';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import { AnimatePresence } from 'framer-motion';
import TermAndVisibilityEditor from '../Terms/TermAndVisibilityEditor.js';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';
import { Row } from '@/components/shared/EcloreanGrid/EcloreanGrid.js';
import { useSelector } from 'react-redux';
import { selectAllSubTypes } from '@/app/selectors/subTypeSelectors.js';
import { SubType } from '@/app/slice/subTypeSlice.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import fetchSubTypesByUserIdThunk from '@/app/thunks/glossary/subtypes/fetchSubTypesByUserIdThunk.js';

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

export const genericSubTypeIds: Record<GlossaryEntryType, string> = {
  continent: '3770c5f7-7886-4bb6-be8c-3b1f3f2a9dc9',
  region: 'aee6aac0-f788-40df-a69f-f59fc032bd01',
  nation: 'b2b10c72-7649-4276-b93c-06a660f0654a',
  territory: '8555fce3-1678-4993-a4d2-71c4e47d1b1c',
  landmark: '7849dc1f-c21e-4eef-9a24-0b86b9ba1e63',
  settlement: '3a313b9b-d735-43ef-985f-07a032783bc5',
  district: '153c5305-3efd-4e19-a108-1418f6e017cc',
  collective: '3ee82037-4ba0-405b-a389-8e28b157ab9d',
  location: '',
  person: '',
  event: '',
  lore: '',
  item: '',
  folder: '',
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
  const { label, defaultLabel } = getPropertyLabel(termKey, glossary);
  const secondaryLabel =
    defaultLabel !== label ? toTitleCase(defaultLabel) : null;
  const settings = glossary.integrationState?.[subModel]?.[termKey] || {};

  const enabled = settings?.enabled ?? true;
  const visibility = {
    collaborator:
      settings.visibility?.collaborator ??
      defaultVisibilitySettings[
        glossary.visibility as keyof typeof defaultVisibilitySettings
      ]?.collaborator ??
      true,
    player:
      settings.visibility?.player ??
      defaultVisibilitySettings[
        glossary.visibility as keyof typeof defaultVisibilitySettings
      ]?.player ??
      true,
    resident:
      settings.visibility?.resident ??
      defaultVisibilitySettings[
        glossary.visibility as keyof typeof defaultVisibilitySettings
      ]?.resident ??
      false,
    public:
      settings.visibility?.public ??
      defaultVisibilitySettings[
        glossary.visibility as keyof typeof defaultVisibilitySettings
      ]?.public ??
      false,
  };

  const defaultSubType =
    glossary.integrationState?.[subModel]?.[termKey]?.default || '';

  const calculatedSettings = {
    id: termKey,
    ...settings,
    enabled,
    visibility: {
      ...visibility,
    },
    defaultSubType,
  };
  return calculatedSettings;
}

const GlossaryPropertyLabels = ({ subModel }: { subModel: SubModelTypes }) => {
  const { darkenColor, getAlphaColor } = useTheming();
  const dispatch: AppDispatch = useDispatch();
  const { glossary, updateGlossary } = useGlossaryEditor();
  const labels = genrePropertyLabelDefaults[glossary.genre] || {};

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
    const rows: SettingsRow[] = [];
    if (!glossary) return rows;
    Object.entries(genrePropertyLabelDefaults[glossary.genre]).forEach(
      ([systemName, userName]) => {
        const rowObject = makeGlossarySettingsRow({
          termKey: systemName,
          subModel: 'system',
          glossary,
          toggleEnabled,
          toggleVisibilityByKeypath,
        });
        rows.push(rowObject);
      }
    );
    return rows;
  }, [glossary]);

  const allSubtypes = useSelector(selectAllSubTypes);

  if (allSubtypes.length === 0) {
    dispatch(fetchSubTypesByUserIdThunk());
  }

  const subTypesByEntryType = useMemo(() => {
    const mapping: Record<string, SubType[]> = {};
    allSubtypes.forEach((subType) => {
      if (!mapping[subType.entryType]) {
        mapping[subType.entryType] = [];
      }
      mapping[subType.entryType].push(subType);
    });
    return mapping;
  }, [allSubtypes]);

  const changeDefaultSubType = (id: string, entryType: GlossaryEntryType) => {
    updateGlossary(`integrationState.${subModel}.${entryType}.default`, id);
  };

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
            const { label, defaultLabel } = getPropertyLabel(
              systemName,
              glossary
            );
            return (
              <TermAndVisibilityEditor
                key={systemName}
                systemName={systemName}
                index={n}
                lastIndex={Object.entries(labels).length - 1 === n}
                label={label}
                defaultLabel={defaultLabel}
                handleTermChange={handleTermChange}
                settings={testRow[n]}
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
                subTypeOptions={subTypesByEntryType[systemName] || []}
                changeDefaultSubType={changeDefaultSubType}
                fallbackId={genericSubTypeIds[systemName as GlossaryEntryType]}
              />
            );
          })}
        </List>
      </MotionBox>
    </AnimatePresence>
  );
};

export default GlossaryPropertyLabels;

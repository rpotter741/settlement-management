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
  continent: '63c87363-ecee-4ead-ace3-493b52bd083a',
  region: '0e1ce32c-b9af-4e10-a888-81bcf35a9679',
  nation: 'fd9662a3-8c4a-4466-899c-6cfedbca9dca',
  territory: '7a721b38-d669-4b19-8eb2-233abeb5f730',
  landmark: '6b6965b3-bd56-486c-bc4e-32c306bddee2',
  settlement: '5541d132-8894-4f2d-9757-7f88751dcd02',
  collective: '99897282-e7b0-4bf6-8d51-0d5ed3c99a54',
  location: 'b5094b58-48e6-4860-b68c-f71df4cdb957',
  person: '26202360-a1ee-42b1-9c31-e2dc62ad45de',
  event: '97bd7dcd-6845-41d8-9cd3-a9e4b1650df9',
  lore: 'fd272d17-88ec-46c4-906d-051ad80c4e48',
  item: '617e4ebc-3e28-4606-b9e4-38c018429fdb',
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

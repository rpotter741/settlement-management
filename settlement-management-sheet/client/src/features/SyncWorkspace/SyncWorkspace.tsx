import { selectEditEntryById } from '@/app/selectors/glossarySelectors.js';
import { selectSubTypeProperties } from '@/app/selectors/subTypeSelectors.js';
import { SubTypeProperty } from '@/app/slice/subTypeSlice.js';
import { Tab } from '@/app/types/TabTypes.js';
import useEntriesByType from '@/cache/entryType/idsByType.js';
import useTypesByIds from '@/cache/entryType/typeByIds.js';
import { usePropertyLabel } from '@/features/Glossary/utils/getPropertyLabel.js';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { cloneDeep, StringNullableChain } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { GlossaryEntryType } from '../../../../shared/types/index.js';
import { dispatch } from '@/app/constants.js';
import { updateTab } from '@/app/slice/tabSlice.js';
import { ArrowBack, ArrowDownward } from '@mui/icons-material';
import capitalize from '@/utility/inputs/capitalize.js';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import SyncRow from './SyncRow.js';
import useTheming from '@/hooks/layout/useTheming.js';
import updateEntryById from '@/app/thunks/glossary/entries/updateEntryById.js';
import { updateGlossaryEntry } from '@/app/slice/glossarySlice.js';
import ignoreBacklinkThunk from '@/app/thunks/glossary/entries/ignoreBacklinkThunk.js';
import confetti from 'canvas-confetti';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import useNodeEditor from '@/hooks/glossary/useNodeEditor.js';
import InboundLinks from './InboundLinks.js';
import OutboundLinks from './OutboundLinks.js';

// possibly look at redoing the key mapping so that cmd + m + s opens this workspace, cmd + m + e opens edit, cmd + m + p opens preview, etc. cmd + m = mode, then the variants afterwards.

export interface Backlink {
  createdAt?: string;
  fromNameAtLink: string;
  id: string;
  ignoreDivergence: boolean;
  lastSyncedAt?: string;
  propertyId: string;
  propertyName: string;
  propertyValue: string;
  sourceId: string;
  targetId: string;
  toNameAtLink: string;
  type: 'direct' | 'directCompound' | 'indirect';
  updatedAt?: string;
  targetIgnore: boolean;
}

const SyncExample = ({ tab }: { tab: Tab }) => {
  const { entry } = useNodeEditor(tab.glossaryId as string, tab.id);
  const { hexValues } = useTheming();

  const backlinksTo: Backlink[] = entry?.backlinksTo ?? ([] as Backlink[]);
  const backlinksFrom: Backlink[] = entry?.backlinksFrom ?? ([] as Backlink[]);

  const ignoredCount = useMemo(() => {
    let count = 0;
    backlinksTo.forEach((link) => {
      if (link.targetIgnore) {
        count += 1;
      }
    });
    return count;
  }, [backlinksTo]);

  const answeredCount = useMemo(() => {
    let count = 0;
    backlinksTo.forEach((link) => {
      if (
        !link.targetIgnore &&
        backlinksFrom.find((bl) => bl.targetId === link.sourceId)
      ) {
        count += 1;
      }
    });
    return count;
  }, [backlinksTo, backlinksFrom]);

  const unresolved = backlinksTo.length - answeredCount - ignoredCount;

  const [startingUnresolved, setStartingUnresolved] = useState(unresolved);

  useEffect(() => {
    if (startingUnresolved !== 0 && unresolved === 0) {
      dispatch(
        showSnackbar({
          message: `All backlinks resolved for ${entry.name}!`,
          type: 'success',
        })
      );
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setStartingUnresolved(0);
    }
  }, [startingUnresolved, unresolved]);

  const allProperties = useSelector(selectSubTypeProperties);
  const propsById = useMemo(() => {
    const map: Record<string, SubTypeProperty> = {};
    allProperties.forEach((prop) => {
      map[prop.id] = prop;
    });
    return map;
  }, [allProperties]);

  const entryProperties = useMemo(() => {
    if (!entry) return {};
    const props: Record<string, any> = {};
    Object.values(allProperties).forEach((prop) => {
      if (entry.groups) {
        Object.values(entry.groups).forEach((group) => {
          if (group.properties && group.properties[prop.id]) {
            props[prop.name] = { ...prop, groupId: group.id };
          }
        });
      }
    });
    return props;
  }, [entry, allProperties]);

  const [mode, setMode] = useState<'inbound' | 'outbound'>('inbound');

  return (
    <Box
      sx={{
        flex: 1,
        position: 'relative',
        p: 2,
        background: `linear-gradient(to bottom right, ${hexValues.background.paper}, ${hexValues.background.default})`,
        maxHeight: '100%',
      }}
    >
      <Typography variant="h4" sx={{ width: '100%', textAlign: 'center' }}>
        Sync Workspace
      </Typography>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          my: 2,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <Tooltip title={`Back to ${capitalize(tab.mode)} View`}>
          <IconButton
            sx={{ position: 'absolute', left: 16, top: 8 }}
            onClick={() => {
              dispatch(
                updateTab({
                  tabId: tab.tabId,
                  keypath: 'tool',
                  updates: entry.entryType,
                })
              );
            }}
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Button
          variant="contained"
          color={mode === 'inbound' ? 'success' : 'primary'}
          onClick={() => {
            setMode('inbound');
          }}
          sx={{ transition: 'all 0.2s ease-in-out' }}
        >
          Inbound Backlinks
        </Button>
        <Button
          variant="contained"
          color={mode === 'outbound' ? 'success' : 'primary'}
          onClick={() => setMode('outbound')}
          sx={{ transition: 'all 0.2s ease-in-out' }}
        >
          Outbound Backlinks
        </Button>
      </Box>
      {mode === 'inbound' && (
        <InboundLinks
          entryProperties={entryProperties}
          backlinksFrom={backlinksFrom}
          backlinksTo={backlinksTo}
          answeredCount={answeredCount}
          unresolved={unresolved}
          ignoredCount={ignoredCount}
          tab={tab}
          entry={entry}
          propsById={propsById}
        />
      )}
      {mode === 'outbound' && (
        <OutboundLinks
          entryProperties={entryProperties}
          entry={entry}
          tab={tab}
          backlinksTo={backlinksTo}
          backlinksFrom={backlinksFrom}
        />
      )}
    </Box>
  );
};

export default SyncExample;

/*
could I use framer + popLayout mode to have a shrinking and rotating checkmark + a growing and rotating x on hover when someone hovers over a backlink item with an active link? that would be dope to have it appear to mutate from check to x
*/

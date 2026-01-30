import { Box, Button, Checkbox, IconButton, Typography } from '@mui/material';
import { SmartLinkEvaluationResult } from './SmartLinkCrawler.js';
import { useSelector } from 'react-redux';
import {
  selectSubTypeProperties,
  selectSubTypePropertyRecord,
} from '@/app/selectors/subTypeSelectors.js';
import { GlossaryEntry, GlossaryNode } from '../../../../shared/types/index.js';
import { useEffect, useMemo, useState } from 'react';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import { ArrowRight } from '@mui/icons-material';
import { Backlink } from './SyncWorkspace.js';
import { returnTool } from '@/app/thunks/toolThunks.js';
import _, { cloneDeep, get, set } from 'lodash';
import { useModalActions } from '@/hooks/global/useModal.js';
import {
  SubTypeCompoundProperty,
  SubTypeDropdownProperty,
} from '@/app/slice/subTypeSlice.js';
import { dispatch } from '@/app/constants.js';
import updateEntryById from '@/app/thunks/glossary/entries/updateEntryById.js';

const ReviewSyncChanges = ({
  suggestions,
  nodes,
  backlinksFrom,
  entry,
  properties,
  glossaryId,
}: {
  suggestions: Record<string, SmartLinkEvaluationResult[]>;
  nodes: Record<string, GlossaryNode>;
  backlinksFrom: Backlink[];
  entry: GlossaryEntry;
  properties: ((SubTypeDropdownProperty | SubTypeCompoundProperty) & {
    groupId: string;
  })[];
  glossaryId: string;
}) => {
  const props = Object.fromEntries(properties.map((prop) => [prop.id, prop]));
  const [approvalMap, setApprovalMap] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const { closeModal } = useModalActions();

  const backlinkMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    backlinksFrom.forEach((link) => {
      if (!map[link.propertyId]) {
        map[link.propertyId] = [];
      }
      map[link.propertyId].push(link.targetId);
    });
    return map;
  }, [backlinksFrom]);

  useEffect(() => {
    if (!backlinkMap) return;
    if (
      Object.keys(approvalMap).length === 0 &&
      Object.keys(suggestions).length > 0
    ) {
      const initialMap: Record<string, Record<string, boolean>> = {};
      const initialOpenMap: Record<string, boolean> = {};
      Object.entries(suggestions).forEach(([propId, results]) => {
        if (initialOpenMap[propId] === undefined) {
          initialOpenMap[propId] = true;
        }
        if (initialMap[propId] === undefined) {
          initialMap[propId] = {} as Record<string, boolean>;
        }
        const dropdown = findDropdown(props[propId]);
        results.forEach((result, index) => {
          if (!backlinkMap[propId]?.includes(result.nodeId)) {
            if (dropdown === 'single') {
              initialMap[propId][result.nodeId] = index === 0;
            } else {
              initialMap[propId][result.nodeId] = true;
            }
          }
        });
      });
      setApprovalMap(initialMap);
      setOpenMap(initialOpenMap);
    }
  }, [approvalMap, suggestions, openMap]);

  function approveSmartLinks() {
    const nukedIds: string[] = [];
    const approvedLinks: Record<string, string[]> = {};
    Object.entries(approvalMap).forEach(([propId, nodeMap]) => {
      const approvedForProp: string[] = [];
      Object.entries(nodeMap).forEach(([nodeId, approved]) => {
        if (approved) {
          approvedForProp.push(nodeId);
          nukedIds.push(nodeId);
        }
      });
      if (approvedForProp.length > 0) {
        approvedLinks[propId] = approvedForProp;
      }
    });
    const groupClone = cloneDeep(entry.groups);
    Object.entries(approvedLinks).forEach(([propId, idList]) => {
      const prop = props[propId];
      if (!prop) return;
      const keypath = `${prop.groupId}.properties.${propId}.value`;
      const existingValue: any = get(groupClone, keypath);

      if (Array.isArray(existingValue)) {
        const newValue = Array.from(new Set(existingValue.concat(idList)));
        set(groupClone, keypath, newValue);
      } else {
        set(groupClone, keypath, idList[0]);
      }
    });
    dispatch(
      updateEntryById({
        glossaryId: glossaryId as string,
        entryId: entry.id,
        content: {
          groups: groupClone,
        },
        nukedIds,
      })
    );
    closeModal();
  }

  function handleCheckboxToggle(propId: string, nodeId: string) {
    function singleFix() {
      const updatedNodeMap: Record<string, boolean> = {};
      Object.keys(approvalMap[propId] || {}).forEach((id) => {
        updatedNodeMap[id] =
          id === nodeId ? !(approvalMap[propId][id] ?? false) : false;
      });
      setApprovalMap({
        ...approvalMap,
        [propId]: updatedNodeMap,
      });
    }

    function multiFix() {
      setApprovalMap({
        ...approvalMap,
        [propId]: {
          ...(approvalMap[propId] ?? {}),
          [nodeId]: !(approvalMap[propId]?.[nodeId] ?? false),
        },
      });
    }
    const dropdown = findDropdown(props[propId]);
    if (dropdown === 'single') {
      singleFix();
    } else {
      multiFix();
    }
  }

  return (
    <Box sx={{ minHeight: 750 }}>
      <Typography variant="h6" gutterBottom>
        Suggested Links
      </Typography>
      <Box sx={{ maxHeight: 700, overflowY: 'auto' }}>
        {Object.entries(suggestions).map(([propId, results], index: number) => {
          const prop = props[propId];
          if (Object.keys(approvalMap[propId] ?? {}).length === 0) return null;
          return (
            <>
              <IconButton
                size="small"
                onClick={() => {
                  setOpenMap({
                    ...openMap,
                    [propId]: !(openMap[propId] ?? false),
                  });
                }}
              >
                <ArrowRight
                  sx={{
                    transform:
                      (openMap[propId] ?? false)
                        ? 'rotate(90deg)'
                        : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </IconButton>
              <Typography component="span">{prop.name} </Typography>
              <Typography component="span">
                (
                {
                  Object.values(approvalMap[propId] ?? {}).filter(Boolean)
                    .length
                }{' '}
                /
                {
                  results.filter(
                    (result) => !backlinkMap[prop.id]?.includes(result.nodeId)
                  ).length
                }{' '}
                Selected)
              </Typography>
              <MotionBox
                sx={{ maxHeight: 200, overflowY: 'auto' }}
                key={propId + 'motionBox'}
                animate={{
                  opacity: (openMap[propId] ?? false) ? 1 : 0,
                  height: (openMap[propId] ?? false) ? 'auto' : 0,
                }}
              >
                <Box sx={{ ml: 2, mb: 2 }}>
                  {results.map((result, index) => {
                    const approved = approvalMap[propId]?.[result.nodeId];
                    if (backlinkMap[propId]?.includes(result.nodeId)) {
                      return null;
                    }
                    return (
                      <Box
                        key={result.nodeId + prop.id + 'resultTop'}
                        sx={{
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Checkbox
                          sx={{ width: 32 }}
                          checked={approved ?? false}
                          onChange={() => {
                            handleCheckboxToggle(propId, result.nodeId);
                          }}
                        />
                        <Typography>{nodes[result.nodeId].name}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              </MotionBox>
            </>
          );
        })}
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <Button variant="contained" color="success" onClick={approveSmartLinks}>
          Link Selected
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => {
            closeModal();
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewSyncChanges;

function findDropdown(
  prop: SubTypeDropdownProperty | SubTypeCompoundProperty
): 'single' | 'multi' | null {
  if (prop.inputType === 'dropdown') return prop.shape.selectType;
  if (prop.inputType === 'compound') {
    return (
      findDropdown(
        prop.shape.left as SubTypeDropdownProperty | SubTypeCompoundProperty
      ) ||
      findDropdown(
        prop.shape.right as SubTypeDropdownProperty | SubTypeCompoundProperty
      )
    );
  }
  return null;
}

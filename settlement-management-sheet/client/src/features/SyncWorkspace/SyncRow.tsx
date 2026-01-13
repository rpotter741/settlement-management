import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import {
  ArrowDownward,
  Check,
  CircleOutlined,
  TaskAlt,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Backlink } from './SyncWorkspace.js';
import { SubTypeProperty } from '@/app/slice/subTypeSlice.js';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cloneDeep, get, set } from 'lodash';
import { dispatch } from '@/app/constants.js';
import updateEntryById from '@/app/thunks/glossary/entries/updateEntryById.js';
import updateViaSyncWS from '@/app/thunks/glossary/entries/updateViaSyncWS.js';
import {
  entryTypeColors,
  entryTypeIcons,
} from '../Glossary/utils/glossaryConstants.js';
import { GlossaryNode } from '@/NIE/nie-worker.js';
import { ModifiedBacklink } from './InboundLinks.js';

const SyncRow = ({
  link,
  index,
  eligibleProps,
  nodes,
  tab,
  backlinksFrom,
  onIgnore,
  entry,
  hasOutbound,
  propsById,
}: {
  link: ModifiedBacklink;
  index: number;
  eligibleProps: SubTypeProperty[];
  nodes: Record<string, GlossaryNode>;
  tab: any;
  backlinksFrom: Backlink[];
  onIgnore: (linkId: string, targetIgnore: boolean) => void;
  entry: any;
  hasOutbound: boolean;
  propsById: Record<string, SubTypeProperty>;
}) => {
  //
  console.log(link);
  const [show, setShow] = useState(link.targetIgnore ? false : !hasOutbound);
  const [ignore, setIgnore] = useState(link.targetIgnore);

  const toggleIgnore = () => {
    onIgnore(link.id, !ignore);
    setIgnore(!ignore);
  };

  const { sourceId } = link;

  return (
    <Box
      key={link.id}
      sx={{
        py: 1,
        backgroundColor:
          index % 2 === 0 ? 'background.default' : 'background.paper',
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        flex: 1,
        flexWrap: 'wrap',
        border: 1,
      }}
    >
      <Box
        sx={{
          width: '10%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <IconButton size="small" onClick={() => setShow(!show)}>
          {show ? (
            <ArrowDownward />
          ) : (
            <ArrowDownward sx={{ transform: 'rotate(-90deg)' }} />
          )}
        </IconButton>
        <IconButton
          size="small"
          onClick={() => {
            toggleIgnore();
          }}
          color={ignore ? 'secondary' : 'default'}
        >
          {ignore ? (
            <VisibilityOff sx={{ color: 'text.disabled' }} />
          ) : (
            <Visibility sx={{ color: 'text.primary' }} />
          )}
        </IconButton>
        <Typography sx={{ mr: 1 }}></Typography>
      </Box>
      <Box sx={{ width: '30%', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          sx={{
            textAlign: 'start',
          }}
        >
          {index + 1}.
        </Typography>
        {entryTypeIcons[nodes[link.sourceId].entryType]}
        <Typography
          sx={{
            textAlign: 'start',
          }}
        >
          {link.fromNameAtLink}
        </Typography>
      </Box>

      <Typography
        sx={{
          width: '30%',
          textAlign: 'start',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          opacity: show ? 0 : 1,
          transition: 'opacity 0.3s',
        }}
      >
        {link.propertyName[0]}{' '}
        {link.propertyName.length > 1 && !show && (
          <Tooltip
            placement="right"
            arrow
            title={
              <Box>
                {link.propertyName.slice(1).map((name, idx) => (
                  <Typography key={idx}>{name}</Typography>
                ))}
              </Box>
            }
          >
            <Typography
              component="span"
              sx={{ cursor: 'default', color: 'text.secondary' }}
            >{`(+${link.propertyName.length - 1})`}</Typography>
          </Tooltip>
        )}
      </Typography>
      {/* <Typography sx={{ width: '30%', textAlign: 'start' }}>
        {isCompound ? link.propertyValue : '-'}
      </Typography> */}
      <AnimatePresence>
        <MotionBox
          initial={{
            height: link.targetIgnore || hasOutbound ? 0 : 'auto',
            opacity: link.targetIgnore || hasOutbound ? 0 : 1,
          }}
          animate={
            show
              ? { height: 'auto', opacity: 1, margin: 2 }
              : { height: 0, opacity: 0, margin: 0 }
          }
          sx={{ width: '100%' }}
        >
          <Divider sx={{ width: '100%', my: 1 }} />
          <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
            <Box
              sx={{
                width: '36%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              {eligibleProps.length > 0 && (
                <Typography>Eligible Properties</Typography>
              )}
              {eligibleProps.length === 0 ? (
                <Typography>
                  No properties assigned to reciprocate relationship.
                </Typography>
              ) : (
                eligibleProps.map((prop: SubTypeProperty) => {
                  const hasOutbound = backlinksFrom.find(
                    (bl: Backlink) =>
                      bl.propertyId === prop.id && bl.targetId === link.sourceId
                  );
                  return (
                    <Box
                      key={prop.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '80%',
                          color: hasOutbound ? 'success.main' : 'text.disabled',
                          transition: 'color 0.3s',
                        }}
                      >
                        {hasOutbound ? (
                          <TaskAlt sx={{ ml: 2 }} />
                        ) : (
                          <CircleOutlined sx={{ ml: 2 }} />
                        )}
                        <Typography
                          sx={{
                            width: '100%',
                            textAlign: 'start',
                            ml: 2,
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            color: 'text.primary',
                          }}
                        >
                          {prop.name}
                        </Typography>
                      </Box>

                      <Button
                        fullWidth
                        size="small"
                        variant="contained"
                        color={hasOutbound ? 'primary' : 'secondary'}
                        sx={{ maxWidth: '100px' }}
                        onClick={() =>
                          handleSyncClick({
                            prop,
                            hasOutbound,
                            sourceId,
                            entry,
                            tab,
                            nodes,
                          })
                        }
                      >
                        {hasOutbound ? 'Remove' : 'Link'}
                        {/* {prop.name} */}
                      </Button>
                    </Box>
                  );
                })
              )}
            </Box>
            <Divider
              // sx={{ borderColor: 'primary.main' }}
              flexItem
              orientation="vertical"
            />
            <Box
              sx={{
                width: '56%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography>Source Properties</Typography>
              {link.linkComposites.map((comp, idx) => {
                const prop = propsById[comp.propertyId];
                const isCompound = prop?.inputType === 'compound';
                return (
                  <Box
                    key={comp.linkId}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      height: 30.75,
                    }}
                  >
                    <Typography sx={{}}>
                      {propsById[comp.propertyId]?.name}:
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                      {isCompound ? comp.propertyValue : ''}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </MotionBox>
      </AnimatePresence>
    </Box>
  );
};

export default SyncRow;

function handleSyncClick({
  prop,
  hasOutbound,
  sourceId,
  entry,
  tab,
  nodes,
}: {
  prop: SubTypeProperty;
  hasOutbound: Backlink | undefined;
  sourceId: string;
  entry: any;
  tab: any;
  nodes: Record<string, GlossaryNode>;
}) {
  const entryClone = cloneDeep(entry);
  if (prop.inputType !== 'compound') {
    if (!hasOutbound) {
      console.log('adding a new link!');
      const keypath = `groups.${prop.groupId}.properties.${prop.id}.value`;
      const newValue = sourceId;
      const existingValue = cloneDeep(get(entryClone, keypath));
      if (Array.isArray(existingValue)) {
        existingValue.push(newValue);
        // deduplicate
        const newArray = existingValue.filter(
          (v, i) => existingValue.indexOf(v) === i
        );
        console.log(prop.name);
        newArray.forEach((id) => {
          console.log(nodes[id].name);
        });
        set(entryClone, keypath, newArray);

        dispatch(
          updateViaSyncWS({
            glossaryId: tab.glossaryId,
            entryId: entry.id,
            groups: entryClone.groups,
          })
        );
      } else {
        set(entryClone, keypath, newValue);
        dispatch(
          updateViaSyncWS({
            glossaryId: tab.glossaryId,
            entryId: entry.id,
            groups: entryClone.groups,
          })
        );
      }
    } else {
      console.log('removing a link :(');
      const keypath = `groups.${prop.groupId}.properties.${prop.id}.value`;
      const existingValue = cloneDeep(get(entryClone, keypath));
      if (Array.isArray(existingValue)) {
        const newArray = existingValue.filter((id) => id !== sourceId);
        set(entryClone, keypath, newArray);
        dispatch(
          updateViaSyncWS({
            glossaryId: tab.glossaryId,
            entryId: entry.id,
            groups: entryClone.groups,
          })
        );
      } else {
        // just set the keypath to null
        console.log(prop.name);
        set(entryClone, keypath, null);
        dispatch(
          updateViaSyncWS({
            glossaryId: tab.glossaryId,
            entryId: entry.id,
            groups: entryClone.groups,
          })
        );
      }
    }
  } else {
    console.log('compound click baby!');
  }
}

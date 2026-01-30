import { Box, Typography } from '@mui/material';
import { Backlink } from './SyncWorkspace.js';
import { GlossaryEntryType } from '../../../../shared/types/index.js';
import { SubTypeProperty } from '@/app/slice/subTypeSlice.js';
import { useMemo } from 'react';
import SyncRow from './SyncRow.js';
import useTypesByIds from '@/cache/entryType/typeByIds.js';
import { dispatch } from '@/app/constants.js';
import ignoreBacklinkThunk from '@/app/thunks/glossary/entries/ignoreBacklinkThunk.js';
import { Tab } from '@/app/types/TabTypes.js';

export type ModifiedBacklink = Omit<Backlink, 'propertyName'> & {
  propertyName: string[];
  linkComposites: {
    propertyId: string;
    propertyValue: any;
    linkId: string;
    isComposite: boolean;
  }[];
};

const InboundLinks = ({
  entryProperties,
  backlinksTo,
  backlinksFrom,
  answeredCount,
  unresolved,
  ignoredCount,
  tab,
  entry,
  propsById,
}: {
  entryProperties: Record<string, SubTypeProperty & { groupId: string }> | null;
  backlinksTo: Backlink[];
  backlinksFrom: Backlink[];
  answeredCount: number;
  unresolved: number;
  ignoredCount: number;
  tab: Tab;
  entry: any;
  propsById: Record<string, SubTypeProperty>;
}) => {
  const { byIdsCache, nodes } = useTypesByIds(tab.glossaryId as string);
  const idCache = byIdsCache();

  const toggleIgnore = (linkId: string, targetIgnore: boolean) => {
    dispatch(
      ignoreBacklinkThunk({
        glossaryId: tab.glossaryId as string,
        entryId: tab.id,
        linkId,
        targetIgnore,
      })
    );
  };

  const propertiesByRelationshipType: Record<string, SubTypeProperty[]> =
    useMemo(() => {
      if (!entryProperties) return {};
      return Object.values(entryProperties).reduce(
        (acc, prop) => {
          (
            (prop.inputType === 'dropdown' &&
              (prop.shape?.relationship as GlossaryEntryType[])) ||
            (prop.inputType === 'compound' &&
              prop.shape.left.inputType === 'dropdown' &&
              (prop.shape.left.shape.relationship as GlossaryEntryType[])) ||
            (prop.inputType === 'compound' &&
              prop.shape.right.inputType === 'dropdown' &&
              (prop.shape.right.shape.relationship as GlossaryEntryType[])) ||
            []
          ).forEach((relType: GlossaryEntryType) => {
            if (!acc[relType]) {
              acc[relType] = [];
            }
            acc[relType].push(prop);
          });
          return acc;
        },
        {} as Record<GlossaryEntryType, SubTypeProperty[]>
      );
    }, [entryProperties]);

  // might want to do this and consolidate multiple properties later. At least, do a check to see if it's compound. If it's not? Dope. We can just show one. If it has a compound property, then we need to split it off, I think. But there's got to be a cleaner way to do it. Maybe list all properties vertically in the row, and then have the value for each property next to it. We'll see. Think about it. Not imperative right now.
  const modifiedBacklinksTo = useMemo(() => {
    return backlinksTo.reduce(
      (acc: Record<string, ModifiedBacklink>, link) => {
        const property = propsById[link.propertyId];
        if (!property) return acc;
        if (!acc[link.sourceId]) {
          acc[link.sourceId] = {
            ...(link as Omit<Backlink, 'propertyName'>),
            propertyName: [],
            linkComposites: [],
          } as ModifiedBacklink;
        }
        acc[link.sourceId].propertyName.push(property.name);
        acc[link.sourceId].linkComposites.push({
          propertyId: link.propertyId,
          propertyValue: link.propertyValue,
          linkId: link.id,
          isComposite: property.inputType === 'compound',
        });
        return acc;
      },
      {} as Record<string, ModifiedBacklink>
    );
  }, [backlinksTo, propsById]);

  const outboundByTargetId = useMemo(() => {
    return backlinksFrom.reduce(
      (acc, link) => {
        acc[link.targetId] = link;
        return acc;
      },
      {} as Record<string, Backlink>
    );
  }, [backlinksFrom]);

  function eligibleProperties(
    entryTypes: GlossaryEntryType[]
  ): SubTypeProperty[] {
    if (!propertiesByRelationshipType) return [];
    let eligibleProps: SubTypeProperty[] = [];
    entryTypes.forEach((eType) => {
      const props = propertiesByRelationshipType[eType];
      if (props && props.length > 0) {
        eligibleProps = eligibleProps.concat(props);
      }
    });
    return eligibleProps;
  }
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // alignItems: 'start',
          // justifyContent: 'start',
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: 'start',
          }}
        >
          Inbound Backlinks
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
          <Typography
            sx={{ fontSize: '1rem', width: '15%', textAlign: 'start' }}
          >
            Total:
          </Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
            {backlinksTo.length}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
          <Typography
            sx={{ fontSize: '1rem', width: '15%', textAlign: 'start' }}
          >
            Replied:
          </Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
            {answeredCount}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
          <Typography
            sx={{ fontSize: '1rem', width: '15%', textAlign: 'start' }}
          >
            Ignored:
          </Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
            {ignoredCount}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
          <Typography
            sx={{ fontSize: '1rem', width: '15%', textAlign: 'start' }}
          >
            Unresolved:
          </Typography>
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color:
                unresolved === 0
                  ? 'success.main'
                  : unresolved > 0 && unresolved < 3
                    ? 'warning.main'
                    : 'error.main',
            }}
          >
            {unresolved}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ maxHeight: 'calc(100vh - 431px)', overflowY: 'auto' }}>
        {backlinksTo && backlinksTo.length > 0 ? (
          Object.values(modifiedBacklinksTo).map(
            (link: ModifiedBacklink, index: number) => {
              const entryType = idCache[link.sourceId];
              const eligibleProps = eligibleProperties([entryType]);
              return (
                <SyncRow
                  key={link.id}
                  link={link}
                  index={index}
                  nodes={nodes}
                  tab={tab}
                  backlinksFrom={backlinksFrom}
                  onIgnore={toggleIgnore}
                  eligibleProps={eligibleProps}
                  entry={entry}
                  hasOutbound={Boolean(outboundByTargetId[link.sourceId])}
                  propsById={propsById}
                />
              );
            }
          )
        ) : (
          <Typography>No inbound backlinks.</Typography>
        )}
      </Box>
    </>
  );
};

export default InboundLinks;

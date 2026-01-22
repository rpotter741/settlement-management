import {
  SubTypeCompoundProperty,
  SubTypeDropdownProperty,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import { Tab } from '@/app/types/TabTypes.js';
import useTypesByIds from '@/cache/entryType/typeByIds.js';
import { Box, Button, Divider, Typography } from '@mui/material';
import { get } from 'lodash';
import { useMemo } from 'react';
import { SmartSyncRule } from '../Glossary/Modals/EditSmartSyncRule.js';
import { Backlink } from './SyncWorkspace.js';
import { SmartLinkCrawler } from './SmartLinkCrawler.js';
import { s } from 'node_modules/framer-motion/dist/types.d-CtuPurYT.js';
import { useModalActions } from '@/hooks/global/useModal.js';
import { ModalQueueEntry } from '@/app/types/ModalTypes.js';
import useSnackbar from '@/hooks/global/useSnackbar.js';

const OutboundLinks = ({
  entryProperties,
  entry,
  tab,
  backlinksTo,
  backlinksFrom,
}: {
  entryProperties: Record<string, SubTypeProperty & { groupId: string }>;
  entry: Record<string, any>;
  tab: Tab;
  backlinksTo: Backlink[];
  backlinksFrom: Backlink[];
}) => {
  const { byIdsCache, nodes } = useTypesByIds(tab.glossaryId as string);
  const { showModal } = useModalActions();
  const { makeSnackbar } = useSnackbar();
  const idCache = byIdsCache();

  const relationships = useMemo(() => {
    return Object.values(entryProperties).filter(
      (prop) =>
        (prop.inputType === 'dropdown' &&
          Boolean(prop.shape?.relationship) &&
          Boolean(prop?.smartSync)) ||
        (prop.inputType === 'compound' && Boolean(prop?.smartSync))
    ) as (
      | (SubTypeDropdownProperty & { groupId: string })
      | (SubTypeCompoundProperty & { groupId: string })
    )[];
  }, [entryProperties]);

  function testSmartLink(
    property:
      | SubTypeDropdownProperty
      | (SubTypeCompoundProperty & { groupId: string })
  ) {
    if (!property.smartSync) {
      console.error('No smart sync rule defined for ', property.name);
      return;
    }
    const crawler = new SmartLinkCrawler(Object.values(nodes), backlinksTo);
    const startTime = performance.now();
    const suggestions = crawler.getSuggestions(entry.id, [property]);
    const endTime = performance.now();
    console.log(
      `Smart link crawl for property ${property.name} took ${
        endTime - startTime
      } ms`
    );

    if (Object.keys(suggestions).length > 0) {
      const modalEntry: ModalQueueEntry = {
        id: `smart-link-${property.id}-${entry.id}`,
        componentKey: 'ReviewSyncChanges',
        props: {
          suggestions,
          nodes,
          backlinksFrom,
          entry,
          properties: relationships,
          glossaryId: tab.glossaryId as string,
        },
      };
      showModal({ entry: modalEntry });
    } else {
      makeSnackbar({
        message: 'No suggestions found for this smart link.',
        type: 'info',
      });
    }
  }

  function doAllSmartLinks() {
    const crawler = new SmartLinkCrawler(Object.values(nodes), backlinksTo);
    const startTime = performance.now();
    const allSuggestions = crawler.getSuggestions(entry.id, [...relationships]);
    const endTime = performance.now();
    console.log(`Smart link crawl took ${(endTime - startTime).toFixed(9)} ms`);
    console.log(allSuggestions);
    const modalEntry: ModalQueueEntry = {
      id: 'all-smart-links',
      componentKey: 'ReviewSyncChanges',
      props: {
        suggestions: allSuggestions,
        nodes,
        backlinksFrom,
        entry,
        properties: relationships,
        glossaryId: tab.glossaryId as string,
      },
    };
    showModal({ entry: modalEntry });
  }

  console.log(relationships);

  return (
    <>
      <Typography variant="h5" sx={{ textAlign: 'start' }}>
        Outbound Backlinks
      </Typography>
      <Button fullWidth onClick={doAllSmartLinks}>
        Run All Smartlink Syncs
      </Button>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {relationships.map((property, index: number) => {
          const keypath = `groups.${property.groupId}.properties.${property.id}`;
          const entryProp = get(entry, keypath);
          console.log(entryProp.value);
          return (
            <Box
              key={property.id}
              sx={{ display: 'flex', border: 1, p: 1, position: 'relative' }}
            >
              <Typography sx={{ fontWeight: 'bold' }}>
                {index + 1}. {property.name}:
              </Typography>
              {Array.isArray(entryProp.value) ? (
                <Box sx={{ ml: 1 }}>
                  {entryProp.value.length > 0 ? (
                    entryProp.value.map((val: string, valIndex: number) => {
                      const targetNode = nodes[val];
                      return (
                        <Box
                          key={val}
                          sx={{ display: 'flex', alignItems: 'center' }}
                        >
                          <Typography sx={{ fontWeight: 'bold' }}>
                            {valIndex + 1}. {targetNode?.name}:
                          </Typography>
                        </Box>
                      );
                    })
                  ) : (
                    <Box>
                      <Typography>No linked entries.</Typography>
                    </Box>
                  )}
                </Box>
              ) : entryProp.value !== '' ? (
                <Box>
                  <Typography sx={{ ml: 2 }}>
                    {nodes[entryProp.value].name}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography>No linked entries.</Typography>
                </Box>
              )}
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ position: 'absolute', right: 8, top: 4 }}
                onClick={() => {
                  testSmartLink(property);
                }}
              >
                Run SmartLink Sync
              </Button>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default OutboundLinks;

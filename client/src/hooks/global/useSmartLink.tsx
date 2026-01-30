import useTypesByIds from '@/cache/entryType/typeByIds.js';
import { useModalActions } from './useModal.js';
import { useSelector } from 'react-redux';
import { selectEditEntryById } from '@/app/selectors/glossarySelectors.js';
import { Backlink } from '@/features/SyncWorkspace/SyncWorkspace.js';
import { selectSubTypeProperties } from '@/app/selectors/subTypeSelectors.js';
import { useCallback, useMemo } from 'react';
import {
  SubTypeCompoundProperty,
  SubTypeDropdownProperty,
} from '@/app/slice/subTypeSlice.js';
import { SmartLinkCrawler } from '@/features/SyncWorkspace/SmartLinkCrawler.js';
import { ModalQueueEntry } from '@/app/types/ModalTypes.js';
import { GlossaryEntry } from '../../../../shared/types/index.js';
import useSnackbar from './useSnackbar.js';

const useSmartLink = ({
  glossaryId,
  entryId,
}: {
  glossaryId?: string;
  entryId?: string;
}) => {
  const { nodes } = useTypesByIds(glossaryId || '');
  const { showModal } = useModalActions();
  const { makeSnackbar } = useSnackbar();

  /*
    fallback to empty string to keep react cycle happy
  */
  const entry = useSelector(
    selectEditEntryById(glossaryId || '', entryId || '')
  );

  /*
    backlinks
  */
  const backlinksTo: Backlink[] = entry?.backlinksTo ?? ([] as Backlink[]);
  const backlinksFrom: Backlink[] = entry?.backlinksFrom ?? ([] as Backlink[]);

  /*
    get all properties and compose specific entry properties
  */
  const allProperties = useSelector(selectSubTypeProperties);
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

  /*
    filter to only relationships with smart sync
  */
  const relationships = useMemo(() => {
    return Object.values(entryProperties).filter(
      (prop) =>
        (prop.inputType === 'dropdown' &&
          Boolean(prop.shape?.relationship) &&
          Boolean(prop?.smartSync)) ||
        (prop.inputType === 'compound' && Boolean(prop?.smartSync))
    ) as ((SubTypeDropdownProperty | SubTypeCompoundProperty) & {
      groupId: string;
    })[];
  }, [entryProperties]);

  const runSmartLinkSync = useCallback(() => {
    const crawler = new SmartLinkCrawler(Object.values(nodes), backlinksTo);
    if (!entry) return;
    const startTime = performance.now();
    const allSuggestions = crawler.getSuggestions(entryId as string, [
      ...relationships,
    ]);
    const endTime = performance.now();
    console.log(
      `Smart link sync completed in ${(endTime - startTime).toFixed(2)} ms`
    );
    const total = Object.values(allSuggestions).reduce(
      (acc, suggestions) => acc + suggestions.length,
      0
    );
    console.log(allSuggestions, entry.id, glossaryId);
    if (total > 0) {
      // const modalEntry: ModalQueueEntry = {
      //   id: 'all-smart-links',
      //   componentKey: 'ReviewSyncChanges',
      //   props: {
      // suggestions: allSuggestions,
      // nodes,
      // backlinksFrom,
      // entry,
      // properties: relationships,
      // glossaryId: glossaryId,
      //   },
      // };
      // showModal({ entry: modalEntry });
      const allProps = {
        suggestions: allSuggestions,
        nodes,
        backlinksFrom,
        entry,
        properties: relationships,
        glossaryId: glossaryId,
      };
      makeSnackbar({
        message: `${total} Suggestions found for ${entry.name}.`,
        duration: 10000,
        type: 'info',
        componentKey: 'SmartLinkSnackbar',
        props: {
          syncSpaceProps: allProps,
        },
      });
    } else {
      console.log('No smart link suggestions found.');
    }
  }, [
    backlinksTo,
    backlinksFrom,
    entry,
    entryId,
    glossaryId,
    nodes,
    relationships,
    showModal,
  ]);

  return {
    runSmartLinkSync,
  };
};

export default useSmartLink;

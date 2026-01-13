import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import { addGlossaryEntry } from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { GlossaryEntry, GlossaryEntryType, GlossaryNode } from 'types/index.js';
import pushToMap from '@/utility/dataTransformation/pushToMap.js';

export interface InheritanceMap {
  entryTypeMap: Partial<Record<GlossaryEntryType, string[]>>;
  relationships: Record<string, 'parent' | 'sibling' | 'extended'>;
}

export default function getContextualNodesForOptions({
  node,
  glossaryId,
}: {
  glossaryId: string;
  node: GlossaryNode;
}): AppThunk {
  return (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const nodeStructure =
        getState().glossary.glossaries.edit.byId[glossaryId].nodes;
      if (!nodeStructure) {
        throw new Error(`No nodes found for glossary ID ${glossaryId}`);
      }
      const entryTypeMap: Partial<Record<GlossaryEntryType, string[]>> = {};
      const relationships: Record<string, 'parent' | 'sibling' | 'extended'> =
        {};
      let step = 0;

      const directParent = nodeStructure[node.parentId ?? ''];
      // Traverse up for parent lineage
      let currentNode: GlossaryNode | undefined = directParent;
      while (currentNode) {
        pushToMap({
          map: entryTypeMap,
          key: currentNode.entryType,
          value: currentNode.id,
        });
        relationships[currentNode.id] =
          step === 0 ? 'parent' : step === 1 ? 'sibling' : 'extended';
        step++;
        if (!currentNode.parentId) break;
        currentNode = nodeStructure[currentNode.parentId];
      }

      // Root-level node — find other root-level nodes as siblings
      if (!node.parentId) {
        for (const otherNode of Object.values(nodeStructure)) {
          if (!otherNode.parentId && otherNode.id !== node.id) {
            pushToMap({
              map: entryTypeMap,
              key: otherNode.entryType,
              value: otherNode.id,
            });
            relationships[otherNode.id] = 'sibling';
          }
        }
      }

      // Pull siblings from immediate parent only
      for (const child of directParent?.children ?? []) {
        if (child.id !== node.id) {
          pushToMap({
            map: entryTypeMap,
            key: child.entryType,
            value: child.id,
          });
          relationships[child.id] = 'sibling';
        }
      }

      // Add aunts/uncles
      const grandparent = nodeStructure[directParent?.parentId ?? ''];
      for (const uncle of grandparent?.children ?? []) {
        if (uncle.id !== directParent.id) {
          // Aunts/Uncles
          pushToMap({
            map: entryTypeMap,
            key: uncle.entryType,
            value: uncle.id,
          });
          relationships[uncle.id] = 'extended';

          // Cousins
          for (const cousin of uncle.children ?? []) {
            if (cousin.id !== node.id && cousin.id !== directParent.id) {
              pushToMap({
                map: entryTypeMap,
                key: cousin.entryType,
                value: cousin.id,
              });
            }
            relationships[cousin.id] = 'extended';
          }
        }
      }

      return { entryTypeMap, relationships };
    } catch (error) {
      dispatch(
        showSnackbar({
          message: 'Error compiling contextual nodes. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}

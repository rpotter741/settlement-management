import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import updateEntryService from '@/services/glossary/entry/updateEntryService.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { cloneDeep, get } from 'lodash';
import { clearDirtyKeypaths } from '@/app/slice/dirtySlice.js';
import changeEntrySubTypeService from '@/services/glossary/entry/changeEntrySubTypeService.js';
import {
  updateGlossaryEntry,
  updateGlossaryNode,
} from '@/app/slice/glossarySlice.js';
import { generateFormSource } from '@/features/Glossary/utils/generatePropertyValue.js';
import { showModal } from '@/app/slice/modalSlice.js';

export default function changeEntrySubTypeThunk({
  glossaryId,
  newSubTypeId,
  entryId,
}: {
  glossaryId: string;
  newSubTypeId: string;
  entryId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const editGlossary = state.glossary.glossaries.edit.byId[glossaryId];
    const staticGlossary = state.glossary.glossaries.static.byId[glossaryId];

    if (!staticGlossary || !editGlossary) {
      dispatch(
        showSnackbar({
          message: 'Glossary not found.',
          type: 'error',
          duration: 3000,
        })
      );
      return;
    }
    const editEntry = cloneDeep(editGlossary.entries[entryId]);
    const staticEntry = cloneDeep(staticGlossary.entries[entryId]);
    if (!staticEntry || !editEntry) {
      dispatch(
        showSnackbar({
          message: 'Entry not found.',
          type: 'error',
          duration: 3000,
        })
      );
      return;
    }

    const allGroups = Object.values(cloneDeep(state.subType.groups.edit));
    const allProperties = Object.values(
      cloneDeep(state.subType.properties.edit)
    );
    const newSubType = state.subType.static[newSubTypeId];

    if (!newSubType) {
      dispatch(
        showSnackbar({
          message: 'Sub-type not found.',
          type: 'error',
          duration: 3000,
        })
      );
      return;
    }
    const { groups, primaryAnchorId, secondaryAnchorId } = generateFormSource(
      newSubType,
      allGroups,
      allProperties
    );

    const allEditProperties: Record<string, any> = {};
    Object.values(editEntry.groups).forEach((group: any) => {
      Object.values(group.properties).forEach(
        (p: any) => (allEditProperties[p.id] = p)
      );
    });
    const allNewProperties: Record<string, any> = {};
    Object.values(groups).forEach((group: any) => {
      Object.values(group.properties).forEach(
        (p: any) => (allNewProperties[p.id] = p)
      );
    });

    let preserved: String[] = [];
    let removed: String[] = [];

    Object.keys(allEditProperties).forEach((pId) => {
      if (allNewProperties[pId]) {
        preserved.push(allEditProperties[pId].name);
      } else {
        removed.push(allEditProperties[pId].name);
      }
    });

    Object.values(groups).forEach((group: any) => {
      Object.values(group.properties).forEach((property: any) => {
        if (allEditProperties[property.id]) {
          // retain existing value
          property.value = allEditProperties[property.id].value;
          if (property.order) {
            property.order = allEditProperties[property.id].order;
          }
          if (primaryAnchorId === property.id) {
            editEntry.primaryAnchorValue = property.value;
          }
          if (secondaryAnchorId === property.id) {
            editEntry.secondaryAnchorValue = property.value;
          }
        }
      });
    });

    // merge what's important
    editEntry.primaryAnchorId = primaryAnchorId;
    editEntry.secondaryAnchorId = secondaryAnchorId;
    editEntry.subTypeId = newSubTypeId;
    editEntry.groups = groups;

    dispatch(
      showModal({
        componentKey: 'ConfirmChangeEntrySubType',
        props: {
          preserved,
          removed,
          updatedEntry: editEntry,
          oldEntry: staticEntry,
          newSubTypeId,
          glossaryId,
        },
      })
    );

    try {
      // await changeEntrySubTypeService({
      //   entryId,
      //   newSubTypeId,
      // }).then((res) => {
      //   // res will be the new group data for the entry, derived from it's new subType
      //   const { updates } = res;
      //   dispatch(
      //     updateGlossaryEntry({
      //       glossaryId,
      //       entryId,
      //       content: { ...updates },
      //     })
      //   );
      //   dispatch(
      //     updateGlossaryNode({
      //       glossaryId,
      //       nodeId: entryId,
      //       nodeData: { subTypeId: newSubTypeId },
      //     })
      //   );
      // });
      // no dirty keypaths to clean since this is atomic at the time of change (via the ChangeEntrySubTypeModal); on failure, we don't even get to the dispatch where things update locally, so no worries. Yeah it's not optimistic, but these are all local operations anyway. Simplicity wins here.
    } catch (error) {
      dispatch(
        showSnackbar({
          message: `Error updating ${editEntry.name}. Try again later.`,
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}

function transformEntryToSubType({
  entry,
  newSubType,
}: {
  entry: any;
  oldSubType: any;
  newSubType: any;
}) {
  const transformedEntry = cloneDeep(entry);

  // Logic to transform entry data from oldSubType to newSubType
}

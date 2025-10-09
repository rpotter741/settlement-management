import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import {
  addGlossaryEntry,
  appendEntrySubModel,
  updateGlossaryEntry,
} from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { GlossaryEntry, GlossaryEntryType, GlossaryNode } from 'types/index.js';

const ephemeralModelMap: Record<string, any> = {
  politics: {
    nations: [],
    settlements: [],
    factions: [],
    locations: [],
    resources: {},
    population: {},
    economy: {},
    cultures: {},
    customFields: {},
  },
  history: {
    events: [],
    flags: {},
    history: {},
    customFields: {},
    historyDataString: '',
  },
  geography: {
    climates: [],
    terrain: [],
    regions: [],
    landmarks: [],
    customFields: {},
  },
  relationships: {
    allies: [],
    enemies: [],
    relationships: {},
    notoriety: {},
    influence: {},
    customFields: {},
  },
  custom: null,
};

export default function getEntrySubModel({
  glossaryId,
  entryId,
  entryType,
  subModel,
}: {
  glossaryId: string;
  entryId: string;
  entryType: GlossaryEntryType;
  subModel: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    try {
      const model = await serverAction.getEntrySubModel({
        id: entryId,
        entryType,
        subModel,
      });
      if (model) {
        dispatch(
          updateGlossaryEntry({
            glossaryId,
            entryId,
            content: {
              [subModel]: model,
            },
          })
        );
      } else {
        // we know there's no model on new entries, so we can create an ephemeral entry
        const ephemeralModel = ephemeralModelMap[subModel];
        if (!ephemeralModel) {
          console.error(`No ephemeral model found for subModel: ${subModel}`);
          return;
        }
        dispatch(
          appendEntrySubModel({
            glossaryId,
            entryId,
            subModel,
            data: {
              ...ephemeralModelMap[subModel as keyof typeof ephemeralModelMap],
            },
          })
        );
      }
    } catch (error) {
      console.error('Error fetching glossary node:', error);
      dispatch(
        showSnackbar({
          message: 'Error fetching glossary node. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}

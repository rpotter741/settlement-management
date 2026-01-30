import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import {
  addSubTypeProperty,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import { getSubTypeProperties } from '@/app/commands/subtype.ts';

export default function fetchSubTypePropertiesThunk(): AppThunk {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const user = state.user;
      // i don't think we need to check existing length first, but we'll see
      const systemProperties = state.subType.properties.system.edit;
      const userProperties = state.subType.properties.user.edit;

      const properties: { user: SubTypeProperty[]; system: SubTypeProperty[] } =
        await getSubTypeProperties({
          userId: user.id ?? user.device,
          system: true,
        });

      const filteredSystem = properties.system.filter(
        (p: SubTypeProperty) => !systemProperties[p.id]
      );

      const filteredUser = properties.user.filter(
        (p: SubTypeProperty) => !userProperties[p.id]
      );

      dispatch(
        addSubTypeProperty({ properties: filteredSystem, system: true })
      );
      dispatch(addSubTypeProperty({ properties: filteredUser, system: false }));
    } catch (error) {
      console.error('Error fetching subTypes:', error);
      dispatch(
        showSnackbar({
          message: 'Error fetching subTypes. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}

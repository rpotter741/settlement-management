import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addSubType } from '@/app/slice/subTypeSlice.js';
import subTypeCommands from '@/app/commands/userSubtype.ts';
import { logger } from '@/utility/logging/logger.ts';

export default function fetchSubTypesByUserIdThunk(): AppThunk {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const systemSubTypes = state.subType.subtypes.system.edit;
      const userSubTypes = state.subType.subtypes.user.edit;

      const subTypes = await subTypeCommands.getSubTypes({
        userId: state.user.id || state.user.device,
        system: true,
      });

      const filteredSystem = subTypes.system.filter(
        (st) => !(st.id in systemSubTypes)
      );
      const filteredUser = subTypes.user.filter(
        (ut) => !(ut.id in userSubTypes)
      );

      filteredSystem.forEach((subType) => {
        dispatch(
          addSubType({
            subType,
            system: true,
          })
        );
      });
      filteredUser.forEach((subType) => {
        dispatch(
          addSubType({
            subType,
            system: false,
          })
        );
      });
    } catch (error) {
      logger.snError(
        "Hmm, couldn't fetch the subtypes. The server seems to be having a moment. Please report.",
        { error }
      );
    }
  };
}

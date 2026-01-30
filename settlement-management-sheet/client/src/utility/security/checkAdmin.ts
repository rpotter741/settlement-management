import { dispatch } from '@/app/constants.ts';
import { showSnackbar } from '@/app/slice/snackbarSlice.ts';
import store, { RootState } from '@/app/store.ts';
import { logger } from '../logging/logger.ts';

/**
 * @description Sends toast if user lacks admin permissions for system items.
 * @param {boolean} system - Whether the item is a system item.
 * @returns {boolean} - True if user has admin permissions or item is not system, false otherwise.
 **/
function checkAdmin(system: boolean): boolean {
  const state: RootState = store.getState();
  // replace with a proper permission check once implemented in backend
  const admin = state.user.role === 'admin';
  if (system && !admin) {
    logger.warn('Permission denied: User lacks admin rights for system item.', {
      userId: state.user.id,
    });
    dispatch(
      showSnackbar({
        message: 'You do not have permission to perform this action.',
        type: 'warning',
        duration: 3000,
      })
    );
    return false;
  }
  return true;
}

export default checkAdmin;

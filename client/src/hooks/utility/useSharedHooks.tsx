import useAlphaColor from '../layout/useAlphaColor.js';
import useSnackbar from '../global/useSnackbar.js';
import useDebouncedEffect from './useDebouncedEffect.js';
import { useDebounce } from './useDebounce.js';
import { ulid as newId } from 'ulid';
import { capitalize } from 'lodash';

const useSharedHooks = () => {
  const { getAlphaColor } = useAlphaColor();
  const { makeSnackbar } = useSnackbar();

  const use = {
    debounce: useDebounce,
    debouncedEffect: useDebouncedEffect,
  };

  const utils = {
    capitalize: capitalize,
    color: getAlphaColor,
    snackbar: makeSnackbar,
    makeId: () => newId(),
  };

  return {
    use,
    utils,
  };
};

export default useSharedHooks;

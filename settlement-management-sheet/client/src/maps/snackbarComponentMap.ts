import { lazy } from 'react';

const snackMap: Record<string, React.FC<any>> = {
  SmartLinkSnackbar: lazy(
    () => import('@/features/Snackbar/Custom/SmartLinkSnackbar.js')
  ),
};

export default snackMap; //because I like the name 'snackMap' (all on the floor)

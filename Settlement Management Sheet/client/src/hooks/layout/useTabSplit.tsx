import { isSplit, preventSplit } from '@/app/selectors/tabSelectors.js';
import { panelOpen } from '@/app/selectors/panelSelectors.js';
import { useMediaQuery } from '@mui/system';
import { useSelector } from 'react-redux';

const useTabSplit = () => {
  const splitTabs = useSelector(isSplit);
  const noSplit = useSelector(preventSplit);
  const sidePanelStatus = useSelector(panelOpen);
  const splitSizePx = sidePanelStatus ? '1750px' : '1450px';
  const splitSize = useMediaQuery(`(min-width: ${splitSizePx})`);
  const soloSizePx = sidePanelStatus ? '1200px' : '900px';
  const soloSize = useMediaQuery(`(max-width: ${soloSizePx})`);
  const either = splitTabs || soloSize;
  const both = splitTabs && soloSize;

  return { splitTabs, noSplit, soloSize, splitSize, either, both };
};

export default useTabSplit;

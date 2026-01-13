import {
  selectEditToolById,
  selectToolById,
} from '@/app/selectors/toolSelectors.js';
import { batchUpdateById } from '@/app/slice/toolSlice.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { SaveTarget } from '../useAutosave.js';
import { Attribute } from '../../../../../../shared/types/index.js';
import batchUpdateToolThunk from '@/app/thunks/tool/batchUpdateTool.js';
import { ToolName } from '@/app/types/ToolTypes.js';

export default function toolAutosaveConfig({
  tool,
  id,
  tabId,
  side,
  name,
}: {
  tool: ToolName;
  id: string;
  tabId: string;
  side: 'left' | 'right';
  name?: string;
}) {
  const dispatch: AppDispatch = useDispatch();
  const batchSaveFn = async () => {
    dispatch(
      batchUpdateToolThunk({
        id,
        side,
        tabId,
        tool,
      })
    );
  };
  return {
    name,
    batchSaveFn,
    intervalMs: 60000, // 1 minute default
  };
}

import React from 'react';
import ToolInput, { ToolInputConfig } from '../DynamicForm/ToolInput.js';
import { useShellContext } from '@/context/ShellContext.js';
import { useTools } from '@/hooks/useTools.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { useDebounce } from '@/hooks/useDebounce.js';
import useDebouncedEffect from '@/hooks/useDebouncedEffect.js';
import { updateTab } from '@/app/slice/sidePanelSlice.js';

interface EditNameDescriptionProps {
  fields: {
    name: ToolInputConfig;
    description: ToolInputConfig;
  };
}

const EditNameDescription: React.FC<EditNameDescriptionProps> = ({
  fields,
}) => {
  const dispatch: AppDispatch = useDispatch();

  const { tool, id, tabId, side } = useShellContext();
  const { edit, current } = useTools(tool, id);

  const debouncedEdit = useDebounce(edit, 1000);

  useDebouncedEffect(
    () => {
      if (!edit) return;
      const name = edit?.name ? edit.name.trim() : `Untitled`;
      if (edit.name !== current.name) {
        dispatch(
          updateTab({
            tabId,
            side,
            keypath: 'name',
            updates: name,
          })
        );
      }
    },
    300,
    [debouncedEdit?.name, dispatch, tabId, side]
  );
  return (
    <>
      <ToolInput
        inputConfig={fields.name}
        style={{ gridColumn: 'span 3', px: 1 }}
      />
      <ToolInput
        inputConfig={fields.description}
        style={{ gridColumn: 'span 3', px: 1 }}
        multiline
      />
    </>
  );
};

export default EditNameDescription;

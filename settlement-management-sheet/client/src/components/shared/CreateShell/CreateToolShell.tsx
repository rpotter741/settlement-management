import React from 'react';
import { Box } from '@mui/material';
import { useTools } from '@/hooks/tools/useTools.js';
import { useInitializeTool } from '@/hooks/tools/useInitializeTool.jsx';
import { ShellContext } from '@/context/ShellContext.js';
import { ToolName } from '@/app/types/ToolTypes.js';
import PageBox from '../Layout/PageBox/PageBox.js';
import { Tab } from '@/app/types/TabTypes.js';
import { useModalActions } from '@/hooks/global/useModal.js';
import useTabSplit from '@/hooks/layout/useTabSplit.js';

interface CreateShellProps {
  tab: Tab;
  initializeTool: (tool: string) => any;
  validationFields: string[];
  editComponent: React.ComponentType<any>;
  previewComponent: React.ComponentType<any>;
  checklistContent: any;
  editComponentProps?: Record<string, any>;
  previewComponentProps?: Record<string, any>;
  innerStyle?: React.CSSProperties;
}

const fullWidthTools = ['event', 'apt', 'storyThread'];

const CreateShell: React.FC<CreateShellProps> = ({
  tab,
  initializeTool,
  validationFields,
  editComponent,
  previewComponent,
  checklistContent,
  editComponentProps = {},
  previewComponentProps = {},
}) => {
  const { showModal, closeModal } = useModalActions();
  const { tool, side, id, mode, tabId } = tab;
  const { current, edit, errors } = useTools(tool as ToolName, id);

  const { errorCount } = useInitializeTool({
    tool: tool as ToolName,
    mode: tab.mode,
    id: id,
    edit: edit as any, // Cast to 'any' or the correct Tool type if known
    current: current as any, // Cast to 'any' or the correct Tool type if known
    errorData: errors,
    initializeFn: () => initializeTool(tool as ToolName),
    validationFields,
  });

  const { splitSize, soloSize, splitTabs } = useTabSplit();

  if (!current) {
    return <Box>Loading...</Box>;
  }

  if (current !== null) {
    return (
      <ShellContext.Provider
        value={{
          tool,
          id,
          tabId,
          mode,
          side,
          showModal,
          closeModal,
          tab,
        }}
      >
        <PageBox
          mode={mode}
          variant={
            fullWidthTools.includes(tool)
              ? 'fullWidth'
              : !splitTabs
                ? soloSize
                  ? 'blend'
                  : 'default'
                : splitSize
                  ? 'default'
                  : 'blend'
          }
          tabType="tool"
          minWidth={300}
        >
          {mode === 'edit'
            ? React.createElement(editComponent, {
                ...editComponentProps,
              })
            : React.createElement(previewComponent, {
                ...previewComponentProps,
              })}
        </PageBox>
      </ShellContext.Provider>
    );
  }
};

export default CreateShell;

import React, { useState } from 'react';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { Box, Typography } from '@mui/material';
import ValidationChecklist from '@/components/shared/ValidationChecklist/ValidationChecklist.jsx';
import DesktopMenu from '@/components/shared/ToolMenu/DesktopMenu.jsx';
import MobileMenu from '@/components/shared/ToolMenu/MobileMenu.jsx';
import LoadTool from '@/components/shared/LoadTool/LoadTool.jsx';
import toolServices from '@/services/toolServices.js';
import { useTools } from '@/hooks/useTools.js';
import { useInitializeTool } from '@/hooks/useInitializeTool.jsx';
import {
  initializeTool as initialize,
  revertToStatic,
} from '@/app/slice/toolSlice.js';
import { ShellContext } from '@/context/ShellContext.js';
import { useDispatch } from 'react-redux';
import { setTabDirty, updateTab } from '@/app/slice/sidePanelSlice.js';
import { useDebounce } from '@/hooks/useDebounce.jsx';
import useDebouncedEffect from '@/hooks/useDebouncedEffect.jsx';
import { ToolName } from '@/app/types/ToolTypes.js';
import { validateTool } from '@/app/slice/validationSlice.js';
import { cancelToolEdit } from '@/app/thunks/toolThunks.js';
import { AppDispatch } from '@/app/store.js';
import PageBox from '../Layout/PageBox.js';
import { Tab } from '@/app/types/SidePanelTypes.js';
import { useModalActions } from '@/hooks/useModal.js';
import { useMediaQuery } from '@mui/system';
import { size, split } from 'lodash';
import { useSelector } from 'react-redux';
import { isSplit } from '@/app/selectors/sidePanelSelectors.js';
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

const CreateShell: React.FC<CreateShellProps> = ({
  tab,
  initializeTool,
  validationFields,
  editComponent,
  previewComponent,
  checklistContent,
  editComponentProps = {},
  previewComponentProps = {},
  innerStyle = {},
}) => {
  const { showModal, closeModal } = useModalActions();
  const { tool, side, id, mode, tabId } = tab;
  const { current, edit, allIds, saveToolEdit, errors } = useTools(
    tool as ToolName,
    id
  );

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
        value={{ tool, id, mode, side, showModal, closeModal }}
      >
        <PageBox
          variant={
            tool === 'event'
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
        >
          {errorCount !== undefined && errors && current && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 20,
                height: 'auto',
                backgroundColor: 'background.paper',
                boxShadow: 4,
                borderRadius: 4,
                transition: 'transform 0.4s ease-in-out',
                zIndex: 1000,
              }}
            >
              <ValidationChecklist
                errorCount={errorCount}
                defaultExpand={
                  tab.tabExpansionState?.validationChecklist ?? false
                }
                checklistContent={checklistContent}
                errors={errors}
                tool={tool}
                side={side}
                tabId={tabId}
              />
            </Box>
          )}
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

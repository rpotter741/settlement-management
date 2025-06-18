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

  const splitSize = useMediaQuery('(min-width: 1750px)');
  const soloSize = useMediaQuery('(min-width: 1200px)');
  const splitContainer = useSelector(isSplit);
  const sizeCheck = !size && !splitContainer;

  // const handleCancel = () => {
  //   setEditMode(false);
  //   dispatch(
  //     cancelToolEdit({
  //       tool: tab.tool as ToolName,
  //       id: tab.id,
  //       tabId: tab.tabId,
  //       side: tab.side,
  //       validationFields,
  //     })
  //   );
  //   setShowModal(null);
  // };

  // const handleSave = async () => {
  //   try {
  //     await toolServices.saveTool({
  //       tool: tab.tool as ToolName,
  //       data: { ...edit },
  //     });
  //     saveToolEdit(true);
  //     setEditMode(false);
  //     dispatch(setTabDirty({ id: tab.id, isDirty: false }));
  //     dispatch(updateTab({ tabId: tab.tabId, side: tab.side, keypath: 'mode', updates: 'preview' }));
  //     dispatch(
  //       showSnackbar({ message: `${toolName} saved!`, type: 'success' })
  //     );
  //   } catch (error: any) {
  //     dispatch(showSnackbar({ message: error.message, type: 'error' }));
  //   }
  // };

  // const handlePublish = async () => {
  //   try {
  //     if (!current || !current.refId) {
  //       dispatch(
  //         showSnackbar({ message: 'No tool data to publish', type: 'error' })
  //       );
  //       return;
  //     }
  //     await toolServices.publishTool({
  //       tool,
  //       id,
  //       refId: current.refId,
  //     });
  //     dispatch(
  //       showSnackbar({ message: `${current.name} published!`, type: 'success' })
  //     );
  //   } catch (error: any) {
  //     dispatch(showSnackbar({ message: error.message, type: 'error' }));
  //   }
  // };

  // const handleAdd = async () => {
  //   const newTool = initializeTool(tool);
  //   dispatch(initialize({ tool, data: newTool }));
  // };

  // const handleEdit = () => {
  //   setEditMode(true);
  //   dispatch(updateTab({ tabId, side, keypath: 'mode', updates: 'edit' }));
  // };

  // const buttonActions = {
  //   add: () => handleAdd(),
  //   edit: () => handleEdit(),
  //   save: () => handleSave(),
  //   cancel: () => handleCancel(),
  //   publish: () => handlePublish(),
  //   loadHover: () => {},
  //   load: () => {
  //     toolServices.prefetchToolContent(tool);
  //     showModal({
  //       component: LoadTool as React.FC,
  //       props: {
  //         tool,
  //         displayName: loadDisplayName,
  //         closeModal: closeModal,
  //       },
  //     });
  //   },
  // };

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
              : !splitContainer
                ? !soloSize
                  ? 'fullWidth'
                  : 'default'
                : !splitSize
                  ? 'fullWidth'
                  : 'default'
          }
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

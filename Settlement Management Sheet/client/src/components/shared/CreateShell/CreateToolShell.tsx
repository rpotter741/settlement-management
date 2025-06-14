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

interface CreateShellProps {
  tab: Tab;
  initializeTool: (tool: string) => any;
  validationFields: string[];
  editComponent: React.ComponentType<any>;
  previewComponent: React.ComponentType<any>;
  checklistContent: any;
  editComponentProps?: Record<string, any>;
  previewComponentProps?: Record<string, any>;
  setModalContent: (content: {
    component: React.ComponentType;
    props?: Record<string, any>;
  }) => void;
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
  setModalContent,
  innerStyle = {},
}) => {
  const { tool, side, id, mode, tabId } = tab;
  const { current, edit, allIds, saveToolEdit, errors } = useTools(
    tool as ToolName,
    id
  );

  console.log(mode);

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
  const dispatch: AppDispatch = useDispatch();

  const [expanded, setExpanded] = useState(false);
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
  //     setModalContent({
  //       component: LoadTool as React.FC,
  //       props: {
  //         tool,
  //         displayName: loadDisplayName,
  //         setShowModal: setModalContent,
  //       },
  //     });
  //   },
  // };

  if (!current) {
    return <Box>Loading...</Box>;
  }

  if (current !== null) {
    return (
      <ShellContext.Provider value={{ tool, id, mode, side }}>
        <PageBox innerStyle={innerStyle}>
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
                setModalContent,
              })
            : React.createElement(previewComponent, {
                ...previewComponentProps,
                setModalContent,
              })}
        </PageBox>
      </ShellContext.Provider>
    );
  }
};

export default CreateShell;

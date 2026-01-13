import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import { ShellContext } from '@/context/ShellContext.js';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store.js';
import { Tab } from '@/app/types/TabTypes.js';
import PageBox from '../Layout/PageBox/PageBox.js';
import {
  selectActiveId,
  selectGlossaryNodes,
} from '@/app/selectors/glossarySelectors.js';
import { updateTab } from '@/app/slice/tabSlice.js';
import useNodeEditor from '@/hooks/glossary/useNodeEditor.js';
import { cloneDeep, get, set } from 'lodash';
import { useModalActions } from '@/hooks/global/useModal.js';
import useTabSplit from '@/hooks/layout/useTabSplit.js';
import { getOptionsContextMaps } from '@/utility/hasParentProperty.js';
import { selectSubTypeById } from '@/app/selectors/subTypeSelectors.js';
import updateEntryById from '@/app/thunks/glossary/entries/updateEntryById.js';
import { generateCompoundPropertyValue } from '@/features/Glossary/utils/generatePropertyValue.js';
import { useAutosave } from '@/hooks/utility/useAutosave/useAutosave.js';
import glossaryEntryAutosaveConfig from '@/hooks/utility/useAutosave/configs/glossaryEntryConfig.js';

interface CreateGlossaryShellProps {
  tab: Tab;
  editComponent?: React.ComponentType<any>;
  editComponentProps?: Record<string, any>;
  previewComponent?: React.ComponentType<any>;
  previewComponentProps?: Record<string, any>;
  pageVariant?: 'default' | 'fullWidth';
}

const CreateGlossaryShell: React.FC<CreateGlossaryShellProps> = ({
  tab,
  editComponent,
  editComponentProps,
  previewComponent,
  previewComponentProps,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { showModal, closeModal } = useModalActions();
  const { tool, id, mode, side, tabId, glossaryId, tabType } = tab;

  const updateLastSaved = (keypath: string) => {
    const lastSaved = cloneDeep(tab.viewState.lastSaved || {});
    lastSaved[keypath] = new Date().toISOString();
    dispatch(
      updateTab({
        tabId,
        keypath: 'viewState.lastUpdated',
        updates: lastSaved,
      })
    );
  };

  if (!glossaryId) return null;

  const { node, entry } = useNodeEditor(glossaryId, id);
  console.log(entry, 'entry in shell');

  const nodeStructure = useSelector(selectGlossaryNodes(glossaryId));

  const inheritanceMap = useMemo(() => {
    if (!node) return {};
    return getOptionsContextMaps({
      node,
      nodeStructure,
      includeNephews: true,
    });
  }, [node, nodeStructure]);

  const { splitSize, soloSize, splitTabs } = useTabSplit();

  const handleChange = useCallback(
    (value: any, keypath: string, nukedIds?: string[]) => {
      dispatch(
        updateEntryById({
          glossaryId,
          entryId: entry!.id,
          content: {
            [keypath]: value,
          },
          nukedIds,
        })
      );
    },
    [dispatch, glossaryId, entry]
  );

  const onAddData = useCallback(
    (sourceProperty: any, groupId: string, propertyId: string) => {
      console.log(sourceProperty, groupId, propertyId, 'onadddata');
      const newData = generateCompoundPropertyValue(sourceProperty, propertyId);
      const addition = newData.value[newData.order[0]];
      const newSource = cloneDeep(entry);
      const targetProperty: any = get(
        newSource,
        `groups.${groupId}.properties.${propertyId}`,
        null
      );

      if (!targetProperty) return;
      targetProperty.value = {
        ...targetProperty.value,
        [newData.order[0]]: addition,
      };
      targetProperty.order = [
        ...(targetProperty.order || []),
        newData.order[0],
      ];
      dispatch(
        updateEntryById({
          glossaryId,
          entryId: entry!.id,
          content: {
            [`groups.${groupId}.properties.${propertyId}`]: targetProperty,
          },
        })
      );
    },
    [dispatch, entry, glossaryId]
  );

  const onRemove = useCallback(
    (id: string, keypath: string) => {
      const newSource = cloneDeep(entry);
      const targetProperty: any = get(newSource, keypath, null);

      if (!targetProperty) return;

      targetProperty.order = (targetProperty.order || []).filter(
        (orderId: string) => orderId !== id
      );
      delete targetProperty.value[id];
      dispatch(
        updateEntryById({
          glossaryId,
          entryId: entry!.id,
          content: {
            [keypath]: targetProperty,
          },
        })
      );
    },
    [entry, glossaryId, dispatch]
  );

  const subType = useSelector(selectSubTypeById(node?.subTypeId || ''));

  useAutosave(
    glossaryEntryAutosaveConfig({
      glossaryId,
      entryId: id,
      subTypeId: node?.subTypeId || '',
      name: entry?.name || 'Glossary Entry',
    })
  );

  const shellContextValue = useMemo(
    () => ({
      tab,
      tool,
      id,
      mode,
      side,
      tabId,
      glossaryId,
      entry,
      node,
      inheritanceMap,
      updateLastSaved,
      showModal,
      closeModal,
      // for preview orchestrator
      source: entry,
      handleChange,
      onAddData,
      liveEdit: true,
      onRemove,
    }),
    [
      tab,
      tool,
      id,
      mode,
      side,
      tabId,
      glossaryId,
      entry,
      updateLastSaved,
      showModal,
      closeModal,
      node,
      inheritanceMap,
      entry,
    ]
  );

  // const getVariant = () => {
  //   if (mode === 'preview' && splitTabs) return 'fullWidth';
  // };

  if (!entry) {
    return (
      <PageBox mode={mode} variant="default">
        Loading...
      </PageBox>
    );
  }

  return (
    <ShellContext.Provider value={shellContextValue}>
      {mode === 'edit' && editComponent ? (
        React.createElement(editComponent, {
          subType,
          mode: 'preview',
          editId: node?.subTypeId || null,
          mt: 0,
          offerSubTypeChange: true,
          glossaryId,
          ...editComponentProps,
        })
      ) : mode === 'preview' && previewComponent ? (
        React.createElement(previewComponent, {
          ...previewComponentProps,
        })
      ) : (
        <div style={{ padding: '16px' }}>Yo shit is busted, bruh</div>
      )}
    </ShellContext.Provider>
  );
};

export default CreateGlossaryShell;

import { selectRelayById } from '@/app/selectors/relaySelectors.js';
import { initializeRelay, clearRelay } from '@/app/slice/relaySlice.js';
import { AppDispatch } from '@/app/store.js';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { GlossaryNode } from '../../../../../shared/types/index.js';
import useSnackbar from '@/hooks/global/useSnackbar.js';
import { useModalActions } from '@/hooks/global/useModal.js';
import { selectGlossaryTree } from '@/app/selectors/glossarySelectors.js';
import { s } from 'node_modules/framer-motion/dist/types.d-CtuPurYT.js';
import { debounce, throttle } from 'lodash';
import sortFunctions from './tableSorts.js';

export interface EntriesViewerColumnState {
  key: string;
  label: string;
  width: number;
  minWidth: number;
  canResize: boolean;
  isPinned: 'left' | 'right' | null;
  isVisible: boolean;
  position: number; // helps with reorder
  style?: React.CSSProperties;
}

export interface EntriesViewerFilterEntry {
  key: string;
  value: string | string[] | boolean;
  label?: string;
}

export interface EntriesViewerTableState {
  searchValue: string;
  sort: { key: string; direction: 'asc' | 'desc' }[];
  filters: EntriesViewerFilterEntry[];
  selected: string[];
  scroll: { x: number; y: number };
  columns: EntriesViewerColumnState[];
  pinSelectedRows: boolean;
  filterMode: 'and' | 'or';
}

export const tableInitialState: EntriesViewerTableState = {
  searchValue: '',
  sort: [{ key: 'name', direction: 'asc' }],
  filters: [],
  selected: [] as string[],
  scroll: { x: 0, y: 0 },
  columns: [
    {
      position: 0,
      key: 'select',
      label: ' ',
      width: 50,
      minWidth: 50,
      canResize: true,
      isPinned: null,
      isVisible: true,
      style: { height: 56 },
    },
    {
      position: 1,
      key: 'name',
      label: 'Name',
      width: 250,
      minWidth: 150,
      canResize: true,
      isPinned: null,
      isVisible: true,
    },
    {
      position: 2,
      key: 'icon',
      label: 'Entry Type',
      width: 100,
      minWidth: 100,
      canResize: true,
      isPinned: null,
      isVisible: true,
    },
    {
      position: 3,
      key: 'parent',
      label: 'Parent',
      width: 250,
      minWidth: 150,
      canResize: true,
      isPinned: null,
      isVisible: true,
    },
    {
      position: 4,
      key: 'children',
      label: 'Children',
      width: 100,
      minWidth: 100,
      canResize: true,
      isPinned: null,
      isVisible: true,
    },
    {
      position: 5,
      key: 'subType',
      label: 'Sub-Type',
      width: 250,
      minWidth: 150,
      canResize: true,
      isPinned: null,
      isVisible: true,
    },
  ],
  pinSelectedRows: false,
  filterMode: 'and',
};

export function selectActiveSettings(uiState: {
  [key: string]: any;
}): EntriesViewerTableState {
  return {
    searchValue:
      uiState['entries-searchValue'] || tableInitialState.searchValue,
    sort: uiState['entries-sort'] || tableInitialState.sort,
    filters: uiState['entries-filters'] || tableInitialState.filters,
    selected: uiState['entries-selected'] || tableInitialState.selected,
    scroll: uiState['entries-scroll'] || tableInitialState.scroll,
    columns: uiState['entries-columns'] || tableInitialState.columns,
    pinSelectedRows:
      uiState['entries-pinSelectedRows'] || tableInitialState.pinSelectedRows,
    filterMode: uiState['entries-filterMode'] || tableInitialState.filterMode,
  };
}

const useEntriesViewer = () => {
  const dispatch: AppDispatch = useDispatch();
  const { updateUI, ui, activeId } = useGlossaryEditor();
  const { makeSnackbar } = useSnackbar();
  const { showModal } = useModalActions();

  const { roots, nodeMap } = useSelector(selectGlossaryTree(activeId || ''));

  const [tableState, setTableState] = useState<EntriesViewerTableState>(
    selectActiveSettings(ui)
  );

  const [totalWidth, setTotalWidth] = useState(1000);

  const relayId = 'glossary-entry-children-relay';

  const relayChildren = useSelector(selectRelayById(relayId));

  const headerRef = useRef<HTMLDivElement | null>(null);
  const listOuterRef = useRef<HTMLDivElement | null>(null);

  // table height shit
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState(600);

  const rows = useMemo(() => {
    let basicRows = Object.values(nodeMap);

    // search + filters
    basicRows = basicRows.filter(
      (row) =>
        matchesSearch(row, tableState.searchValue) &&
        matchesFilters(row, tableState.filters, tableState.filterMode)
    );

    // sorting
    const sort = tableState.sort[0];
    const sortKey = sort?.key as keyof typeof sortFunctions;
    if (sortKey) {
      const sortFunction = sortFunctions[sortKey];
      basicRows.sort((a, b) =>
        sortFunction(sort.direction, [a, b], nodeMap)[0] === a ? -1 : 1
      );
    }

    // bump selected to top (optional)
    if (tableState.selected?.length && tableState.pinSelectedRows) {
      basicRows.sort(
        (a, b) =>
          (tableState.selected.includes(a.id) ? -1 : 1) -
          (tableState.selected.includes(b.id) ? -1 : 1)
      );
    }

    return basicRows;
  }, [nodeMap, tableState]);

  // for text search
  function matchesSearch(row: GlossaryNode, search: string): boolean {
    if (!search) return true;
    const lc = search.toLowerCase();
    return (
      (row.name?.toLowerCase().includes(lc) ||
        row.templateId?.toLowerCase().includes(lc)) ??
      // || nodeMap[row.parentId ?? '']?.name?.toLowerCase().includes(lc)
      false
    );
  }

  // for multi-filters
  function matchesFilters(
    row: GlossaryNode,
    filters: { key: string; value: any }[],
    filterMode: 'and' | 'or'
  ): boolean {
    if (!filters?.length) return true;
    if (filterMode === 'and') {
      return filters.every((f) => {
        const val = row[f.key as keyof GlossaryNode];
        if (Array.isArray(f.value)) {
          // multi-select
          return f.value.includes(val);
        }
        return val === f.value;
      });
    } else {
      return filters.some((f) => {
        const val = row[f.key as keyof GlossaryNode];
        if (Array.isArray(f.value)) {
          // multi-select
          return f.value.includes(val);
        }
        return val === f.value;
      });
    }
  }

  const debouncedUIUpdate = useMemo(
    () =>
      debounce((key: string, value: any) => {
        updateUI({ key: 'entries-' + key, value });
      }, 300),
    [updateUI]
  );

  function updateTableState(eUpdate: Partial<EntriesViewerTableState>) {
    const newState = { ...tableState, ...eUpdate };
    setTableState(newState);
    debouncedUIUpdate(Object.keys(eUpdate)[0], Object.values(eUpdate)[0]);
  }

  const throttledUpdate = useMemo(
    () => throttle(updateTableState, 32),
    [updateTableState]
  );

  function reorderColumns(sourceIndex: number, destinationIndex: number) {
    if (sourceIndex === destinationIndex) return;
    const oldColumns = Array.from(tableState.columns);
    const [movedColumn] = oldColumns.splice(sourceIndex, 1);
    oldColumns.splice(destinationIndex, 0, movedColumn);
    // Reassign positions
    const newColumns = oldColumns.map((col, index) => ({
      ...col,
      position: index,
    }));
    updateTableState({ columns: newColumns });
  }

  function resizeColumn(index: number, newWidth: number) {
    const newColumns = tableState.columns.map((col) => ({ ...col }));
    newColumns[index].width = newWidth;
    throttledUpdate({ columns: newColumns });
  }

  function handleChildrenMenu(children: GlossaryNode[]) {
    if (children.length === 0) {
      makeSnackbar({ message: 'No children available', type: 'info' });
      return;
    }

    if (relayChildren === undefined) {
      dispatch(initializeRelay({ id: relayId }));
    }

    const entry = {
      componentKey: 'EntriesChildrenModMenu',
      props: {
        childrenArray: children,
        relayId,
        preselected: tableState.selected ?? [],
      },
      id: 'children-menu',
    };
    showModal({ entry });
  }

  function handleRowSelect(id: string) {
    if (tableState.selected.includes(id)) {
      const newSelected = tableState.selected.filter((sid) => sid !== id);
      updateTableState({ selected: newSelected });
    } else {
      const newSelected = [...tableState.selected, id];
      updateTableState({ selected: newSelected });
    }
  }

  function addSort(key: string) {
    let newSort = tableState.sort.map((s) => ({ ...s }));
    const existingIndex = newSort.findIndex((s) => s.key === key);
    if (existingIndex !== -1) {
      if (newSort[existingIndex].direction === 'desc') {
        // Remove sort
        newSort.splice(existingIndex, 1);
      } else if (newSort[existingIndex].direction === 'asc') {
        // Toggle direction
        newSort[existingIndex].direction = 'desc';
      }
    } else {
      newSort = [{ key, direction: 'asc' }];
    }
    updateTableState({ sort: newSort });
  }

  useEffect(() => {
    if (relayChildren && relayChildren.status === 'complete') {
      const transientSelected = [...tableState.selected];
      relayChildren.data.forEach((child: any) => {
        if (child.selected) {
          if (!transientSelected.includes(child.id)) {
            transientSelected.push(child.id);
          }
        } else {
          if (transientSelected.includes(child.id)) {
            transientSelected.splice(transientSelected.indexOf(child.id), 1);
          }
        }
      });
      dispatch(clearRelay({ id: 'glossary-entry-children-relay' }));
      updateTableState({ selected: transientSelected });
    }
  }, [relayChildren]);

  useEffect(() => {
    const totalWidth = tableState.columns.reduce(
      (acc, col) => acc + col.width,
      64 //padding for the container
    );
    setTotalWidth(totalWidth);
  }, [tableState.columns]);

  useEffect(() => {
    const syncScroll = () => {
      if (headerRef.current && listOuterRef.current) {
        headerRef.current.scrollLeft = listOuterRef.current.scrollLeft;
      }
    };

    const currentRef = listOuterRef.current;
    currentRef?.addEventListener('scroll', syncScroll);

    return () => {
      currentRef?.removeEventListener('scroll', syncScroll);
    };
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerHeight(rect.height - 6);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return {
    containerRef,
    headerRef,
    listOuterRef,
    containerHeight,
    tableState,
    rows,
    nodeMap,
    totalWidth,
    updateTableState: throttledUpdate,
    reorderColumns,
    resizeColumn,
    handleChildrenMenu,
    handleRowSelect,
    addSort,
  };
};

export default useEntriesViewer;

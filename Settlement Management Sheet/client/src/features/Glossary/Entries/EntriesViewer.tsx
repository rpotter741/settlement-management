import { Box, TextField } from '@mui/material';
import GlossaryMainWrapper from '../EditGlossary/components/GlossaryMainWrapper.js';
import { VariableSizeList, FixedSizeList } from 'react-window';
import EcloreanRow from '@/components/shared/EcloreanGrid/EcloreanRow.js';
import { useSelector } from 'react-redux';
import { entryTypeIcons } from '../utils/glossaryConstants.js';
import EcloreanCell from '@/components/shared/EcloreanGrid/EcloreanCell.js';
import { panelOpen } from '@/app/selectors/panelSelectors.js';
import useEntriesViewer from './useEntriesViewer.js';
import EntryViewersHeader from './EntriesViewerHeader.js';
import { EntriesTableDragProvider } from '@/context/DnD/EntriesTableDragContext.js';
import { useState } from 'react';
import { update } from 'lodash';
import EntriesViewerToolbar from './EntriesViewerToolbar.js';

/* This is going to be a component for viewing all glossary nodes and being able to sort, filter, etc.
Basically a data management center for the world. Think of it as quick search, but with a dashboard
instead of a cmd + k interface */
const EntriesViewer = () => {
  //
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const {
    rows,
    nodeMap,
    containerRef,
    headerRef,
    listOuterRef,
    containerHeight,
    tableState,
    totalWidth,
    updateTableState,
    reorderColumns,
    resizeColumn,
    handleChildrenMenu,
    handleRowSelect,
    addSort,
  } = useEntriesViewer();

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    updateTableState({ searchValue: e.target.value });
  }

  // Adapter for react-window's ListChildComponentProps to EcloreanRowProps
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const row = rows[index];

    return (
      <EcloreanRow
        identifier={row.id}
        name={row.name || 'Unnamed'}
        parent={row?.parentId ? nodeMap[row.parentId]?.name : '-'}
        templateName={row.templateId ?? '-'}
        isLast={index === rows.length - 1}
        index={index}
        icon={entryTypeIcons[row.entryType] || null}
        children={row.children ?? []}
        onChildrenMenu={handleChildrenMenu}
        style={{
          ...style,
        }}
        selected={tableState.selected.includes(row.id)}
        onSelect={handleRowSelect}
        columnOrder={tableState.columns}
      />
    );
  };

  return (
    <GlossaryMainWrapper>
      <Box
        sx={{
          py: 2,
          px: 4,
        }}
      >
        <TextField
          label="Search"
          size="small"
          fullWidth
          onChange={handleSearchChange}
        />
        <EntriesViewerToolbar
          tableState={tableState}
          updateTableState={updateTableState}
        />
      </Box>
      <Box
        sx={{
          height: '100%',
          px: 4,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          // mx: 'auto',
        }}
      >
        <EntriesTableDragProvider>
          <EntryViewersHeader
            headerRef={headerRef}
            totalWidth={totalWidth}
            tableState={tableState}
            reorderColumns={reorderColumns}
            hoverIndex={hoverIndex}
            setHoverIndex={setHoverIndex}
            resizeColumn={resizeColumn}
            addSort={addSort}
          />
        </EntriesTableDragProvider>
        <Box ref={containerRef} sx={{ height: '100%' }}>
          <Box
            sx={{
              overflowX: 'scroll',
              height: containerHeight,
              position: 'relative',
              maxWidth: totalWidth - 62,
            }}
            className="containerForList"
          >
            <FixedSizeList
              outerRef={listOuterRef}
              height={containerHeight}
              itemCount={rows.length}
              itemSize={57}
              width={'100%'}
              overscanCount={2}
            >
              {Row}
            </FixedSizeList>
            {hoverIndex !== null && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  height: '100%',
                  width: '2px',
                  backgroundColor: 'success.main',
                  left: tableState.columns
                    .slice(0, hoverIndex + 1)
                    .reduce(
                      (acc, col) => acc + (col.isVisible ? col.width : 0),
                      0
                    ),
                  pointerEvents: 'none',
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </GlossaryMainWrapper>
  );
};

export default EntriesViewer;

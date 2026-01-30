import { Box } from '@mui/material';
import {
  EntriesViewerColumnState,
  EntriesViewerTableState,
} from './useEntriesViewer.js';
import EcloreanCell from '@/components/shared/EcloreanGrid/EcloreanCell.js';
import { DragWrapper, DropZone } from '@/components/index.js';
import { useEntriesTableDrag } from '@/context/DnD/EntriesTableDragContext.js';
import { useDrag } from 'react-dnd';
import EcloreanHeader from '@/components/shared/EcloreanGrid/EcloreanHeader.js';
import React, { useMemo, useState } from 'react';
import throttle from '@/utility/throttle.js';

interface EntryViewersHeaderProps {
  headerRef: React.RefObject<HTMLDivElement>;
  totalWidth: number;
  tableState: EntriesViewerTableState;
  reorderColumns: (fromIndex: number, toIndex: number) => void;
  hoverIndex: number | null;
  setHoverIndex: (index: number | null) => void;
  resizeColumn: (colIndex: number, newWidth: number) => void;
  addSort: (colKey: string) => void;
}

const EntryViewersHeader = ({
  headerRef,
  totalWidth,
  tableState,
  reorderColumns,
  hoverIndex,
  setHoverIndex,
  resizeColumn,
  addSort,
}: EntryViewersHeaderProps) => {
  const startResize = (e: MouseEvent, colIndex: number) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = tableState.columns[colIndex].width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(
        tableState.columns[colIndex].minWidth,
        startWidth + delta
      );
      resizeColumn(colIndex, newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const throttleResize = useMemo(() => {
    return throttle(startResize, 16);
  }, [startResize]);

  return (
    <Box
      ref={headerRef}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        border: '1px solid',
        borderRight: 'none',
        borderColor: 'secondary.main',
        flex: '0 0 auto',
        // overflowX: 'scroll',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        maxWidth: totalWidth - 62,
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {tableState.columns.map((col, index) =>
        col.isVisible ? (
          <React.Fragment key={col.key}>
            <EcloreanHeader
              width={`${col.width}px`}
              style={col.style || {}}
              index={index}
              reorderColumns={reorderColumns}
              setHoverIndex={setHoverIndex}
              hoverIndex={hoverIndex}
              onClick={() => addSort(col.key)}
              sortDirection={
                tableState.sort.find((s) => s.key === col.key)?.direction ||
                null
              }
            >
              {col.label}
            </EcloreanHeader>
            <Box
              onMouseDown={(e) => throttleResize(e as any, index)}
              sx={{
                position: 'absolute',
                top: 0,
                height: '100%',
                width: '6px',
                backgroundColor: 'transparent',
                left:
                  tableState.columns
                    .slice(0, index + 1)
                    .reduce(
                      (acc, col) => acc + (col.isVisible ? col.width : 0),
                      0
                    ) - 3,
                cursor: 'col-resize',
                zIndex: 20,
              }}
            />
          </React.Fragment>
        ) : null
      )}
      {hoverIndex !== null && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            height: '100%',
            width: '2px',
            backgroundColor: 'success.main',
            left:
              tableState.columns
                .slice(0, hoverIndex + 1)
                .reduce(
                  (acc, col) => acc + (col.isVisible ? col.width : 0),
                  0
                ) - 1,
            pointerEvents: 'none',
          }}
        />
      )}
    </Box>
  );
};

export default EntryViewersHeader;

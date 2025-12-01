import React from 'react';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import { GenericObject } from '../../../../../shared/types/common.js';
import { useState } from 'react';
import MotionBox from '../Layout/Motion/MotionBox.js';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { AnimatePresence } from 'framer-motion';

interface Column {
  label?: string;
  component: React.ComponentType<any>;
  props: any;
  flex?: number | string;
  width?: string;
}

export interface Row {
  id: string;
  cells: Array<{
    component?: React.ComponentType<any>;
    props?: GenericObject;
  }>;
  expandedComponent?: React.ComponentType<any>;
  expandedProps?: GenericObject;
}

interface EcloreanGridProps {
  rows: Row[];
  columns: Column[];
  canExpand?: boolean;
}

const borderStyle = {
  borderBottom: '1px solid',
  borderColor: 'divider',
};

const rightBorderStyle = {
  borderRight: '1px solid',
  borderColor: 'divider',
};

/*
Alright, so this is going to be a main component, and then the buttons will call a state changer from the
parent component that will effectively hide this one, replacing the headers with whatever submodel
is being edited more in depth. I believe this will be the template constructor, which should be pretty neat.
Maybe go with a panel thing.

Also, we're going to have to make the editor full width no matter what

And we need sidepanel to be rendered as a drawer if width is below 900px (it'll automatically retract if it does... buttons still stay I think)
*/

const EcloreanGrid: React.FC<EcloreanGridProps> = ({
  rows,
  columns,
  canExpand,
}) => {
  //some state goes up here, but then...
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  function getRowWidth() {
    return columns.reduce((total, column) => {
      if (column.width) {
        return total + parseFloat(column.width);
      }
      return total + 100; // Default width if not specified
    }, 0);
  }

  const rowWidth = getRowWidth();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        border: '2px solid',
        borderColor: borderStyle.borderColor,
        overflowX: 'scroll',
        tableLayout: 'fixed',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          alignItems: 'start',
          ...borderStyle,
        }}
      >
        {canExpand && (
          <Box
            sx={{
              minWidth: 50,
              width: 50,
              padding: 1,
              textAlign: 'center',
              height: '100%',
            }}
          ></Box>
        )}
        {columns.map((column, index: number) => (
          <>
            <Box
              key={index}
              sx={{
                flex: column.flex ?? 1,
                padding: 1,
                height: '100%',
                width: column.width ?? 'auto',
                minWidth: column.width ?? 'auto',
              }}
            >
              {column.component ? (
                <column.component {...column.props} />
              ) : (
                column.label || 'Your shit is broken bruh'
              )}
            </Box>
            <Divider orientation="vertical" flexItem />
          </>
        ))}
      </Box>
      {rows.map((row, rowIndex: number) => (
        <MotionBox
          layoutId={`row-${rowIndex}`}
          key={rowIndex}
          sx={{ display: 'flex', flexDirection: 'column', ...borderStyle }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: rowWidth,
              alignItems: 'start',
              ...borderStyle,
            }}
          >
            {canExpand && (
              <Box
                component="td"
                sx={{
                  minWidth: 50,
                  width: 50,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {row.expandedComponent && (
                  <IconButton
                    sx={{ p: 0, m: 0 }}
                    onClick={() => {
                      setExpandedRowId(
                        expandedRowId === row.id ? null : row.id
                      );
                    }}
                  >
                    {expandedRowId === row.id ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
              </Box>
            )}
            {row.cells.map((cell, cellIndex: number) => {
              const CellComponent = cell.component || 'div';
              return (
                <>
                  <Box
                    key={cellIndex}
                    sx={{
                      flex: columns[cellIndex]?.flex ?? 1,
                      width: columns[cellIndex]?.width ?? 'auto',
                      minWidth: columns[cellIndex]?.width ?? 'auto',
                      padding: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {cell.component
                      ? React.createElement(CellComponent, { ...cell.props })
                      : null}
                  </Box>
                  <Divider orientation="vertical" flexItem />
                </>
              );
            })}
          </Box>
          <AnimatePresence mode="sync">
            {expandedRowId === row.id && row.expandedComponent ? (
              <MotionBox
                initial={{ height: 0, opacity: 0, padding: 0, scale: 0.8 }}
                animate={{
                  height: 'auto',
                  opacity: 1,
                  padding: 1,
                  scale: 1,
                }}
                exit={{ height: 0, opacity: 0, padding: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  backgroundColor: 'background.paper',
                  ...borderStyle,
                }}
              >
                {row.expandedComponent ? (
                  <row.expandedComponent {...row.expandedProps} />
                ) : null}
              </MotionBox>
            ) : null}
          </AnimatePresence>
        </MotionBox>
      ))}
    </Box>
  );
};

export default EcloreanGrid;

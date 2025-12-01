import { Box, Button, Checkbox } from '@mui/material';
import React from 'react';
import EcloreanCell from './EcloreanCell.js';
import { useModalActions } from '@/hooks/global/useModal.js';
import { GlossaryNode } from '../../../../../shared/types/index.js';
import useSnackbar from '@/hooks/global/useSnackbar.js';
import useTheming from '@/hooks/layout/useTheming.js';
import { EntriesViewerColumnState } from '@/features/Glossary/Entries/useEntriesViewer.js';
import {
  CheckCell,
  NameCell,
  IconCell,
  ParentCell,
  ChildrenCell,
  TemplateCell,
} from './cells/EntryViewerCells.js';

interface EcloreanRowProps {
  identifier: string;
  index: number;
  name: string;
  parent: string;
  children: GlossaryNode[];
  templateName: string;
  isLast: boolean;
  icon: React.ReactNode;
  borderColor?: string;
  onChildrenMenu?: (children: GlossaryNode[]) => void;
  style?: React.CSSProperties;
  selected: boolean;
  onSelect: (id: string) => void;
  columnOrder: EntriesViewerColumnState[];
}

const ColumnKeyComponentMap = {
  select: CheckCell,
  name: NameCell,
  icon: IconCell,
  parent: ParentCell,
  children: ChildrenCell,
  subType: TemplateCell,
};

const EcloreanRow: React.FC<EcloreanRowProps> = ({
  identifier,
  index,
  name,
  parent,
  children,
  templateName,
  isLast,
  icon,
  borderColor = 'secondary.main',
  onChildrenMenu,
  selected,
  onSelect,
  style = {},
  columnOrder,
}) => {
  if (index === undefined) return null;

  const { showModal, enableBackgroundClose, disableBackgroundClose } =
    useModalActions();
  const { makeSnackbar } = useSnackbar();
  const { isDarkMode, darkenColor, lightenColor, getAlphaColor } = useTheming();

  const selectedColor = isDarkMode
    ? getAlphaColor({
        color: 'secondary',
        key: 'main',
        opacity: 0.2,
      })
    : getAlphaColor({
        color: 'secondary',
        key: 'main',
        opacity: 0.2,
      });

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        borderLeft: '1px solid',
        borderBottom: '1px solid',
        borderColor,
        flex: '0 0 auto',
        ...style,
        backgroundColor: selected ? selectedColor : 'inherit',
        height: 57,
        maxHeight: 57,
        '&:hover': {
          backgroundColor: getAlphaColor({
            color: 'primary',
            key: isDarkMode ? 'light' : 'main',
            opacity: isDarkMode ? 0.3 : 0.3,
          }),
        },
      }}
    >
      {columnOrder.map((col) => {
        if (!col.isVisible) return null;
        const CellComponent =
          ColumnKeyComponentMap[col.key as keyof typeof ColumnKeyComponentMap];
        if (!CellComponent) return null;
        switch (col.key) {
          case 'select':
            return (
              //@ts-ignore
              <CellComponent
                key={col.key}
                width={col.width}
                selected={selected}
                id={identifier}
                onSelect={onSelect}
              />
            );
          case 'name':
            return (
              //@ts-ignore
              <CellComponent key={col.key} width={col.width} name={name} />
            );
          case 'icon':
            return (
              //@ts-ignore
              <CellComponent key={col.key} width={col.width} icon={icon} />
            );
          case 'parent':
            return (
              //@ts-ignore
              <CellComponent key={col.key} width={col.width} parent={parent} />
            );
          case 'children':
            return (
              //@ts-ignore
              <CellComponent
                key={col.key}
                width={col.width}
                children={children}
                onChildrenMenu={onChildrenMenu}
              />
            );
          case 'subType':
            return (
              //@ts-ignore
              <CellComponent
                key={col.key}
                width={col.width}
                templateId={templateName}
              />
            );
          default:
            return null;
        }
      })}
    </Box>
  );
};

export default EcloreanRow;

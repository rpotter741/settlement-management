import {
  generateCompoundPropertyValue,
  generateFormSource,
} from '@/features/Glossary/utils/generatePropertyValue.js';
import { Box, Divider, Menu, MenuItem, Typography } from '@mui/material';
import subTypePreviewMap from './SubTypePreviewMap.js';
import { useState } from 'react';
import updateSubTypePropertyThunk from '@/app/thunks/glossary/subtypes/updateSubTypePropertyThunk.js';

const SubTypeFormPreview = ({
  subType,
  glossaryId,
  mode,
  groupId,
  source,
  onAddData,
  handleChange,
}: {
  subType: any;
  glossaryId: string | null;
  mode: 'focus' | 'form' | 'preview';
  groupId: string & keyof typeof subType.groupData;
  source: any;
  onAddData: (sourceProperty: any, groupId: string, propertyId: string) => void;
  handleChange: ({
    gId,
    pId,
    vId,
    side,
    value,
  }: {
    gId: string;
    pId: string;
    vId?: string;
    side?: 'left' | 'right';
    value: any;
  }) => void;
}) => {
  const { groupOrder, groupData } = subType;

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    propertyId: string | null;
    propertyType?: string;
    inputType?: string;
  } | null>(null);

  const handleContextMenu = (event: MouseEvent, propertyId: string) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
      propertyId,
      propertyType: groupData[groupId].propertyData[propertyId].type,
      inputType: groupData[groupId].propertyData[propertyId].inputType,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleResizeColumn = (size: number) => {
    updateSubTypePropertyThunk({
      subTypeId: subType.id,
      groupId: groupId,
      propertyId: contextMenu?.propertyId!,
      keypath: 'columns',
      value: size,
    });
    closeContextMenu();
  };

  const { propertyData } = subType.groupData[groupId];
  return (
    <Box
      sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(4, 1fr)' }}
    >
      {subType.groupData[groupId].propertyOrder.map((pId: string) => {
        const property = subType.groupData[groupId].propertyData[pId];
        const Component = subTypePreviewMap[propertyData[pId].type];
        return (
          <Box
            key={pId}
            sx={{
              width: '100%',
              gridColumn: `span ${property.columns || 1}`,
              border: 1,
              borderColor:
                contextMenu?.propertyId === pId
                  ? 'secondary.main'
                  : 'transparent',
            }}
            onContextMenu={(e) => handleContextMenu(e as any, pId)}
          >
            {property.type === 'compound' && (
              <>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {property.name}
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </>
            )}
            <Component
              property={propertyData[pId]}
              onChange={({
                value,
                side,
                vId,
              }: {
                value: any;
                side?: 'left' | 'right';
                vId?: string;
              }) =>
                handleChange({
                  gId: groupId,
                  pId,
                  vId,
                  side,
                  value,
                })
              }
              isPreview={false}
              source={source.groups?.[groupId]?.properties?.[pId] ?? {}}
              onAddData={() =>
                onAddData(
                  subType.groupData[groupId].propertyData[pId],
                  groupId,
                  pId
                )
              }
              columns={property.columns || 1}
            />
            {property.type === 'compound' && <Divider sx={{ my: 2 }} />}
          </Box>
        );
      })}
      {contextMenu && (
        <Menu
          open={Boolean(contextMenu)}
          onClose={closeContextMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ px: 2, pt: 1, cursor: 'default' }}
            >
              Width:
            </Typography>
            <Divider sx={{ my: 1 }} />
            <MenuItem
              disabled={
                contextMenu.inputType === 'richtext' ||
                contextMenu.propertyType === 'compound'
              }
              onClick={() => handleResizeColumn(1)}
            >
              Small
            </MenuItem>
            <MenuItem
              disabled={contextMenu.inputType === 'richtext'}
              onClick={() => handleResizeColumn(2)}
            >
              Medium
            </MenuItem>
            <MenuItem onClick={() => handleResizeColumn(4)}>Large</MenuItem>
          </Box>
        </Menu>
      )}
    </Box>
  );
};

export default SubTypeFormPreview;

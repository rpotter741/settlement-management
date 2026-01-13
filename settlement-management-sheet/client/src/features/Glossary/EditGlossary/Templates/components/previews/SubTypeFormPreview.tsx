import {
  generateCompoundPropertyValue,
  generateFormSource,
} from '@/features/Glossary/utils/generatePropertyValue.js';
import { Box, Divider, Menu, MenuItem, Typography } from '@mui/material';
import subTypePreviewMap from './SubTypePreviewMap.jsx';
import { useMemo, useState } from 'react';
import {
  SubType,
  SubTypeGroup,
  SubTypeProperty,
  SubTypePropertyLink,
} from '@/app/slice/subTypeSlice.js';
import { SubTypeModes } from '@/features/SidePanel/Glossary/SubTypeManager/SubTypeSidebarOrchestrator.js';
import { updateSubTypeGroupThunk } from '@/app/thunks/glossary/subtypes/groups/updateSubTypeGroupThunk.js';
import { dispatch } from '@/app/constants.js';
import { useSelector } from 'react-redux';
import { selectSubTypeProperties } from '@/app/selectors/subTypeSelectors.js';
import { cloneDeep, get } from 'lodash';
// import updateSubTypePropertyThunk from '@/app/thunks/glossary/subtypes/updateSubTypePropertyThunk.js';

const SubTypeFormPreview = ({
  glossaryId,
  mode,
  group,
  source,
  onAddData,
  handleChange,
  onRemove,
  disableResize = false,
  liveEdit = false,
  subType,
}: {
  glossaryId: string | null;
  mode: SubTypeModes;
  group: SubTypeGroup;
  source: any;
  onAddData: (sourceProperty: any, groupId: string, propertyId: string) => void;
  handleChange: (value: any, keypath: string) => void;
  onRemove: (groupId: string, propertyId: string, id: string) => void;
  disableResize?: boolean;
  liveEdit?: boolean;
  subType?: SubType;
}) => {
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    propertyId: string | null;
    propertyType?: string;
    inputType?: string;
  } | null>(null);

  const allProperties = useSelector(selectSubTypeProperties);
  const { properties } = group;

  const handleContextMenu = (event: MouseEvent, property: SubTypeProperty) => {
    event.preventDefault();

    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
      propertyId: property.id,
      propertyType: property.inputType,
      inputType: property.shape.inputType as string,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleResizeColumn = (size: number, propertyId: string) => {
    dispatch(
      updateSubTypeGroupThunk({
        groupId: group.id,
        updates: {
          display: {
            ...group.display,
            [propertyId]: {
              ...group.display[propertyId],
              columns: size,
            },
          },
        },
      })
    );
    closeContextMenu();
  };

  const sortedProperties = useMemo(() => {
    return cloneDeep(properties).sort((a, b) => {
      return a.order - b.order;
    });
  }, [properties]);

  // because when we pull, they're not automatically sorted by order

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'repeat(4, 1fr)',
        alignItems: 'center',
      }}
    >
      {sortedProperties?.map((propertyLink: SubTypePropertyLink) => {
        const property = allProperties.find(
          (p) => p.id === propertyLink.propertyId
        )! as SubTypeProperty;
        const Component = subTypePreviewMap[property.inputType];
        const keypath = `groups.${group.id}.properties.${property.id}`;
        const value = get(source, `${keypath}`, undefined);
        const isAnchor =
          subType?.anchors?.primary === property.id ||
          subType?.anchors?.secondary === property.id;
        return (
          <Box
            key={property.id}
            sx={{
              width: '100%',
              gridColumn: `span ${group.display?.[property.id]?.columns || 4}`,
              border: 1,
              borderColor: liveEdit
                ? 'transparent'
                : contextMenu?.propertyId === property.id
                  ? 'secondary.main'
                  : 'transparent',
            }}
            onContextMenu={(e) => {
              if (disableResize) return;
              handleContextMenu(e as any, property);
            }}
          >
            {property.type === 'compound' && (
              <>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {property.name}
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </>
            )}
            <Box sx={{ py: 0.5 }}>
              <Component
                property={property}
                onChange={handleChange}
                isPreview={false}
                source={value}
                onAddData={() => {
                  onAddData(property, group.id, property.id);
                }}
                columns={group.display?.[property.id]?.columns || 4}
                keypath={keypath}
                onRemove={onRemove}
                liveEdit={liveEdit}
                glossaryId={glossaryId}
                isAnchor={isAnchor}
              />
            </Box>
            {property.type === 'compound' && <Divider sx={{ my: 2 }} />}
          </Box>
        );
      })}
      {contextMenu && !disableResize && !liveEdit && (
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
                contextMenu.propertyType === 'compound' ||
                contextMenu.propertyType === 'range'
              }
              onClick={() => handleResizeColumn(1, contextMenu.propertyId!)}
            >
              Small
            </MenuItem>
            <MenuItem
              disabled={
                contextMenu.inputType === 'richtext' ||
                contextMenu.propertyType === 'compound'
              }
              onClick={() => handleResizeColumn(2, contextMenu.propertyId!)}
            >
              Medium
            </MenuItem>
            <MenuItem
              onClick={() => handleResizeColumn(4, contextMenu.propertyId!)}
            >
              Large
            </MenuItem>
          </Box>
        </Menu>
      )}
    </Box>
  );
};

export default SubTypeFormPreview;

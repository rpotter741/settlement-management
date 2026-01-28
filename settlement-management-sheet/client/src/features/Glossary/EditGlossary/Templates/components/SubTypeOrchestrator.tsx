import {
  selectAllSubTypes,
  selectSubTypeGroups,
  selectSubTypeProperties,
} from '@/app/selectors/subTypeSelectors.js';
import { SubType } from '@/app/slice/subTypeSlice.js';
import NameEditor from '@/components/shared/DynamicForm/NameEditor.js';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import useDebouncedFieldEdit from '@/hooks/global/useDebouncedFieldEdit.js';
import useGlobalDrag from '@/hooks/global/useGlobalDrag.js';
import useGlobalDragUI from '@/hooks/global/useGlobalDragUI.js';
import useTheming from '@/hooks/layout/useTheming.js';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SubTypeAnchorSelect from './inputs/SubTypeAnchorSelect.js';
import { dispatch } from '@/app/constants.js';
import { addGroupToSubTypeThunk } from '@/app/thunks/glossary/subtypes/schemas/addGroupToSubTypeThunk.js';
import SidebarGroup from '@/features/SidePanel/Glossary/SubTypeManager/components/SidebarGroup.js';
import DraggableGroupEntry from './DnD/DraggableGroupEntry.js';
import SubTypeSelect from '@/features/SidePanel/Glossary/SubTypeManager/SubTypeSelect.js';
import SubTypeTypeSelect from './SubTypeTypeSelect.js';
import ChangeSubTypeSelect from './inputs/ChangeSubTypeSelect.js';
import ChangeSubTypeTypeSelect from './inputs/ChangeSubTypeTypeSelect.js';
import { generateFormSource } from '@/features/Glossary/utils/generatePropertyValue.js';
import useSubTypeOrchestrator from '../hooks/useSubTypeOrchestrator.js';
import { cloneDeep } from 'lodash';
import { updateSubTypeAnchorThunk } from '@/app/thunks/glossary/subtypes/schemas/updateSubTypeAnchorThunk.js';
import { updateSubTypeNameThunk } from '@/app/thunks/glossary/subtypes/schemas/updateSubTypeNameThunk.js';
import capitalize from '@/utility/inputs/capitalize.js';
import SubTypeDropdownPreview from './previews/SubTypeDropdownPreview.js';
import { updateSubTypeContextThunk } from '@/app/thunks/glossary/subtypes/schemas/updateSubTypeContextThunk.js';

const SubTypeOrchestrator = ({
  subtype,
  deselectSubType,
}: {
  subtype: SubType | null;
  deselectSubType: () => void;
}) => {
  const { source, allGroups, allProperties, anchorOptions } =
    useSubTypeOrchestrator({ subtype });

  const { getAlphaColor, lightenColor } = useTheming();

  // state for form preview
  const [localPreview, setLocalPreview] = useState(false);

  //state for dnd interactions
  const { hoverIndex, setHoverIndex, hoverColor } = useGlobalDragUI();

  //state for flat-access properties
  const { value: desc, handleChange: setDesc } = useDebouncedFieldEdit({
    source: subtype?.description || '',
    updateFn: (value: string) => {},
    deps: [subtype?.description, subtype?.id],
  });

  const { ref, matchesDragType, draggedType, isDragging } = useGlobalDrag({
    interaction: 'drop',
    types: ['subtype-group', 'subtype-group-reorder'],
    onDrop: (item) => {
      if (!subtype) return;
      dispatch(
        addGroupToSubTypeThunk({
          groupId: item.groupId,
          subtypeId: subtype.id,
        })
      );
    },
    onHover: (item, monitor) => {
      setHoverIndex(subtype?.groups?.length ?? 0);
    },
    index: subtype?.groups?.length ?? 0,
  });

  useEffect(() => {
    if (!isDragging && hoverIndex !== null) {
      setHoverIndex(null);
    }
  }, [isDragging, hoverIndex, setHoverIndex]);

  if (!subtype) {
    return <Typography>No SubType Selected</Typography>;
  }

  const contextPropertyRef = allProperties.find(
    (prop) => prop.name === `${capitalize(subtype.entryType)} Type`
  );
  const contextProperty = cloneDeep(contextPropertyRef) || {
    shape: {
      selectType: 'single',
    },
    name: 'Context Pointer',
  };
  //@ts-ignore
  contextProperty.shape.selectType = 'multi';
  contextProperty.name = 'Context Pointer';

  return (
    <MotionBox
      sx={{ mt: 4, px: 4, maxWidth: 800, height: '100%', minWidth: 765 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          my: 2,
        }}
      >
        <NameEditor
          defaultValue={subtype?.name || ''}
          handleSave={(name: string) => {
            if (name === subtype?.name) return;
            dispatch(
              updateSubTypeNameThunk({
                subtypeId: subtype.id,
                name,
              })
            );
          }}
          label="Name"
        />
        <ChangeSubTypeTypeSelect editId={subtype?.id || ''} disabled={false} />
      </Box>
      {!subtype.isGeneric && (
        <Box sx={{ mb: 2 }}>
          <SubTypeDropdownPreview
            property={contextProperty}
            onChange={(value, keypath) => {
              dispatch(
                updateSubTypeContextThunk({
                  subtypeId: subtype.id,
                  context: Array.isArray(value) ? value : [value],
                })
              );
            }}
            isPreview={false}
            source={{ name: 'Context', value: subtype.context, id: subtype.id }}
            keypath="context"
            liveEdit={true}
            glossaryId={null}
          />
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <SubTypeAnchorSelect
          handleAnchorChange={(propertyId: string) => {
            const anchors = cloneDeep(subtype.anchors || {});
            anchors.primary = propertyId;
            dispatch(
              updateSubTypeAnchorThunk({
                subtypeId: subtype.id,
                anchors,
              })
            );
          }}
          subType={subtype}
          semanticAnchors={anchorOptions.filter(
            (option) => option.value !== subtype.anchors?.secondary
          )}
          type="primary"
        />

        <SubTypeAnchorSelect
          handleAnchorChange={(propertyId: string) => {
            const anchors = cloneDeep(subtype.anchors || {});
            anchors.secondary = propertyId;
            dispatch(
              updateSubTypeAnchorThunk({
                subtypeId: subtype.id,
                anchors,
              })
            );
          }}
          subType={subtype}
          semanticAnchors={anchorOptions.filter(
            (option) => option.value !== subtype.anchors?.primary
          )}
          type="secondary"
        />
      </Box>
      <TextField
        sx={{ mt: 2 }}
        fullWidth
        placeholder="Enter a description..."
        size="small"
        value={desc}
        multiline
        rows={4}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        onChange={(e) => setDesc(e.target.value)}
      />
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6"> Groups </Typography>
      {subtype?.groups.map((groupLink, index) => {
        const group = allGroups.find((g) => g.id === groupLink.groupId);
        if (!group) return null;
        return (
          <DraggableGroupEntry
            key={group.id}
            group={group}
            subtype={subtype}
            index={index}
            hoverIndex={hoverIndex}
            setHoverIndex={setHoverIndex}
            groupLinkId={groupLink.id}
          />
        );
      })}
      {subtype.groups.length < 5 && (
        <Box
          sx={{
            height: '45px',
            width: '100%',
            mt: 2,
            border: 1,
            borderColor: matchesDragType ? 'primary.main' : 'transparent',
            borderStyle: 'dashed',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:
              hoverIndex === subtype.groups.length
                ? getAlphaColor({
                    color: 'success',
                    key: 'light',
                    opacity: 0.3,
                  })
                : 'transparent',
          }}
          ref={ref}
        />
      )}
    </MotionBox>
  );
};

export default SubTypeOrchestrator;

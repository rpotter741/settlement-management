import React, { useEffect, useState } from 'react';
import DragWrapper from './DragWrapper.js';
import {
  Box,
  Button,
  Typography,
  TextField,
  Tooltip,
  Divider,
  IconButton,
  Checkbox,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import DragIndicator from '@mui/icons-material/DragIndicator';

interface DraggableListProps {
  list: { id: string; name: string; description?: string }[];
  label: string;
  type: string; // Type for the DragWrapper
  onDropEnd: (item: { id: string; name: string }, index: number) => void;
  height?: number;
  onCheck?: (checked: boolean, item: { id: string; name: string }) => void;
  onDetails?: boolean;
  selected?: { id: string; name: string }[];
}

const DraggableList: React.FC<DraggableListProps> = ({
  list,
  label,
  type,
  onDropEnd,
  height = 400,
  onCheck,
  onDetails = false,
  selected,
}) => {
  const [displayList, setDisplayList] = useState(list);

  useEffect(() => {
    setDisplayList(list);
  }, [list]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: height,
        maxHeight: height,
        p: 4,
        pt: 2,
        backgroundColor: 'background.paper',
        flexGrow: 1,
        height: '100%',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        {label}
      </Typography>
      <TextField
        sx={{ mb: 2 }}
        label="Search"
        variant="outlined"
        onChange={(e) => {
          setDisplayList(
            list.filter((item) =>
              item.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
          );
        }}
        placeholder="Search For A Settlement Type..."
        slotProps={{
          input: {
            endAdornment: (
              // @ts-ignore
              <SearchIcon sx={{ color: 'action.active', mr: 1, ml: 1 }} />
            ),
          },
        }}
      />
      <Divider />
      {displayList.map((item, index) => {
        return (
          <DragWrapper
            key={item.id}
            type={type} // Matches the DropTarget "accept" type
            item={{ id: item.id, name: item.name }}
            onDropEnd={onDropEnd}
            onReorder={() => {}}
          >
            <Box
              sx={{
                px: 1,
                my: 0.5,
                color: 'common.white',
                backgroundColor: index % 2 === 0 ? 'divider' : 'dividerDark',
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                boxShadow: 1,
                alignItems: 'center',
                height: '100%',
              }}
            >
              {/* @ts-ignore */}
              <DragIndicator sx={{ color: 'text.primary' }} />
              <Typography
                variant="body1"
                sx={{
                  gridColumn: 'span 5',
                  color: 'text.primary',
                }}
              >
                {item.name}
              </Typography>
              {onDetails && (
                <Tooltip
                  title={`${item.description} Click For More Details.`}
                  arrow
                  placement="left"
                  enterDelay={500}
                >
                  <IconButton>
                    {/* @ts-ignore */}
                    <AutoStoriesIcon
                      fontSize="small"
                      sx={{
                        color: 'success.dark',
                      }}
                    />
                  </IconButton>
                </Tooltip>
              )}
              {onCheck && (
                <Tooltip
                  title="Click To Select"
                  arrow
                  placement="right"
                  enterDelay={500}
                >
                  <Checkbox
                    checked={selected ? selected.includes(item) : false}
                    onChange={(e: any) => {
                      onCheck(e.target.checked, item);
                    }}
                  />
                </Tooltip>
              )}
            </Box>
          </DragWrapper>
        );
      })}
    </Box>
  );
};

export default DraggableList;

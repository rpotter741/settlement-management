import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import useSubTypeCreator from './hooks/useSubTypeCreator.js';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import { ArrowBack } from '@mui/icons-material';
import SidebarProperty from './components/SidebarProperty.js';
import { AnimatePresence } from 'framer-motion';
import SidebarGroup from './components/SidebarGroup.js';

const SubTypeCreator = ({
  editId,
  setEditId,
}: {
  editId: string | null;
  setEditId: (id: string | null) => void;
}) => {
  const {
    searchTerm,
    setSearchTerm,
    allSubTypes,
    filteredGroups,
    hoverIndex,
    setHoverIndex,
    hoverColor,
  } = useSubTypeCreator({
    editId,
    setEditId,
  });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          pt: 2,
        }}
      >
        <Typography variant="h6">Available Groups</Typography>
        <IconButton
          sx={{ position: 'absolute', left: 0 }}
          onClick={() => {
            setEditId(null);
          }}
        >
          <ArrowBack />
        </IconButton>
      </Box>
      <TextField
        fullWidth
        size="small"
        placeholder="Search Groups..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ my: 1 }}
      />
      {filteredGroups.map((group, index) => (
        <SidebarGroup
          key={group.id}
          index={index}
          handleGroupClick={() => {}}
          groupId={group.id}
          hoverIndex={hoverIndex}
          setHoverIndex={setHoverIndex}
          handleGroupReorder={() => {}}
        />
      ))}
    </>
  );
};

export default SubTypeCreator;

import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useModalActions } from '@/hooks/global/useModal.js';
import capitalize from '@/utility/inputs/capitalize.js';
import SubTypeSelectButton from './components/SubTypeSelectButton.js';
import { useSelector } from 'react-redux';
import { selectAllSubTypes } from '@/app/selectors/subTypeSelectors.js';
import { SubType } from '@/app/slice/subTypeSlice.js';
import useSubTypeSelectFilters from './hooks/useSubTypeSelectFilters.js';
import SubTypeSelectTypeMenu from './components/SubTypeSelectTypeMenu.js';
import SubTypeNameMenu from './components/SubTypeNameMenu.js';
import SubTypeContentMenu from './components/SubTypeContentMenu.js';
import { useRelayChannel, useRelaySub } from '@/hooks/global/useRelay.js';
import { closeModal } from '@/app/slice/modalSlice.js';
import { AnimatePresence } from 'framer-motion';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import SubTypeCreator from './SubTypeCreator.js';

const columnWidths = {
  icon: '10%',
  name: '60%',
  contentType: '30%',
};

const SubTypeSelect = ({
  editId,
  setEditId,
  onSubmit,
}: {
  editId: string | null;
  setEditId: (id: string | null) => void;
  onSubmit: (subType: any) => void;
}) => {
  const { showModal, closeModal } = useModalActions();

  const {
    filteredSubTypes,
    searchTerm,
    setSearchTerm,
    typeFilters,
    setTypeFilters,
    handleMenu,
    closeMenu,
    typeAnchor,
    setTypeSort,
    typeSort,
    nameAnchor,
    setNameSort,
    nameSort,
    contentAnchor,
    setContentSort,
    contentSort,
    contentFilters,
    setContentFilters,
  } = useSubTypeSelectFilters(editId, onSubmit);

  const onNewSubType = () => {
    const entry = {
      id: 'new-subType-id',
      componentKey: 'NameNewSubType',
      props: {},
    };
    return showModal({ entry });
  };

  const handleData = (subType: any) => {
    if (subType.cancel) return closeModal();
    onSubmit(subType);
    closeModal();
  };

  const handleButtonClick = (subType: any) => {
    onSubmit(subType);
  };

  const { data } = useRelayChannel({
    id: 'create-new-subtype',
    onComplete: handleData,
  });

  return (
    <AnimatePresence mode="popLayout">
      <MotionBox
        key="subtype-creator-box"
        layout
        layoutId="subtype-creator-box"
        initial={{ opacity: 1, scaleY: 1 }}
        animate={{
          opacity: 1,
          scaleY: editId === null ? 1 : 0,
          height: editId === null ? 'auto' : 0,
        }}
        exit={{ opacity: 0, scaleY: 0, height: 0 }}
        transition={{ duration: 0.33 }}
      >
        <Button variant="contained" fullWidth onClick={onNewSubType}>
          Create New Sub-Type
        </Button>
        <TextField
          sx={{ mt: 2 }}
          fullWidth
          size="small"
          placeholder="Search Sub-Types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: 2,
            mt: 2,
            width: '100%',
          }}
        >
          <SubTypeSelectTypeMenu
            width={columnWidths.icon}
            typeFilters={typeFilters}
            setTypeFilters={setTypeFilters}
            typeAnchor={typeAnchor}
            handleMenu={handleMenu}
            closeMenu={closeMenu}
            typeSort={typeSort}
            setTypeSort={setTypeSort}
          />
          <SubTypeNameMenu
            width={columnWidths.name}
            nameAnchor={nameAnchor}
            handleMenu={handleMenu}
            closeMenu={closeMenu}
            nameSort={nameSort}
            setNameSort={setNameSort}
          />
          <SubTypeContentMenu
            width={columnWidths.contentType}
            contentAnchor={contentAnchor}
            handleMenu={handleMenu}
            closeMenu={closeMenu}
            contentSort={contentSort}
            setContentSort={setContentSort}
            contentFilters={contentFilters}
            setContentFilters={setContentFilters}
          />
        </Box>
      </MotionBox>
      <Divider
        sx={{
          mt: 1,
          borderColor: editId ? 'transparent' : 'divider',
          transition: 'border-color 0.3s ease',
        }}
      />
      <MotionBox
        key="subtype-editor-subtype-list-box"
        layoutId="subtype-editor-subtype-list-box"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.33 }}
        sx={{ maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}
      >
        {!editId &&
          filteredSubTypes.map((subType: SubType) => (
            <SubTypeSelectButton
              key={subType.id}
              subType={subType}
              editId={editId}
              onClick={() => handleButtonClick(subType)}
            />
          ))}
      </MotionBox>
      <MotionBox
        key="subtype-editor-group-list-box"
        layoutId="subtype-editor-group-list-box"
        layout
        initial={{ opacity: editId ? 1 : 0 }}
        animate={{
          opacity: editId ? 1 : 0,
        }}
        transition={{ duration: 0.4 }}
        sx={{ py: 0, height: '70vh', overflowY: 'auto' }}
      >
        <SubTypeCreator editId={editId} setEditId={setEditId} />
      </MotionBox>
    </AnimatePresence>
  );
};

export default SubTypeSelect;

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/app/store.js';
import PageBox from '@/components/shared/Layout/PageBox/PageBox.js';
import thunks from '@/app/thunks/glossaryThunks.js';
import {
  selectActiveId,
  selectGlossaryById,
  selectSnackbar,
} from '@/app/selectors/glossarySelectors.js';

import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  ButtonGroup,
  Divider,
  Chip,
} from '@mui/material';
import { Delete, Public, Settings, Circle, Palette } from '@mui/icons-material';
import { focusedTab, isTabDirty } from '@/app/selectors/sidePanelSelectors.js';
import { setTabDirty } from '@/app/slice/sidePanelSlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { TitledCollapse } from '@/components/index.js';
import { useModalActions } from '@/hooks/useModal.js';
import { useShellContext } from '@/context/ShellContext.js';
import CustomizePalette from './forms/CustomizePalette.js';
import TabbedContent from '@/components/shared/Layout/TabbedContent/TabbedContent.js';

const EditGlossary: React.FC = () => {
  const activeId = useSelector(selectActiveId());
  if (!activeId) return;
  const glossary = useSelector(selectGlossaryById(activeId));
  const dispatch: AppDispatch = useDispatch();

  const [name, setName] = useState(glossary?.name || '');
  const [description, setDescription] = useState(glossary?.description || '');

  const [isNameDirty, setIsNameDirty] = useState(false);
  const [isDescriptionDirty, setIsDescriptionDirty] = useState(false);

  const [paletteOpen, setPaletteOpen] = useState(false);
  const { showModal } = useModalActions();

  const tabDirty = useSelector(isTabDirty(activeId));
  const focus = useSelector(focusedTab);

  useEffect(() => {
    if ((isNameDirty || isDescriptionDirty) && !tabDirty) {
      dispatch(setTabDirty({ id: activeId, isDirty: true }));
    } else if (!isNameDirty && !isDescriptionDirty && tabDirty) {
      dispatch(setTabDirty({ id: activeId, isDirty: false }));
    }
  }, [isNameDirty, isDescriptionDirty, tabDirty, activeId, dispatch]);

  useEffect(() => {
    if (glossary.name !== name) {
      setIsNameDirty(true);
    } else {
      setIsNameDirty(false);
    }
  }, [glossary.name, name]);

  useEffect(() => {
    if (glossary.description !== description) {
      setIsDescriptionDirty(true);
    } else {
      setIsDescriptionDirty(false);
    }
  }, [glossary.description, description]);

  const handleSave = () => {
    try {
      dispatch(
        thunks.updateGlossaryThunk({
          id: glossary.id,
          name,
          description,
        })
      );
      setIsNameDirty(false);
      setIsDescriptionDirty(false);
      dispatch(setTabDirty({ id: activeId, isDirty: false }));
    } catch (error: any) {
      console.error('Error updating glossary:', error);
    }
  };

  const [activeTab, setActiveTab] = useState('Overview');
  const [lastIndex, setLastIndex] = useState(0);
  const handleTabClick = (tabKey: string, index: number) => {
    setActiveTab(tabKey);
    setLastIndex(index);
  };

  const editGlossaryTabs = [
    { name: 'Overview', props: {} },
    { name: 'Terms', props: {} },
    { name: 'Settings', props: {} },
    { name: 'Palette', props: {} },
  ];

  const editGlossaryComponentMap = {
    Overview: () => (
      <Box sx={{ p: 2 }}>
        <TextField
          label="Glossary Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <Circle
                  sx={{
                    color: !isNameDirty ? 'transparent' : 'error.main',
                    fontSize: '.75rem',
                  }}
                />
              ),
            },
          }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          minRows={6}
          slotProps={{
            input: {
              endAdornment: (
                <Circle
                  sx={{
                    color: !isDescriptionDirty ? 'transparent' : 'error.main',
                    fontSize: '.75rem',
                  }}
                />
              ),
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            my: 2,
          }}
        >
          <Button
            disabled={!tabDirty}
            variant="contained"
            color={'success'}
            onClick={handleSave}
            sx={{ opacity: tabDirty ? 1 : 0 }}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            disabled={!tabDirty}
            onClick={() => {
              setName(glossary.name);
              setDescription(glossary.description);
              setIsNameDirty(false);
              setIsDescriptionDirty(false);
              dispatch(setTabDirty({ id: activeId, isDirty: false }));
            }}
            sx={{ opacity: tabDirty ? 1 : 0 }}
          >
            Reset
          </Button>
        </Box>
      </Box>
    ),
    Terms: () => <div>Terms Component</div>,
    Settings: () => <div>Settings Component</div>,
    Palette: () => <CustomizePalette column={false} />,
  };

  return (
    <PageBox
      innerStyle={{
        border: '1px solid',
        borderColor: 'primary.main',
      }}
      mode={'edit'}
    >
      <TabbedContent
        tabs={editGlossaryTabs}
        componentMap={editGlossaryComponentMap}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
        lastIndex={lastIndex}
        isTool={false}
      />
      <Button
        onClick={() => {
          const entry = {
            componentKey: 'ConfirmDeleteGlossary',
            props: {
              tab: activeTab,
              glossary,
            },
            id: `delete-glossary-${glossary.id}`,
          };
          showModal({ entry });
        }}
      >
        Delete Glossary
      </Button>
    </PageBox>
  );
};

export default EditGlossary;

// <Box sx={{ mt: 4 }}>
//   <Typography variant="h5">Configure {glossary.name}</Typography>
//   <TextField
//     label="Glossary Name"
//     variant="outlined"
//     fullWidth
//     margin="normal"
//     value={name}
//     onChange={(e) => setName(e.target.value)}
//     slotProps={{
//       input: {
//         endAdornment: (
//           <Circle
//             sx={{
//               color: !isNameDirty ? 'transparent' : 'error.main',
//               fontSize: '.75rem',
//             }}
//           />
//         ),
//       },
//     }}
//     sx={{ width: '100%' }}
//   />
//   <TextField
//     label="Description"
//     variant="outlined"
//     fullWidth
//     margin="normal"
//     value={description}
//     onChange={(e) => setDescription(e.target.value)}
//     multiline
//     minRows={6}
//     slotProps={{
//       input: {
//         endAdornment: (
//           <Circle
//             sx={{
//               color: !isDescriptionDirty ? 'transparent' : 'error.main',
//               fontSize: '.75rem',
//             }}
//           />
//         ),
//       },
//     }}
//   />
//   <Box
//     sx={{
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       my: 2,
//     }}
//   >
//     <Button
//       disabled={!tabDirty}
//       variant="contained"
//       color={'success'}
//       onClick={handleSave}
//       sx={{ opacity: tabDirty ? 1 : 0 }}
//     >
//       Save Changes
//     </Button>
//     <Button
//       variant="outlined"
//       disabled={!tabDirty}
//       onClick={() => {
//         setName(glossary.name);
//         setDescription(glossary.description);
//         setIsNameDirty(false);
//         setIsDescriptionDirty(false);
//         dispatch(setTabDirty({ id: activeId, isDirty: false }));
//       }}
//       sx={{ opacity: tabDirty ? 1 : 0 }}
//     >
//       Reset
//     </Button>
//   </Box>
//   <Divider flexItem>
//     <Chip
//       label={<Typography variant="h6">Palette Settings</Typography>}
//       icon={<Palette />}
//     />
//   </Divider>
//   <CustomizePalette column={false} />
// </Box>;

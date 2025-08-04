import { setTabDirty } from '@/app/slice/tabSlice.js';
import { AppDispatch } from '@/app/store.js';
import Editor from '@/components/shared/TipTap/Editor.js';
import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import thunks from '@/app/thunks/glossaryThunks.js';
import { Circle } from '@mui/icons-material';
import { useModalActions } from '@/hooks/global/useModal.js';
import { Tab } from '@/app/types/TabTypes.js';

const EditGlossaryOverviewTab = ({
  glossary,
  tab,
}: {
  glossary: any;
  tab: Tab;
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { showModal } = useModalActions();
  if (!glossary) return null;

  const [name, setName] = useState(glossary?.name || '');
  const [description, setDescription] = useState(
    glossary?.description.markdown || ''
  );

  const [isDescriptionDirty, setIsDescriptionDirty] = useState(false);
  const [isNameDirty, setIsNameDirty] = useState(false);

  useEffect(() => {
    if (isNameDirty) {
      dispatch(setTabDirty({ id: glossary.id, isDirty: true }));
    } else if (!isNameDirty) {
      dispatch(setTabDirty({ id: glossary.id, isDirty: false }));
    }
  }, [isNameDirty, dispatch]);

  const handleSave = () => {
    try {
      dispatch(
        thunks.updateGlossary({
          id: glossary.id,
          updates: {
            name,
          },
        })
      );
      setIsNameDirty(false);
      dispatch(setTabDirty({ id: glossary.id, isDirty: false }));
    } catch (error: any) {
      console.error('Error updating glossary:', error);
    }
  };

  useEffect(() => {
    if (glossary.name !== name) {
      setIsNameDirty(true);
    } else {
      setIsNameDirty(false);
    }
  }, [glossary.name, name]);

  const handleUpdateDescription = ({
    description,
    dataString,
  }: {
    description: string;
    dataString: string;
  }) => {
    try {
      dispatch(
        thunks.updateGlossary({
          id: glossary.id,
          updates: {
            description: {
              markdown: description,
              string: dataString,
            },
          },
        })
      );
      setIsDescriptionDirty(false);
      setDescription(description);
      if (!isNameDirty) {
        dispatch(setTabDirty({ id: glossary.id, isDirty: false }));
      }
    } catch (error: any) {
      console.error('Error updating glossary:', error);
    }
  };

  useEffect(() => {
    if (isDescriptionDirty) {
      dispatch(setTabDirty({ id: glossary.id, isDirty: true }));
    }
  }, [isDescriptionDirty]);

  return (
    <Box
      sx={{
        p: 2,
        height: '100%',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
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
      <Editor
        html={glossary.description.markdown}
        propUpdate={handleUpdateDescription}
        immediateOnChange={() => setIsDescriptionDirty(true)}
      />
      <Button
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        onClick={() => {
          const entry = {
            componentKey: 'ConfirmDeleteGlossary',
            props: {
              tab: tab,
              glossary,
            },
            id: `delete-glossary-${glossary.id}`,
          };
          showModal({ entry });
        }}
      >
        Delete Glossary
      </Button>
    </Box>
  );
};

export default EditGlossaryOverviewTab;

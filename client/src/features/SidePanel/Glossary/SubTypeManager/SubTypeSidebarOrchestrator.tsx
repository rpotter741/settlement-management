import { ArrowBack, Settings } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Typography,
  Button,
  Select,
  ButtonGroup,
} from '@mui/material';
import { useEffect, useState } from 'react';
import SubTypeSelect from './SubTypeSelect.js';
import useGlossaryManager from '@/hooks/glossary/useGlossaryManager.js';
import { useRelayChannel } from '@/hooks/global/useRelay.js';
import useTheming from '@/hooks/layout/useTheming.js';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';
import { dispatch } from '@/app/constants.js';
import fetchSubTypesByUserIdThunk from '@/app/thunks/glossary/subtypes/schemas/fetchSubTypesByUserIdThunk.ts';
import { selectSubTypeById } from '@/app/selectors/subTypeSelectors.js';
import { useSelector } from 'react-redux';
import { useModalActions } from '@/hooks/global/useModal.js';
import SubTypeSettings from './components/SubTypeSettings.js';
import { panelWidth } from '@/app/selectors/panelSelectors.js';
import { setWidth } from '@/app/slice/panelSlice.js';
import capitalize from '@/utility/inputs/capitalize.js';
import SubTypePropertyCreator from './SubTypePropertyCreator.js';
import SubTypeGroupCreator from './SubTypeGroupCreator.js';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import SubTypeCreator from './SubTypeCreator.js';

export type SubTypeModes =
  | 'property'
  | 'group'
  | 'subtype'
  | 'settings'
  | 'preview'
  | null;

const SubTypeSidebarOrchestrator = () => {
  const { ui, updateUI } = useGlossaryEditor();
  const { deselectGlossary, glossaryId } = useGlossaryManager();

  const [editing, setEditing] = useState(ui?.subType?.editing ?? false);
  const [type, setType] = useState<string>(ui?.subType?.type ?? '');
  const [editId, setEditId] = useState<string | null>(
    ui?.subType?.editId ?? null
  );
  const [mode, setMode] = useState<SubTypeModes>(
    ui?.subType?.mode ?? 'property'
  );
  const [activeProperty, setActiveProperty] = useState<string | null>(
    ui?.subType?.activeProperty ?? null
  );
  const [activeGroup, setActiveGroup] = useState<string | null>(
    ui?.subType?.activeGroup ?? null
  );
  const [subTypeId, setSubTypeId] = useState<string | null>(
    ui.subType?.subTypeId ?? null
  );

  const [showSettings, setShowSettings] = useState(false);

  // dispatch(fetchSubTypesByUserIdThunk());

  useEffect(() => {
    return () => {
      updateUI({
        key: 'subType',
        value: {
          activeGroup,
          activeProperty,
          mode,
          subTypeId,
          editing,
          type,
        },
      });
    };
  }, [activeGroup, activeProperty, mode, editId, editing, type]);

  const handleData = (data: any) => {
    if (data?.setActiveGroup !== undefined) {
      setActiveGroup(data.setActiveGroup);
    }
    if (data?.setActiveProperty !== undefined) {
      setActiveProperty(data.setActiveProperty);
    }
    if (data?.setMode !== undefined) {
      setMode(data.setMode);
    }
    if (data.isDeleting) {
      setEditId(null);
      setEditing(false);
      setType('');
      setMode('property');
      setShowSettings(false);
      updateUI({
        key: 'subType',
        value: { editId: null, editing: false },
      });
    }
  };

  const { openRelay } = useRelayChannel({
    id: 'subType-sidebar-template',
    onComplete: handleData,
    removeAfterConsume: false,
  });

  const { themeMode, getAlphaColor, darkenColor } = useTheming();
  const { showModal } = useModalActions();

  const handleBackClick = () => {
    if (editing === false) {
      deselectGlossary();
      setEditId(null);
      openRelay({ data: { clearId: true }, status: 'complete' });
    } else if (showSettings) {
      setShowSettings(false);
    } else {
      setEditing(false);
      setType('');
      setMode('property');
      setShowSettings(false);
    }
  };

  useEffect(() => {
    openRelay({
      data: { setMode: mode },
      status: 'complete',
    });
  }, [mode]);

  const onSubmit = (subType: any) => {
    openRelay({ data: { subType }, status: 'complete' });
    setEditing(true);
    setEditId(subType.id);
    setType(subType.entryType);
  };

  const subType = useSelector(selectSubTypeById(editId || ''));

  const subTypeEditorModes = ['property', 'group', 'subtype'];

  function getLeft(index: number): string {
    if (index === 0) {
      return `${index * 108}px`;
    } else return `${index * 108 + 8 * index}px`;
  }

  useEffect(() => {
    openRelay({
      data: {
        subType: {
          id: editId,
        },
      },
      status: 'complete',
    });
  }, [editId]);

  return (
    <MotionBox
      sx={{ p: 2, overflowY: 'hidden', pb: 4 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          Glossary Sub-Types
        </Typography>
      </Box>
      <Box
        sx={{
          height: '100%',
        }}
      >
        <Box
          sx={{
            mt: 2,
            mb: 2,
            gap: 2,
            width: '100%',
            justifyContent: 'center',
            display: 'flex',
            // flexDirection: 'column',
            position: 'relative',
          }}
        >
          {subTypeEditorModes.map((m) => (
            <Button
              key={m}
              variant="text"
              sx={{
                width: '100px',
                display: 'flex',
                justifyContent: 'center',
                borderRadius: 0,
                borderColor:
                  mode === m
                    ? getAlphaColor({
                        color: 'success',
                        key: 'dark',
                        opacity: 0.3,
                      })
                    : '',
                color: mode === m ? 'success.main' : 'primary.main',
                '&:hover': {
                  backgroundColor:
                    mode !== m
                      ? darkenColor({
                          color: 'background',
                          key: 'default',
                          amount: 0.2,
                        })
                      : undefined,
                  color: 'text.primary',
                },
              }}
              onClick={() => {
                setMode(m as 'property' | 'group' | 'subtype');
              }}
            >
              {capitalize(m)}
            </Button>
          ))}
          <Box
            component="span"
            sx={{
              width: '100px',
              display: 'flex',
              justifyContent: 'center',
              position: 'absolute',
              height: '36.5px',
              borderBottom: 1,
              borderColor: 'success.main',
              left: getLeft(subTypeEditorModes.indexOf(mode || 'property')),
              ml: 2,
              transition: 'left 0.3s ease',
              backgroundColor: getAlphaColor({
                color: 'success',
                key: 'dark',
                opacity: 0.3,
              }),
            }}
          />
        </Box>
        {showSettings ? (
          <SubTypeSettings subType={subType} showModal={showModal} />
        ) : (
          <>
            {mode === 'property' && (
              <SubTypePropertyCreator
                openRelay={openRelay}
                setActiveProperty={setActiveProperty}
                activeProperty={activeProperty}
              />
            )}
            {mode === 'group' && (
              <SubTypeGroupCreator
                openRelay={openRelay}
                activeGroup={activeGroup}
                setActiveGroup={setActiveGroup}
              />
            )}
            {mode === 'subtype' && (
              <SubTypeSelect
                onSubmit={onSubmit}
                editId={editId}
                setEditId={setEditId}
              />
            )}
          </>
        )}
      </Box>
    </MotionBox>
  );
};

export default SubTypeSidebarOrchestrator;

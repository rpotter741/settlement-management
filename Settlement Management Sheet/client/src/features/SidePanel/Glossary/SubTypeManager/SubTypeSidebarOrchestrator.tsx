import { ArrowBack } from '@mui/icons-material';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import GlossarySidePanelWrapper from '../GlossarySidePanelWrapper.js';
import SubTypeSelect from './SubTypeSelect.js';
import useGlossaryManager from '@/hooks/glossary/useGlossaryManager.js';
import SubTypeSidebarEditor from './SubTypeSidebarEditor.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import { useRelayChannel, useRelayPub } from '@/hooks/global/useRelay.js';
import useTheming from '@/hooks/layout/useTheming.js';
import { set } from 'lodash';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';
import { useSelector } from 'react-redux';
import { selectDirtyKeypathsByDomain } from '@/app/selectors/dirtySelectors.js';

const SubTypeSidebarOrchestrator = () => {
  const { ui, updateUI } = useGlossaryEditor();
  const { deselectGlossary, glossaryId } = useGlossaryManager();

  const [editing, setEditing] = useState(ui?.subType?.editing ?? false);
  const [type, setType] = useState<GlossaryEntryType | string>(
    ui?.subType?.type ?? ''
  );
  const [editId, setEditId] = useState<string | null>(
    ui?.subType?.editId ?? null
  );
  const [mode, setMode] = useState<'focus' | 'form' | 'preview'>(
    ui?.subType?.mode ?? 'focus'
  );
  const [activeGroup, setActiveGroup] = useState<string | null>(
    ui?.subType?.activeGroup ?? null
  );
  const [activeProperty, setActiveProperty] = useState<string | null>(
    ui?.subType?.activeProperty ?? null
  );

  const dirtyKeypaths = useSelector(
    selectDirtyKeypathsByDomain('glossary', glossaryId || '')
  );
  console.log(dirtyKeypaths);

  useEffect(() => {
    return () => {
      updateUI({
        key: 'subType',
        value: {
          activeGroup,
          activeProperty,
          mode,
          editId,
          editing,
          type,
        },
      });
    };
  }, [activeGroup, activeProperty, mode, editId, editing, type]);

  const handleData = (data: any) => {
    if (data?.setActiveGroup) {
      setActiveGroup(data.setActiveGroup);
    }
    if (data?.setActiveProperty) {
      setActiveProperty(data.setActiveProperty);
    }
    if (data?.setMode) {
      setMode(data.setMode);
    }
  };

  const { openRelay } = useRelayChannel({
    id: 'subType-sidebar-template',
    onComplete: handleData,
  });

  const { themeMode, getAlphaColor } = useTheming();

  const handleBackClick = () => {
    if (editing === false) {
      deselectGlossary();
      setEditId(null);
    } else {
      setEditing(false);
      setType('');
      setMode('focus');
    }
  };

  useEffect(() => {
    openRelay({
      data: { setMode: ui?.subType?.mode ?? 'focus' },
      status: 'complete',
    });
  }, []);

  const onSubmit = (subType: any) => {
    openRelay({ data: { subType }, status: 'complete' });
    setEditing(true);
    setEditId(subType.id);
    setType(subType.entryType);
  };

  return (
    <GlossarySidePanelWrapper>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          onClick={handleBackClick}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          Glossary Sub-Types
        </Typography>
      </Box>
      <Box
        sx={{
          height: '100%',
        }}
      >
        {/* @ts-ignore */}
        <Box component="aside">
          {editing === false ? (
            <SubTypeSelect
              onSubmit={onSubmit}
              editId={editId}
              type={type}
              setType={setType}
            />
          ) : (
            <SubTypeSidebarEditor
              editId={editId || ''}
              mode={mode}
              setMode={setMode}
              openRelay={openRelay}
              activeGroup={activeGroup}
              setActiveGroup={setActiveGroup}
              activeProperty={activeProperty}
              setActiveProperty={setActiveProperty}
            />
          )}
        </Box>

        {/* {mode === 'preview' && (
          <>
            <Box
              sx={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                zIndex: 10,
                top: 64,
                left: 0,
                backgroundColor: getAlphaColor({
                  color: 'background',
                  key: 'paper',
                  opacity: 0.7,
                }),
              }}
            />
            <Button
              sx={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 20,
              }}
              variant="contained"
              onClick={() => {
                setMode('form');
                openRelay({ data: { setMode: 'form' }, status: 'complete' });
              }}
            >
              Exit Preview
            </Button>
          </>
        )} */}
      </Box>
    </GlossarySidePanelWrapper>
  );
};

export default SubTypeSidebarOrchestrator;

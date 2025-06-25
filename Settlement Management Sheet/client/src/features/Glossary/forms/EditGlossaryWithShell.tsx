import GlossaryAutocomplete from '@/components/shared/DynamicForm/GlossaryAutocomplete.js';
import React, { useEffect, useRef, useState } from 'react';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import EditFieldWithButton from '@/components/shared/Layout/EditFieldWithButton.js';
import { updateTab } from '@/app/slice/sidePanelSlice.js';
import { useShellContext } from '@/context/ShellContext.js';
import useNodeEditor from '@/hooks/useNodeEditor.js';
import ShellEditor from '@/components/shared/TipTap/ShellEditor.js';
import { Box } from '@mui/system';
import GlossaryPropEditor from '@/components/shared/Layout/GlossaryPropEditor.js';
import useTabSplit from '@/hooks/layout/useTabSplit.js';
import propertyArrayMap from '../helpers/entryTypePropertyArray.js';
import { TitledCollapse } from '@/components/index.js';
import { Typography } from '@mui/material';
import { format } from 'timeago.js';
import { Description } from '@mui/icons-material';

interface EditGlossaryEntryFormProps {
  height: string;
}

const EditGlossaryEntryForm: React.FC<EditGlossaryEntryFormProps> = ({
  height = '100%',
}) => {
  const { glossaryId, id, tabId, side, mode } = useShellContext();
  const {
    updateGlossaryEntry: update,
    node,
    entry,
  } = useNodeEditor(glossaryId, id);

  console.log(entry);

  const dispatch: AppDispatch = useDispatch();

  const [lastSaved, setLastSaved] = useState<Record<string, any>>({});
  const [name, setName] = useState(node.name || '');
  const [desc, setDesc] = useState(true);
  const justUpdatedRef = useRef(false);

  useEffect(() => {
    if (name !== node.name) {
      justUpdatedRef.current = true;
      update({ name });
      dispatch(updateTab({ tabId, side, keypath: 'name', updates: name }));
    }
  }, [name, dispatch, tabId, side]);

  // When node.name changes externally, sync state—but skip if we just updated it ourselves
  useEffect(() => {
    if (justUpdatedRef.current) {
      justUpdatedRef.current = false;
      return;
    }
    if (name !== node.name) {
      setName(node.name);
      dispatch(updateTab({ tabId, side, keypath: 'name', updates: node.name }));
    }
  }, [node.name]);

  const { either, noSplit } = useTabSplit();

  const handleNameChange = (newName: string) => {
    setName(newName);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: '100%',
        py: 4,
        px: 2,
        mt: 2,
        alignContent: 'start',
        gap: 2,
        borderRadius: mode === 'edit' ? 2 : 0,
        boxSizing: 'border-box',
        overflowY: 'scroll',
        width: '100%',
      }}
    >
      <EditFieldWithButton
        label="Entry Title"
        value={name}
        onSave={handleNameChange}
        style={{
          width: '100%',
        }}
      />
      <Box>
        <TitledCollapse
          title="Description"
          styles={{
            marginTop: 0,
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'start',
            height: '100%',
          }}
          icon={Description}
          iconProps={{ sx: { color: 'primary.main', mr: 1 } }}
          open={desc}
          toggleOpen={() => setDesc(!desc)}
          boxSx={{
            textAlign: 'left',
            boxSizing: 'border-box',
            pb: 2,
            borderRadius: 0,
          }}
          childContainerSx={{
            boxSizing: 'border-box',
            minHeight: '40vh',
            maxHeight: '40vh',
            overflowY: 'scroll',
            border: '1px solid',
            borderColor: 'divider',
            borderTop: 'none',
            borderRadius: 0,
          }}
          className="shell-editor-container"
        >
          <ShellEditor
            keypath="description"
            setLastSaved={setLastSaved}
            lastSaved={lastSaved.description}
          />
          {lastSaved.description && (
            <Typography
              variant="caption"
              sx={{
                position: 'sticky',
                bottom: 0,
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'secondary.main'
                    : 'background.default',
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              Last Saved: {format(lastSaved.description)}
            </Typography>
          )}
        </TitledCollapse>
      </Box>
      <Box
        sx={{
          px: 1,
          boxSizing: 'border-box',
          backgroundColor: 'background.default',
          py: 2,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {propertyArrayMap[node.entryType].map((section: any) => {
          if (section.multiple) {
            return (
              <GlossaryPropEditor
                key={section.keypath}
                multiple={true}
                keypath={section.keypath as keyof typeof entry}
                options={[]}
                label={section.label}
              />
            );
          } else {
            return (
              <GlossaryAutocomplete
                key={section.keypath}
                multiple={false}
                keypath={section.keypath as keyof typeof entry}
                options={[]}
                label={section.label}
              />
            );
          }
        })}
      </Box>
    </Box>
  );
};

export default EditGlossaryEntryForm;

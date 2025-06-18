import React, { useState, useEffect, useMemo } from 'react';
import EditorToolbarMenu from './Menu.jsx';
import { EditorProvider } from '@tiptap/react';
import { Box } from '@mui/material';
import { format } from 'timeago.js';
import { alpha, useTheme } from '@mui/material/styles';
import { useShellContext } from '@/context/ShellContext.js';
import { debounce, set } from 'lodash';
import tipTapExtensions from './extensions/extensions.js';

type EditorProps = {
  keypath: string;
  lastSaved: Date | null;
  setLastSaved?: (value: Record<string, any>) => void;
  minHeight?: string;
  maxHeight?: string;
};

const debouncedUpdate = debounce((callback, value, text) => {
  callback({ description: value, dataString: text.trim() });
}, 1000);

const debouncedSetLastSaved = debounce((lastSaved, setLastSaved, keypath) => {
  setLastSaved({ ...lastSaved, [keypath]: new Date() });
}, 1000);

const ShellEditor: React.FC<EditorProps> = ({
  keypath,
  lastSaved = null,
  setLastSaved = () => {},
  minHeight = '300px',
  maxHeight = '100%',
}) => {
  const theme = useTheme();
  const { update, entry } = useShellContext();
  const [content, setContent] = useState(entry[keypath] || '');

  const handleChange = (value: string, text: string) => {
    debouncedUpdate(update, value, text);
    debouncedSetLastSaved(lastSaved, setLastSaved, keypath);
  };

  return (
    <Box>
      <Box
        sx={{
          boxShadow: 2,
          border: `2px solid ${alpha(theme.palette.divider, 0.05)}`,
          boxSizing: 'border-box',
          position: 'relative',
          minHeight,
          maxHeight,
          overflowY: 'auto',
          borderRadius: 2,
          minWidth: 300,
        }}
      >
        <EditorProvider
          slotBefore={<EditorToolbarMenu />}
          extensions={tipTapExtensions}
          content={content}
          onUpdate={(editor) => {
            const value = editor.editor.getHTML();
            const text = editor.editor.getText();
            setContent(value);
            handleChange(value, text);
          }}
        />
      </Box>
      {lastSaved && (
        <Box
          sx={{
            fontSize: '0.75rem',
            textAlign: 'left',
            pl: 2,
            position: 'relative',
            pt: 2,
            mb: -2,
          }}
        >
          Last Saved: {format(lastSaved)}
        </Box>
      )}
    </Box>
  );
};

export default ShellEditor;

import React, { useState, useEffect, useMemo } from 'react';
import EditorToolbarMenu from './Menu.jsx';
import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Box } from '@mui/material';
import { format } from 'timeago.js';
import { alpha, useTheme } from '@mui/material/styles';
import { useShellContext } from '@/context/ShellContext.js';
import { debounce, set } from 'lodash';

const extensions = [
  StarterKit,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Underline,
];

type EditorProps = {
  keypath: string;
  lastSaved: Date | null;
  setLastSaved?: (value: Record<string, any>) => void;
  minHeight?: string;
  maxHeight?: string;
};

const debouncedUpdate = debounce((callback, value, keypath) => {
  callback({ keypath, value });
}, 1000);

const Editor: React.FC<EditorProps> = ({
  keypath,
  lastSaved,
  setLastSaved = () => {},
  minHeight = '300px',
  maxHeight = '1000px',
}) => {
  const theme = useTheme();
  const { syncLocalAndRemote: update, entry } = useShellContext();
  const [content, setContent] = useState(entry[keypath] || '');

  const handleChange = (value: string) => {
    debouncedUpdate(update, value, keypath);
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
        }}
      >
        <EditorProvider
          slotBefore={<EditorToolbarMenu />}
          extensions={extensions}
          content={content}
          onUpdate={(editor) => {
            const value = editor.editor.getHTML();
            setContent(value);
            handleChange(value);
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
            bottom: 0,
            right: 0,
          }}
        >
          Last Saved: {format(lastSaved)}
        </Box>
      )}
    </Box>
  );
};

export default Editor;

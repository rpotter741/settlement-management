import React, { useState, useEffect, useMemo } from 'react';
import EditorToolbarMenu from './Menu.jsx';
import { EditorProvider } from '@tiptap/react';
import { Box, Typography } from '@mui/material';
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
  style?: React.CSSProperties;
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
  maxHeight = '1015px',
  style = {},
}) => {
  const theme = useTheme();
  const { update, entry } = useShellContext();
  const [content, setContent] = useState(entry[keypath] || '');

  const handleChange = (value: string, text: string) => {
    debouncedUpdate(update, value, text);
    debouncedSetLastSaved(lastSaved, setLastSaved, keypath);
  };

  console.log('ShellEditor content:', content);

  return (
    <Box
      className="shell-editor"
      sx={{
        boxSizing: 'border-box',
        position: 'relative',
        minHeight,
        maxHeight,
        overflowY: 'scroll',
        // borderRadius: 2,
        height: '100%',
        // minWidth: 300,
        ...style,
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
  );
};

export default ShellEditor;

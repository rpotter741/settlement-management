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
  minHeight?: string;
  maxHeight?: string;
  style?: React.CSSProperties;
};

const debouncedUpdate = debounce((callback, value, text) => {
  callback({ description: value, dataString: text.trim() });
}, 1000);

const debouncedSetLastSaved = debounce((updateLastSaved, keypath) => {
  updateLastSaved(keypath);
}, 1000);

const ShellEditor: React.FC<EditorProps> = ({
  keypath,
  minHeight = '300px',
  maxHeight = '1015px',
  style = {},
}) => {
  const theme = useTheme();
  const { update, entry, tab, updateLastSaved } = useShellContext();
  const lastSaved = tab?.viewState?.lastUpdated?.[keypath] || null;
  console.log(tab?.viewState);
  const [content, setContent] = useState(entry[keypath] || '');

  const handleChange = (value: string, text: string) => {
    debouncedUpdate(update, value, text);
    debouncedSetLastSaved(updateLastSaved, keypath);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // height: '100%',
        boxSizing: 'border-box',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        className="shell-editor"
        sx={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
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
      {lastSaved && (
        <Typography
          variant="caption"
          sx={{
            width: '100%',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'secondary.main'
                : 'background.default',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          Last Saved: {format(lastSaved)}
        </Typography>
      )}
    </Box>
  );
};

export default ShellEditor;

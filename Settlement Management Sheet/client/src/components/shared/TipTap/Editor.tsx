import React, { useState, useEffect, useMemo } from 'react';
import EditorToolbarMenu from './Menu.js';
import { EditorProvider } from '@tiptap/react';
import { Box } from '@mui/material';
import { format } from 'timeago.js';
import { alpha, useTheme } from '@mui/material/styles';
import { debounce, set } from 'lodash';
import tipTapExtensions from './extensions/extensions.js';

type EditorProps = {
  html?: string;
  minHeight?: string;
  maxHeight?: string;
  propUpdate?: (updates: Record<string, any>) => void;
};

const debouncedUpdate = debounce((callback, value, text) => {
  callback({ description: value, dataString: text.trim() });
}, 1000);

const Editor: React.FC<EditorProps> = ({
  html = '',
  minHeight = '300px',
  maxHeight = '1000px',
  propUpdate = (updates: Record<string, any>) => {},
}) => {
  const theme = useTheme();
  const [content, setContent] = useState(html || '');

  const handleChange = (value: string, text: string) => {
    debouncedUpdate(propUpdate, value, text);
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
          // minWidth: 300,
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
    </Box>
  );
};

export default Editor;

import React, { useState, useEffect, useMemo } from 'react';
import EditorToolbarMenu from './Menu.js';
import { EditorProvider } from '@tiptap/react';
import { Box, Typography } from '@mui/material';
import { format } from 'timeago.js';
import { alpha, useTheme } from '@mui/material/styles';
import { debounce, set } from 'lodash';
import tipTapExtensions from './extensions/extensions.js';
import useTimeout from '@/hooks/utility/useTimeout.js';
import useInterval from '@/hooks/utility/useInterval.js';

type EditorProps = {
  html?: string;
  minHeight?: string;
  maxHeight?: string;
  propUpdate?: ({
    description,
    dataString,
  }: {
    description: string;
    dataString: string;
  }) => void;
  immediateOnChange?: () => void;
  width?: string;
};

const debouncedUpdate = debounce((callback, value, text) => {
  callback({ description: value, dataString: text.trim() });
}, 1000);

const debouncedSetLastSaved = debounce((updateLastSaved) => {
  updateLastSaved(new Date());
}, 1000);

const Editor: React.FC<EditorProps> = ({
  html = '',
  minHeight = '300px',
  maxHeight = '1000px',
  propUpdate = () => {},
  immediateOnChange = () => {},
  width = '100%',
}) => {
  const theme = useTheme();
  const [content, setContent] = useState(html || '');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [formattedTime, setFormattedTime] = useState<string>('');

  const handleChange = (value: string, text: string) => {
    immediateOnChange();
    debouncedUpdate(propUpdate, value, text);
    debouncedSetLastSaved(setLastSaved);
  };

  useEffect(() => {
    setFormattedTime(format(lastSaved || new Date()));
  }, [lastSaved]);

  useInterval(() => {
    if (lastSaved) {
      setFormattedTime(format(lastSaved));
    }
  }, 10000);

  return (
    <>
      <Box
        className="non-shell-editor"
        sx={{
          boxShadow: 2,
          border: `2px solid ${alpha(theme.palette.divider, 0.05)}`,
          boxSizing: 'border-box',
          position: 'relative',
          minHeight,
          maxHeight,
          overflowY: 'auto',
          borderRadius: '4px 4px 0 0',
          borderBottom: 0,
          width,
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
      <Box sx={{ width: '100%', display: 'flex' }}>
        {lastSaved && (
          <Typography
            variant="caption"
            sx={{
              width,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'secondary.main'
                  : 'background.default',
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            Last Saved: {formattedTime}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default Editor;

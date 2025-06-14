import React from 'react';
import { useCurrentEditor } from '@tiptap/react';

import { Box, ButtonGroup, IconButton, Button } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  ViewHeadline,
  FormatAlignCenter,
  FormatAlignLeft,
  FormatAlignRight,
  FormatAlignJustify,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatClear,
  Looks6,
  Looks5,
  Looks4,
  Looks3,
  LooksTwo,
  LooksOne,
  Abc,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

const EditorToolbarMenu = () => {
  const theme = useTheme();
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  const mode = theme.palette.mode;

  const themeColor =
    theme.palette.mode === 'dark' ? 'secondary.dark' : 'accent.light';

  const isActive = (type: string, attrs?: Record<string, any>) =>
    editor.isActive(type, attrs);

  const toggleMark = (type: string) => () => {
    editor.chain().focus().toggleMark(type).run();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1rem',
        // boxShadow: 2,
        borderBottom: '1px solid',
        backgroundColor:
          mode === 'dark'
            ? alpha(theme.palette.secondary.main, 1)
            : theme.palette.background.default,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderRadius: '8px 8px 0 0',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          alignItems: 'center',
          justifyContent: 'start',
          width: '100%',
          px: 2,
        }}
      >
        <IconButton
          onClick={toggleMark('bold')}
          color={isActive('bold') ? 'primary' : 'default'}
          sx={{
            borderRadius: 0,
            backgroundColor: isActive('bold') ? themeColor : 'transparent',
          }}
        >
          <FormatBold />
        </IconButton>
        <IconButton
          onClick={toggleMark('italic')}
          color={isActive('italic') ? 'primary' : 'default'}
          sx={{
            borderRadius: 0,
            backgroundColor: isActive('italic') ? themeColor : 'transparent',
          }}
        >
          <FormatItalic />
        </IconButton>
        <IconButton
          onClick={toggleMark('underline')}
          color={isActive('underline') ? 'primary' : 'default'}
          sx={{
            borderRadius: 0,
            backgroundColor: isActive('underline') ? themeColor : 'transparent',
          }}
        >
          <FormatUnderlined />
        </IconButton>
        <IconButton
          onClick={toggleMark('strike')}
          color={isActive('strike') ? 'primary' : 'default'}
          sx={{
            borderRadius: 0,
            backgroundColor: isActive('strike') ? themeColor : 'transparent',
          }}
        >
          <FormatStrikethrough />
        </IconButton>
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          color={isActive('heading', { level: 1 }) ? 'primary' : 'default'}
          sx={{
            borderRadius: 0,
            backgroundColor: isActive('heading', { level: 1 })
              ? themeColor
              : 'transparent',
          }}
        >
          <LooksOne />
        </IconButton>
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          color={isActive('heading', { level: 2 }) ? 'primary' : 'default'}
          sx={{
            borderRadius: 0,
            backgroundColor: isActive('heading', { level: 2 })
              ? themeColor
              : 'transparent',
          }}
        >
          <LooksTwo />
        </IconButton>
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          color={isActive('heading', { level: 3 }) ? 'primary' : 'default'}
          sx={{
            borderRadius: 0,
            backgroundColor: isActive('heading', { level: 3 })
              ? themeColor
              : 'transparent',
          }}
        >
          <Looks3 />
        </IconButton>
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          color={isActive('heading', { level: 4 }) ? 'primary' : 'default'}
          sx={{
            borderRadius: 0,
            backgroundColor: isActive('heading', { level: 4 })
              ? themeColor
              : 'transparent',
          }}
        >
          <Looks4 />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          color={isActive('paragraph') ? 'primary' : 'default'}
          sx={{
            borderRadius: 0,
            backgroundColor: isActive('paragraph') ? themeColor : 'transparent',
          }}
        >
          <Abc />
        </IconButton>
        <IconButton
          onClick={() => editor.commands.toggleTextAlign('left')}
          //@ts-ignore
          color={isActive({ textAlign: 'left' }) ? 'primary' : 'default'}
          sx={{
            borderRadius: 0,
            //@ts-ignore
            backgroundColor: isActive({ textAlign: 'left' })
              ? themeColor
              : 'transparent',
          }}
        >
          <FormatAlignLeft />
        </IconButton>
        <IconButton
          onClick={() => editor.commands.toggleTextAlign('center')}
          //@ts-ignore
          color={isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
          sx={{
            borderRadius: 0,
            //@ts-ignore
            backgroundColor: isActive({ textAlign: 'center' })
              ? themeColor
              : 'transparent',
          }}
        >
          <FormatAlignCenter />
        </IconButton>
        <IconButton
          onClick={() => editor.commands.toggleTextAlign('right')}
          //@ts-ignore
          color={isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
          sx={{
            borderRadius: 0,
            //@ts-ignore

            backgroundColor: isActive({ textAlign: 'right' })
              ? themeColor
              : 'transparent',
          }}
        >
          <FormatAlignRight />
        </IconButton>
      </Box>
    </Box>
  );
};

export default EditorToolbarMenu;

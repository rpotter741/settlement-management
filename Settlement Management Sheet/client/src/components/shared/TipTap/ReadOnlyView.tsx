import { EditorContent, useEditor } from '@tiptap/react';
import tipTapExtensions from './extensions/extensions.js';
import { Box } from '@mui/system';

const ReadOnlyView = ({ content }: { content: JSON }) => {
  const editor = useEditor({
    extensions: tipTapExtensions,
    content,
    editable: false,
  });
  return (
    <Box
      sx={{
        width: '100%',
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
};

export default ReadOnlyView;

// editor.on('create', () => {
//   editor.view.dom.addEventListener('click', (e) => {
//     const header = (e.target as HTMLElement).closest('.collapsible-header');
//     if (header) {
//       const section = header.closest('section[data-type="collapsible-header"]');
//       const isCollapsed = section?.dataset.collapsed === 'true';
//       if (section) {
//         section.dataset.collapsed = (!isCollapsed).toString();
//       }
//     }
//   });
// });

// also want a view mode for switching between a 'wiki' style (continuous) and a 'book' style (with pages)
// this could be a toggle in the editor toolbar, or a setting in the user profile
// example things:
// const pages = content.split(/(?=<h2)/g); // crude version
//or
{
  /* <EditorContent>
  {pages.map((page, i) => (
    <Box key={i} sx={{ minHeight: '100vh', py: 6 }}>
      {renderPageContent(page)}
    </Box>
  ))}
</EditorContent>; */
}

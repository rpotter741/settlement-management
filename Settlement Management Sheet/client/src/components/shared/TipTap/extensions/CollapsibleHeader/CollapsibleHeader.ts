// CollapsibleHeader.ts
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import CollapsibleView from './CollapsibleView.js';

/* ---------- Tiptap extension ---------- */

const CollapsibleHeader = Node.create({
  name: 'collapsibleHeader',

  group: 'block',
  content: 'inline*',
  defining: true,

  addAttributes() {
    return {
      level: {
        default: 2,
      },
      collapsed: {
        default: false,
      },
    };
  },

  /* keep renderHTML if you need HTML export / SSR */
  renderHTML({ HTMLAttributes }) {
    return [
      'section',
      mergeAttributes(HTMLAttributes, { 'data-type': 'collapsible-header' }),
      ['div', 0], // single content slot; NodeView will take full control
    ];
  },

  /* ▶ THIS is where the NodeView gets hooked in */
  addNodeView() {
    return ReactNodeViewRenderer(CollapsibleView);
  },

  /* your existing command helper */
  addCommands(): any {
    return {
      toggleCollapsibleHeader:
        (attrs: any) =>
        ({ commands }: { commands: any }) =>
          commands.toggleNode('collapsibleHeader', 'paragraph', attrs),
    };
  },
});

export default CollapsibleHeader;

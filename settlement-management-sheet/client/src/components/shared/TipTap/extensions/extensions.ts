import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import CollapsibleHeader from './CollapsibleHeader/CollapsibleHeader.js';

export const tipTapExtensions = [
  StarterKit,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Underline,
];

export default tipTapExtensions;

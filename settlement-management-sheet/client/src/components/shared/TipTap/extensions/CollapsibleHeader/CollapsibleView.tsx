import { Node, mergeAttributes } from '@tiptap/core';
import {
  ReactNodeViewRenderer,
  NodeViewContent,
  NodeViewWrapper,
} from '@tiptap/react';
import React from 'react';
import './CollapsibleHeader.css';

/* ---------- React UI for the node ---------- */

const CollapsibleView: React.FC<any> = ({
  node,
  updateAttributes,
  editor,
  HTMLAttributes,
}) => {
  const [collapsed, setCollapsed] = React.useState(node.attrs.collapsed);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    updateAttributes({ collapsed: next }); // persist in doc
  };

  const HeadingTag = `h${node.attrs.level}` as keyof JSX.IntrinsicElements;

  return (
    <NodeViewWrapper
      as="section"
      data-type="collapsible-header"
      {...HTMLAttributes}
    >
      <HeadingTag className="collapsible-title" onClick={toggle}>
        {collapsed ? '▶' : '▼'} {/* arrow glyphs */}
        {editor.getTextBetween(node.content, node.content, ', ') || ' '}
      </HeadingTag>
      <hr />
      <div
        className="collapsible-content"
        style={{ display: collapsed ? 'none' : 'block' }}
      >
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
};

export default CollapsibleView;

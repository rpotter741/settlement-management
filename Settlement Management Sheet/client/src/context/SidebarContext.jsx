import React, { createContext, useContext, useState } from 'react';

const DynamicSidebarContext = createContext();

export const DynamicSidebarProvider = ({ children }) => {
  const [handlers, setHandlers] = useState([]); // Array of handler functions
  const [content, setContent] = useState([]); // Optional: Keep track of the current main content

  const updateHandlers = (newHandlers) => setHandlers(newHandlers);
  const updateContent = (newContent) => setContent(newContent);

  return (
    <DynamicSidebarContext.Provider
      value={{ handlers, updateHandlers, content, updateContent }}
    >
      {children}
    </DynamicSidebarContext.Provider>
  );
};

export const useDynamicSidebar = () => useContext(DynamicSidebarContext);

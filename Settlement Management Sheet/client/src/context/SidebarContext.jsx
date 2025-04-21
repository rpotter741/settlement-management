import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import ReactDOM from 'react-dom';
import { Drawer } from '@mui/material';

import TabbedContainer from 'components/shared/TabbedContainer/TabbedContainer.jsx';
import contentSx from 'components/shared/TabbedContainer/contentStyles.js';

const SidebarContext = createContext();

const sidebarTabs = [
  {
    name: 'Search',
    component: () => <div>Search Component</div>,
    contentSx: { ...contentSx, flexGrow: 4 },
  },
  {
    name: 'Glossary',
    component: () => <div>Glossary Component</div>,
    contentSx: { ...contentSx, flexGrow: 4 },
  },
  {
    name: 'Preview',
    component: () => <div>Preview Component</div>,
    contentSx: { ...contentSx, flexGrow: 4 },
  },
];

const SidebarRenderer = React.memo(({ open, onClose }) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: '600px',
          zIndex: 1300,
          backgroundColor: 'background.paper',
        },
      }}
    >
      <TabbedContainer tabs={sidebarTabs} />
    </Drawer>
  );
});

export const SidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const toggleSidebar = useCallback((value) => {
    setOpen(value);
  }, []);

  const contextValue = useMemo(
    () => ({
      open,
      setOpen: toggleSidebar,
    }),
    [open, toggleSidebar]
  );

  return (
    <>
      <SidebarContext.Provider value={contextValue}>
        {children}
      </SidebarContext.Provider>
      {ReactDOM.createPortal(
        <SidebarRenderer open={open} onClose={() => setOpen(false)} />,
        document.getElementById('sidebar-root')
      )}
    </>
  );
};

export const useSidebar = () => useContext(SidebarContext);

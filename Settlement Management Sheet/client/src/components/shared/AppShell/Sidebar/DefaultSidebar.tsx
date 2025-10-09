import React, { lazy, Suspense, useMemo, useState } from 'react';
import { Box, Tooltip, Divider, Collapse, IconButton } from '@mui/material';
import { v4 as newId } from 'uuid';
import {
  MoreVert,
  Menu,
  Construction,
  MenuBook,
  Widgets,
  Grading,
  BookOnline,
  Settings,
  ChildCare,
  Search,
  AddToPhotos,
  Tune,
  Style,
} from '@mui/icons-material';
import AvatarWithMenu from 'components/shared/Layout/AvatarWithMenu.jsx';
import { useSelector } from 'react-redux';
import { panelOpen } from '@/app/selectors/panelSelectors.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { togglePanel } from '@/app/slice/panelSlice.js';
import ModeButtonWithTooltip from '@/components/shared/Layout/SidePanel/ModeButtonWithTooltip.js';
import { SidebarContextProvider } from '@/context/SidePanel/SidePanelContext.js';
import { ToolName } from '@/app/types/ToolTypes.js';
import { useNavigate } from 'react-router-dom';
import contextMap from '@/maps/sidebarContextMap.js';
import MotionBox, { RowMotionBox } from '../../Layout/Motion/MotionBox.js';

const defaultConfig = [
  {
    name: 'Tools',
    icon: Construction,
    component: () =>
      React.memo(
        lazy(() => import('@/features/SidePanel/Panels/ToolSelection.js'))
      ),
    path: '/customCreation',
    contextButtons: [
      {
        name: 'Search Tools',
        icon: Search,
        component: () =>
          React.memo(lazy(() => import('../../LoadTool/SidePanelLoad.js'))),
        path: '/customCreation',
      },
    ],
  },
  {
    name: 'Kits',
    icon: Widgets,
    component: () =>
      React.memo(
        lazy(() => import('@/features/SidePanel/Panels/SidePanelKit.js'))
      ),
    contextButtons: [],
    path: '/kits',
  },
  {
    name: 'Glossary',
    icon: MenuBook,
    component: () =>
      React.memo(
        lazy(
          () => import('@/features/SidePanel/Glossary/DirectorySidePanel.js')
        )
      ),
    path: '/customCreation',
    contextButtons: [
      {
        name: 'Glossary Templates',
        icon: Style,
        component: () =>
          React.memo(
            lazy(
              () =>
                import(
                  '@/features/SidePanel/Glossary/SubTypeManager/SubTypeSidebarOrchestrator.js'
                )
            )
          ),
        path: '/glossaryTemplates',
      },
      {
        name: 'Glossary Settings',
        icon: Settings,
        component: () =>
          React.memo(
            lazy(
              () => import('@/features/SidePanel/Glossary/GlossaryNavList.js')
            )
          ),
        path: '/editGlossary',
      },
    ],
  },
];

const DefaultSidebar = ({ configArray = defaultConfig }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const open = useSelector(panelOpen);

  //LoadTool specific
  const [active, setActive] = useState<string | undefined>(undefined);
  const [tool, setTool] = useState<ToolName | null>(null);

  //general state
  const [activeIndex, setActiveIndex] = useState(0);

  const [contextKey, setContextKey] = useState<string | null>(null);

  const [activeContext, setActiveContext] = useState<
    keyof typeof contextMap | null
  >(null);

  const borderColor = 'primary.dark';

  const Component = useMemo(
    () => configArray[activeIndex]?.component,
    [activeIndex, configArray]
  );
  const ContextComponent = useMemo(
    () =>
      activeContext && contextMap[activeContext]
        ? contextMap[activeContext]
        : null,
    [activeContext]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'start',
        borderRight: open ? 1 : 0,
        borderColor,
        height: '100%',
        transition: 'border-color 0.3s ease',
      }}
    >
      <Box
        component="nav"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: 48,
          maxWidth: 48,
          borderRight: 1,
          borderColor,
          boxSizing: 'border-box',
          flexGrow: 1,
          justifyContent: 'start',
          position: 'relative',
          transition: 'border-color 0.3s ease',
        }}
      >
        <Tooltip title={!open ? 'Expand' : 'Collapse'} arrow placement="right">
          <IconButton
            onClick={() => dispatch(togglePanel())}
            sx={{
              border: 0,
              borderRadius: 0,
              height: 72,
              maxHeight: 72,
              boxSizing: 'border-box',
            }}
          >
            {!open ? <MoreVert /> : <Menu />}
          </IconButton>
        </Tooltip>
        <Divider flexItem sx={{ mb: 0 }} />
        {configArray.map((section, index) => (
          <Box
            key={section.name}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderBottom: 1,
              boxSizing: 'border-box',
              borderColor: 'dividerDark',
            }}
          >
            <ModeButtonWithTooltip
              index={index}
              modeTarget={section.name}
              setMode={() => {
                setContextKey(section.name);
                setActiveContext(null);
                setActiveIndex(index);
                navigate(section.path);
              }}
              icon={section.icon ?? Widgets}
              height={72}
              active={activeContext === null && activeIndex === index}
              inactiveColor="accent.main"
            />
            {(section.contextButtons || []).map((button) => (
              <ModeButtonWithTooltip
                key={button.name}
                index={index}
                modeTarget={button.name}
                setMode={() => {
                  setContextKey(button.name);
                  setActiveContext(button.name as keyof typeof contextMap);
                  setActiveIndex(index);
                  navigate(button.path);
                }}
                icon={button.icon ?? Widgets}
                height={72}
                active={activeContext === button.name}
                inactiveColor="accent.main"
              />
            ))}
          </Box>
        ))}
        <Divider flexItem />
        <Box
          sx={{
            display: 'flex',
            height: 'calc(33vh - 32px)',
            mb: '48px',
            flexDirection: 'column',
          }}
        ></Box>
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <AvatarWithMenu />
        </Box>
      </Box>
      <Collapse in={open} timeout={300} orientation="horizontal">
        <Box
          sx={{
            height: '100%',
            overflow: 'scroll',
          }}
        >
          <SidebarContextProvider
            value={{
              active,
              setActive,
              tool,
              setTool,
              contextKey,
              setContextKey,
              activeContext,
              setActiveContext,
            }}
          >
            <Box
              sx={{
                width: 300,
                overflowX: 'hidden',
                flexShrink: 0,
                flexDirection: 'column',
                display: 'flex',
                position: 'relative',
                height: 'calc(100vh - 40px)',
              }}
            >
              <Suspense fallback={null}>
                {activeContext ? (
                  <>
                    {ContextComponent
                      ? React.createElement(ContextComponent(), {})
                      : null}
                  </>
                ) : (
                  <>{Component ? React.createElement(Component(), {}) : null}</>
                )}
              </Suspense>
            </Box>
          </SidebarContextProvider>
        </Box>
      </Collapse>
    </Box>
  );
};

export default DefaultSidebar;

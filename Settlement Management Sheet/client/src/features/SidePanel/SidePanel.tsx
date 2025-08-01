import React, { lazy, Suspense, useEffect, useState } from 'react';
import {
  Box,
  Chip,
  Typography,
  Toolbar,
  List,
  Tooltip,
  Avatar,
  ListItemButton,
  ListItemIcon,
  Divider,
  Collapse,
  IconButton,
  useTheme,
  darken,
  lighten,
} from '@mui/material';

import { v4 as newId } from 'uuid';

import SidePanelKit from './Panels/SidePanelKit.js';
import {
  Build,
  LibraryBooks,
  MoreVert,
  Menu,
  Construction,
  Dashboard,
  MenuBook,
  Widgets,
  Search,
  Calculate,
  ArrowBackSharp,
  Settings,
  Checklist,
  Check,
  Grading,
  Palette,
  AddToPhotos,
} from '@mui/icons-material';

import AvatarWithMenu from 'components/shared/Layout/AvatarWithMenu.jsx';

import LoadTool from 'components/shared/LoadTool/SidePanelLoad.jsx';

import GlossarySidePanel from '../Glossary/Directory/GlossarySidePanel.js';

import RenderEntry from './helpers/RenderEntry.js';
import RenderHeader from './helpers/RenderHeader.js';
import structure from './structure.js';
import { useSelector } from 'react-redux';
import { focusedTab } from '@/app/selectors/tabSelectors.js';
import { panelOpen } from '@/app/selectors/panelSelectors.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { togglePanel } from '@/app/slice/panelSlice.js';
import ModeButtonWithTooltip from '@/components/shared/Layout/SidePanel/ModeButtonWithTooltip.js';
import getRippleBorder from '@/utility/style/getRippleBorder.js';
import ToolSelection from './Panels/ToolSelection.js';
import FramerCollapse from '@/components/shared/TitledCollapse/FramerCollapse.js';
import BookPanel from '@/components/shared/Layout/BookPanel.js';
import { ToolName } from 'types/common.js';
import { SidebarContextProvider } from '@/context/SidePanel/SidePanelContext.js';
import { GlossaryEntryType } from 'types/index.js';
import { TabTools } from '@/app/types/TabTypes.js';
import { returnTool } from '@/app/thunks/toolThunks.js';
import CustomizePalette from '../Glossary/EditGlossary/CustomizePalette.js';
import contextKeyComponentMap from '@/maps/contextKeyComponentMap.js';
import glossaryThunks from '@/app/thunks/glossaryThunks.js';
import { showModal } from '@/app/slice/modalSlice.js';

interface ContextButton {
  modeTarget: string;
  icon: React.ElementType;
  component?: React.ElementType;
  onClick?: (() => any) | (() => (dispatch: AppDispatch) => any);
  modalComponent?: {
    componentKey: string;
    props?: Record<string, any>;
    id?: string;
  };
}

const contextButtons = (name: string) => ({
  attribute: [
    {
      modeTarget: `${name} Validation Checklist`,
      icon: Grading,
      component: CustomizePalette,
    },
    {
      modeTarget: 'Values Calculator',
      icon: Calculate,
    },
  ],
  event: [
    {
      modeTarget: 'Event Dashboard',
      icon: Dashboard,
    },
  ],
  storyThread: [
    {
      modeTarget: 'Story Thread Dashboard',
      icon: Dashboard,
    },
  ],
  apt: [],
  action: [],
  building: [],
  category: [],
  kit: [],
  listener: [],
  settlementType: [],
  settlement: [],
  gameStatus: [],
  tradeHub: [],
  upgrade: [],
  continent: [],
  territory: [],
  domain: [],
  province: [],
  landmark: [
    {
      modeTarget: `${name} Settings`,
      icon: Settings,
    },
  ],
  faction: [],
  location: [],
  person: [],
  note: [],
  editGlossary: [],
});

const modeContextButtons: Record<Mode, Array<ContextButton>> = {
  Tools: [
    {
      modeTarget: 'Search Tools',
      icon: Search,
    },
  ],
  Kits: [],
  Glossary: [
    {
      modeTarget: 'Create New Glossary',
      icon: AddToPhotos,
      onClick: glossaryThunks.openEditGlossary,
      modalComponent: {
        componentKey: 'NameNewGlossary',
        props: {},
        id: 'name-new-glossary',
      },
    },
  ],
};

const iconButtonList: Array<Mode> = ['Tools', 'Kits', 'Glossary'];

const colorsByIndex = ['primary.main', 'secondary.main', 'info.main'];

export type Mode = 'Tools' | 'Kits' | 'Glossary' | ToolName | any;
const modeIconMap: Partial<Record<Mode, React.ElementType>> = {
  Tools: Construction,
  Kits: Widgets,
  Glossary: MenuBook,
};

const SidePanel = () => {
  const theme = useTheme();
  const dispatch: AppDispatch = useDispatch();

  const open = useSelector(panelOpen);
  const [active, setActive] = useState('');
  const [tool, setTool] = useState<ToolName | null>(null);
  const [mode, setMode] = useState<Mode>('Tools');
  const [contextKey, setContextKey] = useState<TabTools | null>(null);
  const [activeContext, setActiveContext] = useState<string | null>(null);

  const activeTab = useSelector(focusedTab);
  const themeMode = theme.palette.mode;

  useEffect(() => {
    if (!activeTab) return;
    if (activeTab.tool !== contextKey) {
      setContextKey(activeTab.tool as TabTools);
      setActiveContext(null);
    }
  }, [activeTab, contextKey]);

  const borderColor = !activeContext ? 'primary.dark' : 'secondary.main';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'start',
        borderRight: open ? 1 : 0,
        borderColor,
        height: '100vh',
        transition: 'border-color 0.3s ease',
      }}
    >
      <Box
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
              height: 65.5,
              maxHeight: 65.5,
              boxSizing: 'border-box',
            }}
          >
            {!open ? <MoreVert /> : <Menu />}
          </IconButton>
        </Tooltip>
        <Divider flexItem sx={{ mb: 0 }} />
        {iconButtonList.map((modeTarget, index) => (
          <Box
            key={modeTarget}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderBottom: 1,
              boxSizing: 'border-box',
              borderColor: 'dividerDark',
            }}
          >
            <ModeButtonWithTooltip
              mode={mode}
              modeTarget={modeTarget}
              setMode={() => {
                setMode(modeTarget);
                setContextKey(modeTarget as TabTools);
                setActiveContext(null);
              }}
              icon={modeIconMap[modeTarget] ?? Widgets}
              height={72}
              active={activeContext === null && mode === modeTarget}
              inactiveColor="accent.main"
            />

            {(modeContextButtons[modeTarget] || []).map((button) => (
              <ModeButtonWithTooltip
                key={`${modeTarget}-${button.modeTarget}`}
                mode={mode}
                modeTarget={button.modeTarget as Mode}
                setMode={() => {
                  if (button.modalComponent) {
                    return dispatch(showModal(button.modalComponent));
                  }
                  if (button.onClick) {
                    dispatch(button.onClick());
                    return;
                  } else {
                    return setActiveContext(button.modeTarget as string);
                  }
                }}
                icon={button.icon}
                height={72}
                active={activeContext === (button.modeTarget as Mode)}
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
        >
          {contextKey &&
            (
              contextButtons(activeTab ? activeTab.name || '' : '')[
                contextKey
              ] ?? []
            ).map((button: ContextButton) => (
              <ModeButtonWithTooltip
                key={newId()}
                mode={mode}
                modeTarget={button.modeTarget as Mode}
                setMode={() => {
                  setActiveContext(button.modeTarget as string);
                }}
                icon={button.icon}
                height={54}
                active={activeContext === (button.modeTarget as Mode)}
                inactiveColor="info.main"
              />
            ))}
        </Box>
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <AvatarWithMenu />
        </Box>
      </Box>
      <Collapse in={open} timeout={'auto'} orientation="horizontal">
        <Box
          sx={{
            height: '100vh',
            overflow: 'scroll',
          }}
        >
          <SidebarContextProvider
            value={{
              tool,
              setTool,
              active,
              setActive,
              mode,
              setMode,
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
                height: '100%',
              }}
            >
              <Box
                sx={{
                  height: 65.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  position: 'relative',
                }}
              >
                {activeContext && (
                  <Tooltip title={`Back to ${mode}`} arrow>
                    <IconButton
                      onClick={() => setActiveContext(null)}
                      sx={{
                        borderRadius: 0,
                        height: 48,
                        width: 48,
                        position: 'absolute',
                        left: 0,
                      }}
                    >
                      <ArrowBackSharp />
                    </IconButton>
                  </Tooltip>
                )}
                <Typography variant="h5">Eclorean Ledger</Typography>
              </Box>
              <Divider flexItem sx={{ width: '100%' }} />
              {activeContext ? (
                <Suspense fallback={<Box>Loading...</Box>}>
                  {(() => {
                    const Component = contextKeyComponentMap(activeTab || {})[
                      activeContext
                    ].component;
                    if (!Component) {
                      console.log(
                        'woopsy, no component found for',
                        activeContext
                      );
                      return <Box>No component found for {activeContext}</Box>;
                    }
                    const props = {
                      ...contextKeyComponentMap(activeTab || {})[activeContext]
                        .props,
                    };

                    // Ensure required 'column' prop is always passed
                    return (
                      <Component key={activeContext} column={true} {...props} />
                    );
                  })()}
                </Suspense>
              ) : (
                <>
                  {mode === 'Tools' && <ToolSelection />}
                  {mode === 'Kits' && <SidePanelKit />}
                  {mode === 'Glossary' && <GlossarySidePanel />}
                  {mode === 'Search Tools' && <LoadTool />}
                </>
              )}
            </Box>
          </SidebarContextProvider>
        </Box>
      </Collapse>
    </Box>
  );
};

export default SidePanel;

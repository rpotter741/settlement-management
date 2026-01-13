import {
  selectEditEntryById,
  selectEditNodeById,
} from '@/app/selectors/glossarySelectors.js';
import { updateTab } from '@/app/slice/tabSlice.js';
import { AppDispatch } from '@/app/store.js';
import { Tab } from '@/app/types/TabTypes.js';
import useTheming from '@/hooks/layout/useTheming.js';
import {
  Commit,
  Edit,
  Preview,
  Start,
  Sync,
  TravelExplore,
} from '@mui/icons-material';
import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Typography,
  Badge,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { GlossaryEntry } from '../../../../../../shared/types/index.js';
import { Backlink } from '@/features/SyncWorkspace/SyncWorkspace.js';
import { ModalQueueEntry } from '@/app/types/ModalTypes.js';
import {
  SubTypeCompoundProperty,
  SubTypeDropdownProperty,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import { selectSubTypeProperties } from '@/app/selectors/subTypeSelectors.js';
import useTypesByIds from '@/cache/entryType/typeByIds.js';
import { SmartLinkCrawler } from '@/features/SyncWorkspace/SmartLinkCrawler.js';
import { useModalActions } from '@/hooks/global/useModal.js';
import useSmartLink from '@/hooks/global/useSmartLink.js';

interface ToolSubMenuProps {
  tab: Tab;
  toolsOpen: any;
  handleClose: (key: string) => void;
  menuSx: (side: 'left' | 'right') => React.CSSProperties;
  badgeCount: number;
}

const ToolSubMenu: React.FC<ToolSubMenuProps> = ({
  tab,
  toolsOpen,
  handleClose,
  menuSx,
  badgeCount,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const theme = useTheme();

  const { lightenColor, darkenColor } = useTheming();

  const node = tab.glossaryId
    ? useSelector(selectEditNodeById(tab.glossaryId, tab.id))
    : null;

  const { runSmartLinkSync } = useSmartLink({
    glossaryId: tab.glossaryId as string,
    entryId: tab.id,
  });

  const handleSyncClick = () => {
    if (tab.tool === 'sync') {
      if (tab.tabType === 'glossary' && tab.glossaryId) {
        dispatch(
          updateTab({
            tabId: tab.tabId,
            keypath: 'tool',
            updates: node?.entryType || 'busted',
          })
        );
      }
    } else {
      dispatch(
        updateTab({
          tabId: tab.tabId,
          keypath: 'tool',
          updates: 'sync',
        })
      );
    }
    handleClose('tools');
  };

  return (
    <Popper
      sx={{
        borderRadius: '8px',
        minWidth: '200px',
        zIndex: 1300,
      }}
      open={Boolean(toolsOpen)}
      anchorEl={toolsOpen}
      placement="bottom-start"
      transition
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === 'bottom-start' ? 'left top' : 'left bottom',
          }}
          timeout={100}
        >
          <Paper
            sx={{
              backgroundColor: lightenColor({
                color: 'background',
                key: 'paper',
                amount: 0.05,
              }),
            }}
          >
            <ClickAwayListener onClickAway={() => handleClose('tools')}>
              <MenuList
                disablePadding
                sx={{ width: { xs: '100%', md: '300px' }, py: 1 }}
              >
                {tab.tabType === 'glossary' && (
                  <>
                    <MenuItem
                      sx={{
                        ...menuSx(tab.side),
                        backgroundColor:
                          tab.tool === 'sync' ? 'success.dark' : 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                      onClick={handleSyncClick}
                    >
                      <Badge color="secondary" badgeContent={badgeCount}>
                        <Sync />
                      </Badge>
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        Sync Workspace
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      sx={{
                        ...menuSx(tab.side),
                      }}
                      onClick={runSmartLinkSync}
                    >
                      <Start />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        Run SmartLink Sync
                      </Typography>
                    </MenuItem>
                    <Divider sx={{ my: 2 }} />
                    <MenuItem
                      sx={{
                        ...menuSx(tab.side),
                      }}
                    >
                      <TravelExplore />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        Custom Sync Search
                      </Typography>
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export default ToolSubMenu;

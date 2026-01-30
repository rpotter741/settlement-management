import React, { useEffect, useRef, useState } from 'react';
import {
  leftTabs as lTabs,
  rightTabs as rTabs,
} from '@/app/selectors/tabSelectors.js';
import truncateWithEllipsis from '@/utility/inputs/truncateWithEllipses.js';
import tabMap from '@/maps/tabMap.js';
import { useDispatch } from 'react-redux';
import {
  removeTab,
  setActiveTab,
  setCurrentTab,
} from '@/app/slice/tabSlice.js';
import { useSelector } from 'react-redux';
import { AppDispatch } from '@/app/store.js';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { Tab } from '@/app/types/TabTypes.js';
import { Box } from '@mui/system';
import { Close, MenuBook } from '@mui/icons-material';
import useTheming from '@/hooks/layout/useTheming.js';

const TabNumberAndNav = ({
  side,
  disabled,
  hide,
}: {
  side: 'left' | 'right';
  disabled: boolean;
  hide: boolean;
}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { getAlphaColor } = useTheming();
  const tabs = useSelector(side === 'left' ? lTabs : rTabs);
  const tabCount = useRef(tabs.length);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [color, setColor] = React.useState('accent');

  const handleMouseEnter = (target: HTMLElement) => {
    timerRef.current = setTimeout(() => {
      setMenuAnchor(target);
      setMenuOpen(true);
    }, 500);
  };

  const handleButtonLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleButtonClick = (target: HTMLElement) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (menuOpen && menuAnchor === target) {
      setMenuOpen(false);
      setMenuAnchor(null);
    } else {
      setMenuAnchor(target);
      setMenuOpen(true);
    }
  };

  useEffect(() => {
    if (tabs.length !== tabCount.current) {
      if (tabs.length > tabCount.current) {
        setColor('success');
        setTimeout(() => {
          setColor('accent');
        }, 500);
      } else if (tabs.length < tabCount.current) {
        setColor('error');
        setTimeout(() => {
          setColor('accent');
        }, 500);
      }
      tabCount.current = tabs.length;
    }
  }, [tabs.length]);

  const handleTabClick = ({ tab, index }: { tab: Tab; index: number }) => {
    navigate('/customCreation');
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setMenuOpen(false);
    setMenuAnchor(null);
    setTimeout(() => {
      dispatch(setActiveTab({ tab }));
      dispatch(setCurrentTab({ tabId: tab.tabId, index, side }));
    }, 100);
  };

  const tabList = tabs.map((tab, index) => (
    <MenuItem
      key={tab.tabId}
      value={tab.tabId}
      onClick={() => handleTabClick({ tab, index })}
      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      onMouseEnter={() => setHoverIndex(index)}
      onMouseLeave={() => setHoverIndex(null)}
    >
      <IconButton
        aria-label="close"
        sx={{
          cursor: 'pointer',
          fontSize: 12,
          color: hoverIndex === index ? 'text.primary' : 'transparent',
        }}
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(removeTab({ tabId: tab.tabId, side }));
        }}
      >
        <Close />
      </IconButton>
      {tabMap[tab.tabType][tab.tool].icon
        ? React.createElement(
            tabMap[tab.tabType][tab.tool].icon as unknown as React.ElementType,
            {}
          )
        : undefined}
      <Typography variant="body2">
        {truncateWithEllipsis(tab.name, 20)}
      </Typography>
    </MenuItem>
  ));

  if (hide) return <Box sx={{ width: 64 }} />;

  return (
    <>
      <Box
        sx={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Button
          disabled={disabled}
          variant="text"
          /*@ts-ignore*/
          color={color}
          sx={{
            width: 36,
            minWidth: 36,
            height: 24,
            p: 0,
            transition: 'color 0.2s',
          }}
          onClick={(e) => {
            handleButtonClick(e.currentTarget);
          }}
          onMouseEnter={(e) => {
            handleMouseEnter(e.currentTarget);
          }}
          onMouseLeave={handleButtonLeave}
        >
          {tabList.length}
        </Button>
      </Box>
      <Menu
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
          setMenuAnchor(null);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        anchorEl={menuAnchor}
      >
        {tabList.length > 0 ? (
          tabList
        ) : (
          <MenuItem disabled>
            <Typography variant="body2">No tabs in {side} pane. </Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default TabNumberAndNav;

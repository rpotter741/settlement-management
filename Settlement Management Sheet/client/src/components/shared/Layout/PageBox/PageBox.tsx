import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';
import useTabSplit from '@/hooks/layout/useTabSplit.js';
import { TabType } from '@/app/types/SidePanelTypes.js';
import { PageBoxContext } from '@/context/PageBox.js';
import lockHeightDuringTransition from './utils/lockHeightOnTransition.js';
import getWidths from './utils/getWidths.js';
import pageBoxVariantSx from './utils/sxVariants.js';

export type PageBoxVariant = 'default' | 'blend' | 'fullWidth';

interface PageBoxProps {
  children: React.ReactNode;
  outerStyle?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  variant?: PageBoxVariant;
  tabType?: TabType;
  mode: 'edit' | 'preview';
  minWidth?: number;
}

const PageBox: React.FC<PageBoxProps> = ({
  children,
  outerStyle = {},
  innerStyle = {},
  variant = 'default',
  tabType = 'tool',
  mode,
  minWidth = 450,
}) => {
  const { soloSize } = useTabSplit();
  const overrideVariant = soloSize ? 'fullWidth' : variant;

  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<'auto' | number>('auto');
  const timer = useRef<NodeJS.Timeout | null>(null);

  const lockHeight = (duration: number) => {
    lockHeightDuringTransition(ref, timer, setHeight, duration);
  };

  return (
    <PageBoxContext.Provider value={{ lockHeight, ref, height }}>
      <Box
        className="page-box-outside"
        sx={{
          display: 'flex',
          justifyContent: 'start',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          maxHeight:
            variant === 'fullWidth'
              ? 'calc(100vh - 100.5px)'
              : 'calc(100vh - 120.5px)',
          height: '100%',
          width: '100%',
          pt: 2,
          pb: variant === 'fullWidth' ? 0 : 4,
          overflowY: 'hidden',
          overflowX: 'hidden',
          ...outerStyle,
        }}
      >
        <Box
          className="page-box-inside"
          sx={{
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'start',
            flexDirection: 'column',
            px: 4,
            boxShadow: (theme) =>
              theme.palette.mode === 'light'
                ? 4
                : '0px 2px 8px rgba(255, 255, 255, 0.2)',
            borderRadius: variant === 'fullWidth' ? 0 : 4,
            height: '100%',
            overflowY: 'scroll',
            ...pageBoxVariantSx[
              overrideVariant as keyof typeof pageBoxVariantSx
            ],
            ...innerStyle,
            width: getWidths(overrideVariant, tabType),
            minWidth,
            backgroundColor:
              mode === 'edit' ? 'background.default' : 'background.paper',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          {children}
          {/* height is passed to the outermost child since these are automagically max height for vh */}
        </Box>
      </Box>
    </PageBoxContext.Provider>
  );
};

export default PageBox;

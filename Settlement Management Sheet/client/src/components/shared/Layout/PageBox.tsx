import React from 'react';
import { Box } from '@mui/material';
import useTabSplit from '@/hooks/layout/useTabSplit.js';
import { TabType } from '@/app/types/SidePanelTypes.js';

type PageBoxVariant = 'default' | 'blend' | 'fullWidth';

interface PageBoxProps {
  children: React.ReactNode;
  outerStyle?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  variant?: PageBoxVariant;
  tabType?: TabType;
  mode: 'edit' | 'preview';
}

const variants: Record<PageBoxVariant, React.CSSProperties> = {
  default: {},
  blend: {
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 2,
    paddingRight: 2,
    marginBottom: 0,
    boxShadow: 'none',
    borderRadius: 0,
    backgroundColor: 'inherit',
    boxSizing: 'border-box',
    height: '100%',
    overflowY: 'scroll',
  },
  fullWidth: {
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: 0,
    boxShadow: 'none',
    borderRadius: 0,
    backgroundColor: 'inherit',
    boxSizing: 'border-box',
    height: '100%',
    overflowY: 'scroll',
  },
};

const getWidths = (variant: PageBoxVariant, tabType: TabType) => {
  if (variant === 'fullWidth') return '100%';
  switch (tabType) {
    case 'tool':
      return variant === 'blend' ? '100%' : { sx: '100%', md: '741px' };
    case 'glossary':
      return variant === 'blend' ? '100%' : { sx: '100%', md: '741px' };
    case 'other':
      return {};
    default:
      return { sx: '100%', md: '80%', lg: '70%', xl: '40%', xxl: '30%' };
  }
};

const PageBox: React.FC<PageBoxProps> = ({
  children,
  outerStyle = {},
  innerStyle = {},
  variant = 'default',
  tabType = 'tool',
  mode,
}) => {
  const { either, both, soloSize } = useTabSplit();
  const override = soloSize ? 'fullWidth' : variant;

  console.log(override, 'override', soloSize, 'soloSize', tabType, 'tabType');

  return (
    <Box
      className="page-box-outside"
      sx={{
        display: 'flex',
        justifyContent: 'start',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        flex: '1 0 0',
        height: '100%',
        overflowY: 'scroll',
        overflowX: 'hidden',
        ...outerStyle,
      }}
    >
      <Box
        className="page-box-inside"
        sx={{
          display: 'flex',
          justifyContent: 'start',
          flexDirection: 'column',
          px: 4,
          mb: 9,
          boxShadow: 4,
          borderRadius: 4,
          maxHeight: 'calc(100vh - 112.5px)',
          height: '100%',
          overflowY: 'scroll',
          ...variants[override as keyof typeof variants],
          ...innerStyle,
          width: getWidths(override, tabType),
          minWidth: 450,
          backgroundColor:
            mode === 'edit' ? 'background.paper' : 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageBox;

import { TabType } from '@/app/types/TabTypes.js';
import { PageBoxVariant } from '../PageBox.js';

const getWidths = (variant: PageBoxVariant, tabType: TabType) => {
  if (variant === 'fullWidth') return '100%';
  switch (tabType) {
    case 'tool':
      return variant === 'blend'
        ? '100%'
        : { sx: '850px', md: '680px', lg: '741px', xxl: '800px' };
    case 'glossary':
      return variant === 'blend'
        ? '100%'
        : { sx: '850px', md: '680px', lg: '741px', xxl: '800px' };
    case 'other':
      return {};
    default:
      return { sx: '100%', md: '80%', lg: '70%', xl: '40%', xxl: '30%' };
  }
};

export default getWidths;

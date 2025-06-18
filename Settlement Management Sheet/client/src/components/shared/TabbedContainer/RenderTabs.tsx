import React, { memo, Suspense } from 'react';
import { Box } from '@mui/material';
import TabPanel from './TabPanel.jsx';
import { tabMap } from '@/maps/tabMap.js';

import {
  useLeftTabs,
  useRightTabs,
} from '@/context/TabsContext/TabsContext.jsx';

interface RenderTabsProps {
  side: 'left' | 'right';
}

const RenderTabs: React.FC<RenderTabsProps> = memo(({ side }) => {
  const { tabs, current } = side === 'left' ? useLeftTabs() : useRightTabs();

  return tabs.map((tab) => {
    if (!tab.tool) return null;
    const Component = tabMap.hasOwnProperty(tab.tool)
      ? tabMap[tab.tool as keyof typeof tabMap]?.component
      : undefined;
    const props = {
      tab,
    };
    if (!Component) {
      return <Box> Error: Component not found. </Box>;
    }
    return (
      <TabPanel value={current} tab={tab} key={tab.tabId}>
        <Suspense fallback={<Box>Loading...</Box>}>
          <Component {...props} />
        </Suspense>
      </TabPanel>
    );
  });
});

export default RenderTabs;

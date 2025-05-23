import React, { memo, Suspense } from 'react';
import { Box } from '@mui/material';
import TabPanel from './TabPanel.jsx';
import { toolMap } from 'utility/toolMap.js';

import { useLeftTabs, useRightTabs } from 'context/TabsContext/TabsContext.jsx';
import { ToolWrapper } from 'utility/fetchComponents.jsx';

const RenderTabs = memo(({ side, setModalContent }) => {
  const { tabs, current } = side === 'left' ? useLeftTabs() : useRightTabs();
  return tabs.map((tab) => {
    const Component = toolMap[tab.tool]?.component;
    const props = {
      ...tab.props,
      tool: tab.tool,
      id: tab.id,
      currentTool: tab.tool,
      side,
      mode: tab.mode,
      tabId: tab.tabId,
    };
    if (!Component) {
      return <Box> Error: Component not found. </Box>;
    }
    return (
      <TabPanel key={tab.tabId} value={current} id={tab.tabId} tool={tab.tool}>
        <Suspense fallback={<Box>Loading...</Box>}>
          <Component {...props} setModalContent={setModalContent} />
        </Suspense>
      </TabPanel>
    );
  });
});

export default RenderTabs;

import { createElement, useMemo } from 'react';
import RenderTabHeaders from './RenderTabHeaders.js';
import TabPanel from './RenderTab.js';

export interface TabPanelObject {
  name: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

export interface TabHeaderProps {
  name: string;
  disabled?: boolean;
}

export interface TabbedContentTabs {
  name: string;
  key?: string; // Optional key for the tab
  props?: Record<string, any>; // Optional props to pass to the component
  disabled?: boolean; // Optional disabled state for the tab
}

interface TabbedContentProps {
  tabs: TabbedContentTabs[];
  componentMap: Record<string, React.ComponentType<any>>;
  activeTab: string;
  handleTabClick: (tabKey: string, index: number) => void;
  lastIndex: number;
  columns?: number; // Number of columns for the tab content layout
  onUnMount?: () => void;
  topBorder?: boolean; // Optional prop to add top border to tabs
  color?: 'primary' | 'secondary'; // Optional color prop for the tabs
  isTool?: boolean; // Optional prop to determine if the tool context is used
}

const TabbedContent: React.FC<TabbedContentProps> = ({
  tabs,
  componentMap,
  activeTab,
  handleTabClick,
  lastIndex,
  columns = 3,
  topBorder = false,
  color = 'primary',
  isTool = true,
}) => {
  //
  const renderedTabs = useMemo(() => {
    return tabs.map((tab, n) => {
      if (tab.name !== activeTab) return null;
      const Component = componentMap[tab.name];
      return (
        <TabPanel
          key={tab.name}
          activeTab={activeTab}
          tabName={tab.name}
          columns={columns}
          index={n}
          lastIndex={lastIndex}
        >
          <Component columns={columns} {...tab.props} />
        </TabPanel>
      );
    });
  }, [tabs, activeTab, componentMap, columns, lastIndex]);

  return (
    <>
      <RenderTabHeaders
        tabs={tabs}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
        topBorder={topBorder}
        color={color}
        isTool={isTool}
      />
      {renderedTabs}
    </>
  );
};

export default TabbedContent;

import { Tab, Tabs } from '@mui/material';
import { TabbedContentTabs } from './TabbedContent.js';
import { useShellContext } from '@/context/ShellContext.js';

interface MakeTabHeadersProps {
  tabs: TabbedContentTabs[];
  activeTab: string;
  handleTabClick?: (tabId: string, index: number) => void;
  topBorder?: boolean; // Optional prop to add top border
  color?: 'primary' | 'secondary'; // Optional color prop for the tabs
  isTool?: boolean; // Optional prop to determine if the tool context is used
}

const RenderTabHeaders: React.FC<MakeTabHeadersProps> = ({
  tabs,
  activeTab,
  handleTabClick = () => {},
  topBorder = false,
  color = 'primary',
  isTool = true,
}) => {
  const { tool } = isTool ? useShellContext() : { tool: 'default' };
  return (
    <Tabs
      textColor={color}
      indicatorColor={color}
      id={`${tool}-tab-header-box`}
      value={activeTab}
      centered
      onChange={() => {}}
      sx={{
        width: '100%',
        borderBottom: 1,
        borderTop: topBorder ? 1 : 0,
        borderColor: 'divider',
        boxSizing: 'border-box',
        mb: 2,
        mt: 1,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        opacity: 1,
        backgroundColor: 'background.default',
      }}
    >
      {tabs.map((tab, n) => {
        if (tab.disabled) return null;
        return (
          <Tab
            id={`tab-header-${tab.name}`}
            sx={{ flex: 1, transition: 'width 0.3s ease-in-out' }}
            key={tab.name}
            label={tab.name}
            value={tab.name}
            onClick={() => {
              handleTabClick(tab.name, n);
            }}
          />
        );
      })}
    </Tabs>
  );
};

export default RenderTabHeaders;

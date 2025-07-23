import { useEffect, useMemo, useState } from 'react';
import TabbedContent from '@/components/shared/Layout/TabbedContent/TabbedContent.js';
import { PropertySectionDescriptors } from '../helpers/entryTypePropertyArray.js';
import { GlossaryEntryType } from 'types/index.js';
import { useShellContext } from '@/context/ShellContext.js';
import useNodeEditor from '@/hooks/useNodeEditor.js';
import RenderPropertyMapTabs from './RenderPropertyMapTabs.js';
import ShellEditor from '@/components/shared/TipTap/ShellEditor.js';
import { updateTab } from '@/app/slice/sidePanelSlice.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import OverviewTab from '../tabs/OverviewTab.js';

interface PropertyMapTabsProps {
  propertyMap: any;
}

const renderComponentTabMap = {
  Overview: OverviewTab,
};

const constantTabs = [
  {
    name: 'Overview',
    key: 'overview',
    disabled: false,
    props: {
      keypath: 'description',
    },
  },
  {
    name: 'Backlinks',
    key: 'backlinks',
    disabled: false,
    props: {
      propertyMap: [],
    },
  },
];

const PropertyMapTabs: React.FC<PropertyMapTabsProps> = ({ propertyMap }) => {
  const dispatch: AppDispatch = useDispatch();
  const { tab } = useShellContext();
  const [activeTab, setActiveTab] = useState<string>(
    tab?.viewState?.activeTab || 'Overview'
  );
  const [lastIndex, setLastIndex] = useState<number>(
    tab?.viewState?.activeIndex || 0
  );

  const color = useMemo(() => {
    return tab.side === 'right' ? 'secondary' : 'primary';
  }, [tab.side]);

  useEffect(() => {
    return () => {
      const viewState = {
        ...tab.viewState,
        activeTab,
        activeIndex: lastIndex,
      };
      dispatch(
        updateTab({
          tabId: tab.tabId,
          side: tab.side,
          keypath: 'viewState',
          updates: viewState,
        })
      );
    };
  }, [activeTab, lastIndex]);

  const tabs = useMemo(() => {
    const calculatedTabs = propertyMap.map((section: any) => ({
      name: section.name,
      key: section.name,
      disabled: false,
      props: {
        propertyMap: section.children,
      },
    }));

    const usedTabs = constantTabs.toSpliced(1, 0, ...calculatedTabs);

    return usedTabs;
  }, [propertyMap]);

  const componentMap = useMemo(() => {
    return tabs.reduce(
      (acc: Record<string, React.ComponentType<any>>, section: any) => {
        acc[section.name] =
          renderComponentTabMap[
            section.name as keyof typeof renderComponentTabMap
          ] ||
          RenderPropertyMapTabs ||
          (() => null);
        return acc;
      },
      {}
    );
  }, [tabs]);

  return (
    <TabbedContent
      tabs={tabs}
      componentMap={componentMap}
      activeTab={activeTab}
      handleTabClick={(name: string, index: number) => {
        setActiveTab(name);
        setLastIndex(index);
      }}
      lastIndex={lastIndex}
      color={color}
    />
  );
};

export default PropertyMapTabs;

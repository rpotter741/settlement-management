import EventNoteIcon from '@mui/icons-material/EventNote';
import HearingIcon from '@mui/icons-material/Hearing';
import ExtensionIcon from '@mui/icons-material/Extension';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import CategoryIcon from '@mui/icons-material/Category';
import ToolsIcon from '@mui/icons-material/Build';
import { v4 as newId } from 'uuid';

import { useTools } from 'hooks/useTool.jsx';
import { useSidePanel } from 'hooks/useSidePanel.jsx';

import CreateAttribute from 'features/Attributes/components/wrappers/CreateAttribute';
import CreateCategory from 'features/Categories/components/wrappers/CreateCategory.jsx';

const getTabInfo = (tool) => {
  return {
    name: 'Untitled',
    id: newId(),
    mode: 'edit',
    type: tool,
    tabId: newId(),
    scroll: 0,
  };
};

const structure = [
  {
    title: 'Tools',
    type: 'header',
    icon: ToolsIcon,
    children: [
      {
        title: 'Attributes',
        icon: ExtensionIcon,
        type: 'link',
        tool: 'attribute',
        children: [
          {
            title: 'Create Attribute +',
            type: 'button',
            onClick: () => {
              return getTabInfo('attribute');
            },
          },
        ],
      },
      {
        title: 'Categories',
        icon: CategoryIcon,
        type: 'link',
        tool: 'category',
        children: [
          {
            title: 'Create Category +',
            type: 'button',
            onClick: () => {
              return getTabInfo('category');
            },
          },
        ],
      },
      {
        title: 'Events',
        icon: EventNoteIcon,
        type: 'link',
        component: {
          preview: 'EventPreview',
          edit: 'EventEdit',
        },
        children: [],
      },
      {
        title: 'Listeners',
        icon: HearingIcon,
        type: 'link',
        component: {
          preview: 'ListenerPreview',
          edit: 'ListenerEdit',
        },
        children: [],
      },
      {
        title: 'Weather',
        icon: ThunderstormIcon,
        type: 'link',
        component: {
          preview: 'WeatherPreview',
          edit: 'WeatherEdit',
        },
        children: [],
      },
    ],
  },
];

export default structure;

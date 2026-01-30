import EventNoteIcon from '@mui/icons-material/EventNote';
import HearingIcon from '@mui/icons-material/Hearing';
import ExtensionIcon from '@mui/icons-material/Extension';
import BuildingIcon from '@mui/icons-material/Apartment';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import TypeIcon from '@mui/icons-material/TypeSpecimen';
import ActionIcon from '@mui/icons-material/AutoAwesome';
import ProgressIcon from '@mui/icons-material/AutoGraph';
import NeedleIcon from '@mui/icons-material/Gesture';
import GroupIcon from '@mui/icons-material/Group';
import ScalesIcon from '@mui/icons-material/Balance';
import BookIcon from '@mui/icons-material/Book';
import CityIcon from '@mui/icons-material/AccountTree';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import KeyIcon from '@mui/icons-material/VpnKey';
import CategoryIcon from '@mui/icons-material/Category';
import ToolsIcon from '@mui/icons-material/Build';
import KitIcon from '@mui/icons-material/HomeRepairService';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import { ulid as newId } from 'ulid';

export const getTabInfo = (tool) => {
  return {
    name: 'Untitled',
    id: newId(),
    mode: 'edit',
    tool,
    tabId: newId(),
    scroll: 0,
    preventSplit: tool === 'event' ? true : false,
  };
};

const structure = [
  {
    title: 'Tools',
    type: 'header',
    icon: ToolsIcon,
    children: [
      {
        title: 'Abstract Progress Tracker',
        icon: ProgressIcon,
        type: 'link',
        tool: 'apt',
        children: [
          {
            title: 'Create APT +',
            type: 'button',
            onClick: () => getTabInfo('apt'),
          },
          {
            title: 'What Is An APT?',
            type: 'button',
            onClick: () => null,
          },
        ],
      },
      {
        title: 'Actions',
        icon: ActionIcon,
        type: 'link',
        tool: 'action',
        children: [
          {
            title: 'Create Action +',
            type: 'button',
            onClick: () => getTabInfo('action'),
          },
          {
            title: 'What Is An Action?',
            type: 'button',
            onClick: () => null,
          },
        ],
      },
      {
        title: 'Attributes',
        icon: ExtensionIcon,
        type: 'link',
        tool: 'attribute',
        children: [
          {
            title: 'Create Attribute +',
            type: 'button',
            onClick: () => getTabInfo('attribute'),
          },
          {
            title: 'What Is An Attribute?',
            type: 'button',
            onClick: () => null,
          },
        ],
      },
      {
        title: 'Building',
        icon: BuildingIcon,
        type: 'link',
        tool: 'building',
        children: [
          {
            title: 'Create Building +',
            type: 'button',
            onClick: () => getTabInfo('building'),
          },
          {
            title: 'What Is A Building?',
            type: 'button',
            onClick: () => null,
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
            onClick: () => getTabInfo('category'),
          },
          {
            title: 'What Is A Category?',
            type: 'button',
            onClick: () => null,
          },
        ],
      },
      {
        title: 'Events',
        icon: EventNoteIcon,
        type: 'link',
        tool: 'event',
        component: {
          preview: 'EventPreview',
          edit: 'EventEdit',
        },
        children: [
          {
            title: 'Go To Event Creator ->',
            type: 'button',
            onClick: () => getTabInfo('event'),
          },
          {
            title: 'What Is An Event?',
            type: 'button',
            onClick: () => null,
          },
        ],
      },
      {
        title: 'Kits',
        icon: KitIcon,
        type: 'link',
        tool: 'kit',
        children: [
          {
            title: 'Create Kit +',
            type: 'button',
            onClick: () => getTabInfo('kit'),
          },
          {
            title: 'What Is A Kit?',
            type: 'button',
            onClick: () => null,
          },
        ],
      },
      {
        title: 'Listeners',
        icon: HearingIcon,
        type: 'link',
        tool: 'listener',
        component: {
          preview: 'ListenerPreview',
          edit: 'ListenerEdit',
        },
        children: [
          {
            title: 'Create Listener +',
            type: 'button',
            onClick: () => getTabInfo('listener'),
          },
          {
            title: 'What Is A Listener?',
            type: 'button',
            onClick: () => null,
          },
        ],
      },
      {
        title: 'Settlement Types',
        icon: TypeIcon,
        type: 'link',
        tool: 'settlementType',
        children: [
          {
            title: 'Create Settlement Type +',
            type: 'button',
            onClick: () => getTabInfo('settlementType'),
          },
          {
            title: 'What Is A Settlement Type?',
            type: 'button',
            onClick: () => null,
          },
        ],
      },
      {
        title: 'Settlements',
        icon: CityIcon,
        type: 'link',
        tool: 'settlement',
        children: [
          {
            title: 'Create Settlement +',
            type: 'button',
            onClick: () => getTabInfo('settlement'),
          },
          {
            title: 'What Is A Settlement?',
            type: 'button',
            onClick: () => null,
          },
        ],
      },
      {
        title: 'Statuses',
        icon: CoronavirusIcon,
        type: 'link',
        tool: 'gameStatus',
        children: [
          {
            title: 'Create Status +',
            type: 'button',
            onClick: () => getTabInfo('gameStatus'),
          },
          {
            title: 'What Is A Status?',
            type: 'button',
            onClick: () => null,
          },
        ],
      },
      {
        title: 'Story Thread',
        icon: NeedleIcon,
        type: 'link',
        tool: 'storyThread',
        children: [
          {
            title: 'Create Story Thread +',
            type: 'button',
            onClick: () => getTabInfo('storyThread'),
          },
          {
            title: 'What Is A Story Thread?',
            type: 'button',
            onClick: () => null,
          },
        ],
      },
      {
        title: 'Trade Hub',
        icon: ScalesIcon,
        type: 'link',
        tool: 'tradeHub',
        children: [
          {
            title: 'Create Trade Hub +',
            type: 'button',
            onClick: () => getTabInfo('tradeHub'),
          },
          {
            title: 'What Is A Trade Hub?',
            type: 'button',
            onClick: () => null,
          },
        ],
      },
      {
        title: 'Upgrades',
        icon: UpgradeIcon,
        type: 'link',
        tool: 'upgrade',
        children: [
          {
            title: 'Create Upgrade +',
            type: 'button',
            onClick: () => getTabInfo('upgrade'),
          },
          {
            title: 'What Is An Upgrade?',
            type: 'button',
            onClick: () => null,
          },
        ],
      },
    ],
  },
];

export default structure;

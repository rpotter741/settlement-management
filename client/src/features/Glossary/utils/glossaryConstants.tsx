import {
  Public as PublicIcon,
  AccountBalance as AccountBalanceIcon,
  WbShade as WbShadeIcon,
  Flag as FlagIcon,
  Map as MapIcon,
  Room as RoomIcon,
  Person as PersonIcon,
  Groups as GroupsIcon,
  Description as DescriptionIcon,
  CalendarMonth as CalendarMonthIcon,
  Terrain as TerrainIcon,
  Backpack,
  PieChart,
} from '@mui/icons-material';

export const entryTypeColors: Record<string, string> = {
  continent: '#e6194b',
  nation: '#ffe119 ',
  region: '#4363d8',
  settlement: '#f58231',
  district: '#911eb4 ',
  territory: '#e6beff',
  location: '	#9a6324 ',
  person: '#46f0f0',
  collective: '#fabebe',
  lore: '#008080',
  event: '#bcf60c ',
  landmark: '#3cb44b ',
  item: '#f032e6 ',
};

export const entryTypeIcons: Record<string, React.ReactNode> = {
  continent: (
    <PublicIcon sx={{ color: entryTypeColors.continent }} fontSize="small" />
  ),
  nation: (
    <AccountBalanceIcon
      sx={{ color: entryTypeColors.nation }}
      fontSize="small"
    />
  ),
  settlement: (
    <WbShadeIcon sx={{ color: entryTypeColors.settlement }} fontSize="small" />
  ),
  district: (
    <PieChart sx={{ color: entryTypeColors.district }} fontSize="small" />
  ),
  region: <MapIcon sx={{ color: entryTypeColors.region }} fontSize="small" />,
  territory: (
    <FlagIcon sx={{ color: entryTypeColors.territory }} fontSize="small" />
  ),
  location: (
    <RoomIcon sx={{ color: entryTypeColors.location }} fontSize="small" />
  ),
  person: (
    <PersonIcon sx={{ color: entryTypeColors.person }} fontSize="small" />
  ),
  collective: (
    <GroupsIcon sx={{ color: entryTypeColors.collective }} fontSize="small" />
  ),
  lore: (
    <DescriptionIcon sx={{ color: entryTypeColors.lore }} fontSize="small" />
  ),
  event: (
    <CalendarMonthIcon sx={{ color: entryTypeColors.event }} fontSize="small" />
  ),
  landmark: (
    <TerrainIcon sx={{ color: entryTypeColors.landmark }} fontSize="small" />
  ),
  item: <Backpack sx={{ color: entryTypeColors.item }} fontSize="small" />,
};

export type GlossaryEntryTypeString =
  | 'continent'
  | 'nation'
  | 'region'
  | 'settlement'
  | 'territory'
  | 'location'
  | 'person'
  | 'collective'
  | 'lore'
  | 'event'
  | 'landmark'
  | 'item';

export const entryTypes = ['location', 'person', 'lore', 'event', 'item'];

export const folderTypes = [
  'continent',
  'region',
  'nation',
  'territory',
  'landmark',
  'settlement',
  'district',
  'collective',
];

export const entryTypeRenderOrder = [
  'continent',
  'region',
  'nation',
  'territory',
  'landmark',
  'settlement',
  'collective',
  'location',
  'person',
  'lore',
  'event',
  'item',
];

export const fileTypes = ['person', 'lore', 'event', 'location', 'item'];

export const dragAcceptMap = {
  continent: [
    'region',
    'nation',
    'territory',
    'landmark',
    'settlement',
    'district',
    'collective',
    ...fileTypes,
  ],
  region: [
    'nation',
    'territory',
    'landmark',
    'settlement',
    'district',
    'collective',
    ...fileTypes,
  ],
  nation: [
    'territory',
    'landmark',
    'settlement',
    'district',
    'collective',
    ...fileTypes,
  ],
  territory: ['landmark', 'settlement', 'district', 'collective', ...fileTypes],
  landmark: ['settlement', 'district', 'collective', ...fileTypes],
  settlement: ['district', 'collective', ...fileTypes],
  district: ['collective', ...fileTypes],
  collective: [...fileTypes],
};

export function filterNodesByEntryType(allNodes: any[], entryType: string) {
  return allNodes.filter((node) => {
    return dragAcceptMap[
      node.entryType as keyof typeof dragAcceptMap
    ]?.includes(entryType);
  });
}

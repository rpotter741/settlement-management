export type DetailFileType = 'person' | 'location' | 'lore' | 'event';

function isDetailFileType(fileType: string): fileType is DetailFileType {
  return ['person', 'location', 'lore', 'event'].includes(fileType);
}

export default isDetailFileType;

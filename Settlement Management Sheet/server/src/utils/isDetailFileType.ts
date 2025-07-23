export type DetailFileType = 'person' | 'location' | 'note' | 'event';

function isDetailFileType(fileType: string): fileType is DetailFileType {
  return ['person', 'location', 'note', 'event'].includes(fileType);
}

export default isDetailFileType;

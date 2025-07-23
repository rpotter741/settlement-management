export const objectToMap = <T>(obj: Record<string, T>): Map<string, T> =>
  new Map(Object.entries(obj));

export const mapToObject = <T>(map: Map<string, T>): Record<string, T> =>
  Object.fromEntries(map);

export const mapToArray = <T>(map: Map<string, T>): T[] =>
  Array.from(map.values());

export const arrayToMap = <T extends { id: string }>(
  arr: T[]
): Map<string, T> => new Map(arr.map((item) => [item.id, item]));

const mapUtils = {
  fromObject: objectToMap,
  toObject: mapToObject,
  toArray: mapToArray,
  fromArray: arrayToMap,
};

export default mapUtils;

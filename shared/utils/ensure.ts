export function ensure<T extends object>(
  obj: T,
  key: string,
  init: object = {}
): any {
  return (obj as any)[key] ?? ((obj as any)[key] = init);
}

export default ensure;

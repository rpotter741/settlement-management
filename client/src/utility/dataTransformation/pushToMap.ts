export default function pushToMap<T extends string>({
  map,
  key,
  value,
}: {
  map: Partial<Record<T, string[]>>;
  key: T;
  value: string;
}) {
  return (map[key] ||= []).push(value);
}

export function alphabetize(arr: string[]): string[] {
  return [...arr].sort((a, b) => a.localeCompare(b));
}

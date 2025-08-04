import { get } from 'lodash';

export default function getTermChangeValue({
  glossaryTerms,
  key,
  value,
  defaultValue,
}: {
  glossaryTerms: Record<string, string>;
  key: string;
  value: string;
  defaultValue: string;
}) {
  const currentTerm = get(glossaryTerms, key, null);
  console.log('getTermChangeValue called with:', {
    glossaryTerms,
    key,
    value,
    defaultValue,
    currentTerm,
  });
  if (
    currentTerm === value ||
    (currentTerm === null && value === defaultValue)
  ) {
    return null; // No change needed
  }
  return { key, value }; // Return the new value to update
}

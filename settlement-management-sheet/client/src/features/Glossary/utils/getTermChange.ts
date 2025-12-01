import { get } from 'lodash';

export default function getTermChangeValue({
  glossaryTerms,
  key,
  value,
  defaultValue,
}: {
  glossaryTerms: Record<string, string | null>;
  key: string;
  value: string | null;
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
    console.log('inside term change, no changes found');
    return null; // No change needed
  }
  console.log('inside term change, changes found', { key, value });
  return { key, value }; // Return the new value to update
}

import { SmartSyncRule } from '@/features/Glossary/Modals/EditSmartSyncRule.js';
import LabelAndAutocomplete from './helpers/LabelAndAutocomplete.js';

const TargetAutocomplete = ({
  ruleState,
  setRuleState,
  getTarget,
  getTargetTooltip,
}: {
  ruleState: SmartSyncRule;
  setRuleState: React.Dispatch<React.SetStateAction<SmartSyncRule>>;
  getTarget: (option: string) => { group: string; label: string };
  getTargetTooltip: (label: string) => string;
}) => {
  //
  return (
    <LabelAndAutocomplete
      name="Target"
      onChange={(newValue: string) => {
        setRuleState((prev) => ({
          ...prev,
          target: StringToCamelCase(newValue) as SmartSyncRule['target'],
        }));
      }}
      value={getTarget(ruleState.target)}
      options={[
        { group: 'Relationship', label: 'Parent' },
        { group: 'Relationship', label: 'Child' },
        { group: 'Relationship', label: 'Sibling' },
        { group: 'Structure', label: 'Entry Type' },
        { group: 'Structure', label: 'Backlink' },
      ]}
      getTargetTooltip={getTargetTooltip}
    />
  );
};

export default TargetAutocomplete;

function StringToCamelCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
}

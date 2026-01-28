import { SmartSyncRule } from '@/features/Glossary/Modals/EditSmartSyncRule.js';
import LabelAndDropdown from './helpers/LabelAndDropdown.js';
import capitalize from '@/utility/inputs/capitalize.js';

const ScopeDropDown = ({
  ruleState,
  setRuleState,
}: {
  ruleState: SmartSyncRule;
  setRuleState: React.Dispatch<React.SetStateAction<SmartSyncRule>>;
}) => {
  //
  return (
    <LabelAndDropdown
      multiple={false}
      name="Scope"
      value={capitalize(ruleState.parameters.scope || 'branch')}
      options={['branch', 'global'].map((option) => capitalize(option))}
      onChange={(newValue) => {
        const val = Array.isArray(newValue)
          ? (newValue[0] ?? '')
          : (newValue ?? '');
        setRuleState((prev) => ({
          ...prev,
          parameters: {
            ...prev.parameters,
            scope: val.toLowerCase() as 'branch' | 'global',
          },
        }));
      }}
      relationship={false}
    />
  );
};

export default ScopeDropDown;

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
      value={ruleState.parameters.scope || 'Branch'}
      options={['Branch', 'Global']}
      onChange={(newValue) => {
        console.log(newValue);
        const val = Array.isArray(newValue)
          ? (newValue[0] ?? '')
          : (newValue ?? '');
        setRuleState((prev) => ({
          ...prev,
          parameters: {
            ...prev.parameters,
            scope: capitalize(val) as 'Branch' | 'Global',
          },
        }));
      }}
      relationship={false}
    />
  );
};

export default ScopeDropDown;

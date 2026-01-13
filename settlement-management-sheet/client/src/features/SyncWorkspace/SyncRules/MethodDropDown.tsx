import { SmartSyncRule } from '@/features/Glossary/Modals/EditSmartSyncRule.js';
import LabelAndDropdown from './helpers/LabelAndDropdown.js';

const MethodDropDown = ({
  ruleState,
  setRuleState,
}: {
  ruleState: SmartSyncRule;
  setRuleState: React.Dispatch<React.SetStateAction<SmartSyncRule>>;
}) => {
  return (
    <LabelAndDropdown
      relationship={false}
      multiple={false}
      name="Method"
      options={['Add', 'Remove', 'Monitor']}
      value={ruleState.operand as string | null}
      onChange={(newValue) => {
        setRuleState((prev) => ({
          ...prev,
          operand: newValue as SmartSyncRule['operand'],
        }));
      }}
    />
  );
};

export default MethodDropDown;

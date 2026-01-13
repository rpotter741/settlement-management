import { SmartSyncRule } from '@/features/Glossary/Modals/EditSmartSyncRule.js';
import LabelAndDropdown from './helpers/LabelAndDropdown.js';

const FirstMatchDropDown = ({
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
      name="First Match Only"
      value={ruleState.parameters.closest ? 'True' : 'False'}
      options={['False', 'True']}
      onChange={(newValue) => {
        console.log(newValue);
        const val = Array.isArray(newValue)
          ? (newValue[0] ?? '')
          : (newValue ?? '');
        setRuleState((prev) => ({
          ...prev,
          parameters: {
            ...prev.parameters,
            closest: val === 'true' ? true : false,
          },
        }));
      }}
      relationship={false}
    />
  );
};

export default FirstMatchDropDown;

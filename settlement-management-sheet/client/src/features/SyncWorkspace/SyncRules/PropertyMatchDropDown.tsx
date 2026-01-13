import { SmartSyncRule } from '@/features/Glossary/Modals/EditSmartSyncRule.js';
import LabelAndDropdown from './helpers/LabelAndDropdown.js';

const PropertyMatchDropDown = ({
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
      name="Property Match"
      value={ruleState.parameters.propertyMatch ? 'True' : 'False'}
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
            propertyMatch: val === 'true' ? true : false,
          },
        }));
      }}
      relationship={false}
    />
  );
};

export default PropertyMatchDropDown;

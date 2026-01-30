import { SmartSyncRule } from '@/features/Glossary/Modals/EditSmartSyncRule.js';
import LabelAndInput from './helpers/LabelAndInput.js';

const LimitInput = ({
  ruleState,
  setRuleState,
}: {
  ruleState: SmartSyncRule;
  setRuleState: React.Dispatch<React.SetStateAction<SmartSyncRule>>;
}) => {
  //
  return (
    <LabelAndInput
      name="Limit"
      value={
        ruleState.parameters.limit !== null
          ? ruleState.parameters.limit || 0
          : 0
      }
      onChange={(newValue: number | string) => {
        setRuleState((prev) => ({
          ...prev,
          parameters: {
            ...prev.parameters,
            limit: newValue as number,
          },
        }));
      }}
      disabled={ruleState.parameters.closest === true}
      type="number"
    />
  );
};

export default LimitInput;

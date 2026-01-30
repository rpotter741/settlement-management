import { SmartSyncRule } from '@/features/Glossary/Modals/EditSmartSyncRule.js';
import LabelAndInput from './helpers/LabelAndInput.js';

const HopsInput = ({
  ruleState,
  setRuleState,
  showDepth,
}: {
  ruleState: SmartSyncRule;
  setRuleState: React.Dispatch<React.SetStateAction<SmartSyncRule>>;
  showDepth: (target: SmartSyncRule['target']) => boolean;
}) => {
  //
  return (
    <LabelAndInput
      name="Hops"
      value={
        !showDepth(ruleState.target)
          ? 0
          : ruleState.depth !== null
            ? ruleState?.depth
            : 0
      }
      onChange={(newValue: number | string) => {
        setRuleState((prev) => ({
          ...prev,
          depth: newValue as number,
        }));
      }}
      disabled={!showDepth(ruleState.target)}
      type="number"
    />
  );
};

export default HopsInput;

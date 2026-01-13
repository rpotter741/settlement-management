import { usePropertyLabel } from '@/features/Glossary/utils/getPropertyLabel.js';
import {
  GlossaryEntryType,
  glossaryEntryTypeOptions,
} from '../../../../../shared/types/index.js';
import LabelAndDropdown from './helpers/LabelAndDropdown.js';
import { SmartSyncRule } from '@/features/Glossary/Modals/EditSmartSyncRule.js';

const TypeDropDown = ({
  ruleState,
  setRuleState,
}: {
  ruleState: SmartSyncRule;
  setRuleState: React.Dispatch<React.SetStateAction<SmartSyncRule>>;
}) => {
  const { getPropertyLabel } = usePropertyLabel();
  return (
    <LabelAndDropdown
      multiple={true}
      name="Type"
      options={glossaryEntryTypeOptions
        .map((opt) => getPropertyLabel(opt).label)
        .filter(
          (opt) => !ruleState.parameters.types?.includes(opt.toLowerCase())
        )}
      relationship={true}
      value={ruleState.parameters.types || null}
      onChange={(newValue) => {
        setRuleState((prev) => ({
          ...prev,
          parameters: {
            ...prev.parameters,
            types: newValue as GlossaryEntryType[],
          },
        }));
      }}
      disabled={true}
    />
  );
};

export default TypeDropDown;

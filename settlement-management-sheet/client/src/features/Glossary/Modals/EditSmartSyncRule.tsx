import { useModalActions } from '@/hooks/global/useModal.js';
import { Box, Button, Typography } from '@mui/material';
import { GenericObject } from '../../../../../shared/types/common.js';
import { GlossaryEntryType } from '../../../../../shared/types/index.js';
import { useState } from 'react';
import { SubTypeProperty } from '@/app/slice/subTypeSlice.js';
import { cloneDeep } from 'lodash';
import { useRelayChannel } from '@/hooks/global/useRelay.js';
import MethodDropDown from '@/features/SyncWorkspace/SyncRules/MethodDropDown.js';
import TargetAutocomplete from '@/features/SyncWorkspace/SyncRules/TargetDropDown.js';
import HopsInput from '@/features/SyncWorkspace/SyncRules/HopsInput.js';
import TypeDropDown from '@/features/SyncWorkspace/SyncRules/TypeDropDown.js';
import PropertyMatchDropDown from '@/features/SyncWorkspace/SyncRules/PropertyMatchDropDown.js';
import ScopeDropDown from '@/features/SyncWorkspace/SyncRules/ScopeDropDown.js';
import FirstMatchDropDown from '@/features/SyncWorkspace/SyncRules/FirstMatchDropDown.js';
import LimitInput from '@/features/SyncWorkspace/SyncRules/LimitInput.js';

export interface SmartSyncRule {
  operand: 'Add' | 'Remove';
  target: 'Child' | 'Sibling' | 'Parent' | 'Backlink' | 'Entry Type';
  depth: number;
  parameters: {
    types: GlossaryEntryType[];
    propertyMatch?: boolean;
    scope?: 'Branch' | 'Global';
    limit?: number;
    closest?: boolean;
  };
}

function getRule(
  rule: SmartSyncRule,
  property: SubTypeProperty
): SmartSyncRule {
  if (Object.keys(rule).length > 0) {
    return rule;
  } else {
    const parameters = { types: [] } as GenericObject & {
      types: GlossaryEntryType[];
    };
    if (property.inputType === 'dropdown') {
      const { relationship } = property.shape;
      if (relationship) {
        parameters['types'] = cloneDeep(relationship) || [];
      }
    }

    return {
      operand: 'Add',
      target: 'Child',
      depth: 1,
      parameters,
    };
  }
}

function getTarget(option: string): { group: string; label: string } {
  switch (option) {
    case 'Child':
      return { group: 'Relationship', label: 'Child' };
    case 'Sibling':
      return { group: 'Relationship', label: 'Sibling' };
    case 'Parent':
      return { group: 'Relationship', label: 'Parent' };
    case 'Backlink':
      return { group: 'Structure', label: 'Backlink' };
    case 'Entry Type':
      return { group: 'Structure', label: 'Entry Type' };
    default:
      return { group: '', label: '' };
  }
}

const showDepth = (target: string): boolean => {
  if (target === 'Backlink' || target === 'Sibling') return false;
  return true;
};

const EditSmartSyncRule = ({
  rule,
  property,
  isCompound,
}: {
  rule: SmartSyncRule;
  property: SubTypeProperty;
  isCompound: boolean;
}) => {
  //
  const { closeModal } = useModalActions();
  const [ruleState, setRuleState] = useState<SmartSyncRule>(
    getRule(rule, property)
  );

  const { openRelay } = useRelayChannel({
    id: 'property-smart-sync-rules',
  });

  const handleSave = () => {
    const ruleStateClone = cloneDeep(ruleState) as unknown as GenericObject;
    openRelay({
      data: ruleStateClone,
      status: 'complete',
    });
    closeModal();
  };

  return (
    <>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ width: '100%', textAlign: 'center' }}
      >
        Edit Smart Sync Rule
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
        <MethodDropDown ruleState={ruleState} setRuleState={setRuleState} />
        <TargetAutocomplete
          ruleState={ruleState}
          setRuleState={setRuleState}
          getTarget={getTarget}
          getTargetTooltip={getTargetTooltip}
        />
        <HopsInput
          ruleState={ruleState}
          setRuleState={setRuleState}
          showDepth={showDepth}
        />
      </Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ width: '100%', textAlign: 'center', my: 2 }}
      >
        Parameterization Options
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        <TypeDropDown ruleState={ruleState} setRuleState={setRuleState} />
        <PropertyMatchDropDown
          ruleState={ruleState}
          setRuleState={setRuleState}
        />
        <ScopeDropDown ruleState={ruleState} setRuleState={setRuleState} />
        <LimitInput ruleState={ruleState} setRuleState={setRuleState} />
        <FirstMatchDropDown ruleState={ruleState} setRuleState={setRuleState} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 4,
          px: 2,
        }}
      >
        <Button color="success" variant="contained" onClick={handleSave}>
          Save
        </Button>
        <Button color="error" variant="contained" onClick={() => closeModal()}>
          Cancel
        </Button>
      </Box>
    </>
  );
};

export default EditSmartSyncRule;

function getTargetTooltip(target: string): string {
  switch (target) {
    case 'Child':
      return 'Targets entries that are children of the entry, including all descendants up to and including the specified depth. For example, a depth of 2 includes children and grandchildren.';
    case 'Sibling':
      return 'Targets entries that share the same parent as the entry.';
    case 'Parent':
      return 'Targets entries that are parents of the entry, including all ancestors up to and including the specified depth. For example, a depth of 2 includes parents and grandparents.';
    case 'Backlink':
      return 'Targets entries that link back to the entry through a direct or indirect relationship (eg, dropdown or rich text description).';
    case 'Entry Type':
      return "Targets entries based solely on their type. This automatically includes all relationship types to the specified depth, where applicable. For example, at a depth of 2, this would search children, grandchildren, siblings, parents, parent's siblings, and grandparents and only select those entries that match the specified type(s).";
    default:
      return 'Oh shit we broke. Sorry! ';
  }
}

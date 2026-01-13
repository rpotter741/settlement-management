import React from 'react';
import {
  Box,
  Typography,
  Switch,
  Tooltip,
  Divider,
  IconButton,
} from '@mui/material';
import { useTools } from '@/hooks/tools/useTools.js';
import { useShellContext } from '@/context/ShellContext.js';
import ToolSwitch from '@/components/shared/DynamicForm/ToolSwitch.js';
import useSnackbar from '@/hooks/global/useSnackbar.js';
import { Help } from '@mui/icons-material';
import {
  AttrPropertyTypes,
  setActiveTab,
  setTabDisabled,
} from '../../state/editReducer.js';
import AttrMetaData from './AttrMetaData.js';
import GenreSelect from '@/components/shared/Metadata/GenreSelect.js';
import AttributeTagsTable from './TagTable.js';

interface AttrPropertiesProps {
  columns: number;
  activeTab: string;
  localDispatch: any;
  lastTab: AttrPropertyTypes;
  lastIndex: number;
}

const rules: Record<
  string,
  {
    disables: Array<string>;
    enables?: Array<string>;
  }
> = {
  isTradeable: {
    disables: ['properties.data.isCurrency'],
  },
  'properties.data.isCurrency': {
    disables: ['properties.data.requiresUpkeep', 'isTradeable'],
    enables: ['properties.data.canOverflow'],
  },
  'properties.data.requiresUpkeep': {
    disables: ['properties.data.isCurrency', 'properties.data.canHarvest'],
  },
  'properties.data.canGather': {
    disables: ['properties.data.requiresUpkeep'],
  },
};

const tabsKeyMap: Record<string, { key: string; value: boolean }> = {
  hasThresholds: { key: 'Thresholds', value: true },
  hasSPC: { key: 'SPC', value: true },
  'properties.data.isCurrency': { key: 'Currency', value: false },
  'properties.data.requiresUpkeep': { key: 'Upkeep', value: false },
  'properties.data.canGather': { key: 'Gather', value: false },
};

const AttrProperties: React.FC<AttrPropertiesProps> = ({
  columns,
  activeTab,
  lastTab,
  lastIndex,
  localDispatch,
}) => {
  const { tool, id, showModal, tabId, side } = useShellContext();
  const { edit: attr, updateTool: updateAttribute } = useTools(tool, id);
  const { makeSnackbar } = useSnackbar();

  const applyRules = (keypath: string, value: boolean) => {
    const rule = rules[keypath as keyof typeof rules];
    const tabToggle = tabsKeyMap[keypath as keyof typeof tabsKeyMap];
    if (tabToggle) {
      if (activeTab === tabToggle.key && !value) {
        localDispatch(setActiveTab(lastTab, lastIndex, true));
      }
      localDispatch(setTabDisabled(tabToggle.key as AttrPropertyTypes, !value));
    }
    if (!rule) return;
    if (value) {
      rule.disables?.forEach((disableKey: string) => {
        updateAttribute(disableKey, false);
      });
      if (rule?.enables) {
        rule?.enables?.forEach((enableKey: string) => {
          updateAttribute(enableKey, true);
        });
      }
    }
  };
  console.log(attr);
  if (!attr) return null;

  return (
    <>
      <AttrMetaData columns={columns} />
      <Box sx={{ gridColumn: `span ${columns}` }}>
        <GenreSelect
          defaultGenre={attr.genre}
          defaultSubGenre={attr.subGenre}
          updateFn={updateAttribute}
        />
      </Box>
      <Box
        sx={{
          gridColumn: `span ${columns}`,
          display: 'grid',
          gridTemplateColumns: ['1fr', '1fr', `repeat(${columns}, 1fr)`],
          gap: 2,
        }}
      >
        <Box>
          <Divider>
            Major Properties{' '}
            <IconButton size="small">
              <Help />
            </IconButton>
          </Divider>
          <ToolSwitch
            keypath="isPositive"
            trueLabel="Is Positive"
            falseLabel="Is Negative"
            falseColor="error"
            tooltip="Toggle if this attribute is positive or negative. A positive attribute is beneficial, while a negative attribute is detrimental."
          />
          <ToolSwitch
            keypath="canHurt"
            trueLabel="Can Hurt"
            falseLabel="Cannot Hurt"
            tooltip="Toggle if this attribute can affect health."
          />
          <ToolSwitch
            keypath="isTradeable"
            trueLabel="Can Trade"
            falseLabel="Cannot Trade"
            tooltip="Toggle if this attribute can be traded. This forces a baseline cost, and allows it to be added to Trading Hubs. Tradeable attributes cannot be currency."
            disabled={attr?.properties.data.isCurrency}
          />
          <ToolSwitch
            keypath="hasThresholds"
            trueLabel="Thresholds"
            falseLabel="No Thresholds"
            tooltip="Toggle if this attribute has unique thresholds. If disabled, default thresholds will be used internally."
            onChange={() => {
              applyRules('hasThresholds', !attr.hasThresholds);
              if (attr.hasThresholds) {
                makeSnackbar({
                  message: 'Default thresholds will be used.',
                  type: 'info',
                  duration: 3000,
                });
              }
            }}
          />
          <ToolSwitch
            keypath="hasSPC"
            trueLabel="Settlement Points"
            falseLabel="No Settlement Points"
            tooltip="Toggle if this attribute can be acquired through settlement points."
            onChange={() => {
              applyRules('hasSPC', !attr.hasSPC);
            }}
          />
        </Box>
        <Box>
          <Divider>
            Minor Properties{' '}
            <IconButton size="small">
              <Help />
            </IconButton>
          </Divider>
          <ToolSwitch
            keypath="properties.data.canOverflow"
            trueLabel="Can Overflow"
            falseLabel="Cannot Overflow"
            tooltip="Toggle if this attribute can overflow. Overflowing attributes can exceed their maximum value, but overages will not be counted towards calculations."
            disabled={attr?.properties.data.isCurrency}
          />
          <ToolSwitch
            keypath="properties.data.isCurrency"
            trueLabel="Is Currency"
            falseLabel="Not Currency"
            tooltip="Toggle if this attribute is treated as currency. This removes any cap on the attribute's value and allows it to integrate with the Tax System, among other things."
            disabled={attr?.isTradeable || attr?.properties.data.requiresUpkeep}
            onChange={(val) => {
              applyRules('properties.data.isCurrency', val);
              if (val && attr.properties.data.canGather) {
                makeSnackbar({
                  message:
                    'Currency attributes are rarely harvestable. Be sure this makes sense in your world!',
                  type: 'warning',
                  duration: 5000,
                });
              }
            }}
          />
          <ToolSwitch
            keypath="properties.data.requiresUpkeep"
            trueLabel="Requires Upkeep"
            falseLabel="No Upkeep Required"
            tooltip="Toggle if this attribute requires upkeep. This will add an upkeep cost to the attribute, which must be paid with a currency to keep it active."
            disabled={
              attr?.properties.data.isCurrency ||
              attr?.properties.data.canGather
            }
            onChange={(val) => {
              applyRules('properties.data.requiresUpkeep', val);
            }}
          />
          <ToolSwitch
            keypath="properties.data.canGather"
            trueLabel="Can Gather"
            falseLabel="Cannot Gather"
            tooltip="Toggle if this attribute can be acquired by assigning other attributes, e.g. 'Productivity', to it."
            disabled={attr?.properties.data.requiresUpkeep}
            onChange={(val) => {
              applyRules('properties.data.canGather', val);
              if (val && attr.properties.data.isCurrency) {
                makeSnackbar({
                  message:
                    'Harvestable attributes are rarely currency. Be sure this makes sense in your world!',
                  type: 'warning',
                  duration: 5000,
                });
              }
            }}
          />
        </Box>
      </Box>
      <AttributeTagsTable />
    </>
  );
};

export default AttrProperties;

import { Attribute, BaseTool, Condition, Impact, UUID } from '../index';

export interface ActionEffect {
  type: 'convert' | 'modify' | 'trigger' | 'consume';
  system: 'attribute' | 'status' | 'key' | 'apt';
  source?: string;
  target?: string;
  ratio?: string;
  limit?: string;
  attribute?: string;
  amount?: number;
}

export interface Action extends BaseTool {
  effects: ActionEffect[];
  conditions?: Condition[];
  cooldown?: string;
  flavorText?: string[];
}

export const parseAction = (action: Action, state: any) => {
  const results = action.effects.map((effect) => {
    switch (effect.type) {
      case 'convert':
        return handleConvert(effect, state);
      case 'modify':
        return handleModify(effect, state);
      case 'trigger':
        return handleTrigger(effect, state);
      case 'consume':
        return handleConsume(effect, state);
      default:
        throw new Error(`Unknown action type: ${effect.type}`);
    }
  });

  return results;
};

export const handleConvert = (effect: ActionEffect, state: any) => {
  const { source, target, ratio, limit } = effect;
  if (!source || !target || !ratio) {
    throw new Error(`Convert action missing required fields.`);
  }

  const [srcAmount, tgtAmount] = ratio.split(':').map(Number);
  const sourceValue = state.attributes[source] || 0;
  const maxTransfer =
    limit === 'max'
      ? sourceValue
      : Math.min(sourceValue, parseInt(limit || '0', 10));

  const transferAmount = Math.floor(maxTransfer / srcAmount) * tgtAmount;
  state.attributes[source] -= transferAmount;
  state.attributes[target] += transferAmount;

  return {
    type: 'convert',
    source,
    target,
    amount: transferAmount,
  };
};

export const handleModify = (effect: ActionEffect, state: any) => {
  const { attribute, amount } = effect;
  if (!attribute || amount === undefined) {
    throw new Error(`Modify action missing required fields.`);
  }

  state.attributes[attribute] = (state.attributes[attribute] || 0) + amount;

  return {
    type: 'modify',
    attribute,
    amount,
  };
};

export const handleTrigger = (effect: ActionEffect, state: any) => {
  const { target } = effect;
  if (!target) {
    throw new Error(`Trigger action missing required fields.`);
  }

  state.exposedKeys.push(target);

  return {
    type: 'trigger',
    target,
  };
};

export const handleConsume = (effect: ActionEffect, state: any) => {
  const { attribute, amount } = effect;
  if (!attribute || amount === undefined) {
    throw new Error(`Consume action missing required fields.`);
  }

  state.attributes[attribute] = Math.max(
    (state.attributes[attribute] || 0) - amount,
    0
  );

  return {
    type: 'consume',
    attribute,
    amount,
  };
};

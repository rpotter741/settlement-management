import React from 'react';
import doa from '@/utility/dataOrderActions.js';
import { useTools } from 'hooks/tools/useTools.js';
import { ToolName } from 'types/common.js';
import { cloneDeep } from 'lodash';

const addMapErrors: Record<string, any> = {
  thresholds: {
    name: 'Threshold name must be at least 3 characters long.',
    value: null,
  },
  settlementPointCost: {
    name: null,
    value: null,
  },
};

const useOrderedData = <T,>(
  tool: ToolName,
  id: string,
  keypath: string
): {
  data: Record<string, T>;
  order: string[];
  errors: Record<string, string | null>;
  add: ({ id, entry, sort }: { id: string; entry: T; sort: boolean }) => void;
  remove: (id: string) => void;
  reorder: (from: number, to: number) => void;
} => {
  const {
    selectEditValue,
    updateTool,
    errors: keypathErrors,
    validateToolField,
  } = useTools(tool, id);
  const base = selectEditValue(keypath); // e.g., "thresholds"
  const errors = keypathErrors[keypath] || {};

  const { data, order } = base;

  const add = ({
    id,
    entry,
    sort = false,
  }: {
    id: string;
    entry: T;
    sort: boolean;
  }) => {
    const updated = doa.add({
      id,
      entry,
      data,
      order,
      sort,
    });
    updateTool(keypath, updated);
    const newErrors = cloneDeep(errors);
    if (!addMapErrors[keypath]) {
      console.warn(`Add ${keypath} in addMap at top of useOrderedData.jsx`);
      return;
    }
    newErrors.data[id] = { ...addMapErrors[keypath] };
    validateToolField(`${keypath}`, newErrors);
  };

  const remove = (id: string) => {
    const updated = doa.remove({ id, data, order });
    updateTool(keypath, updated);
    const newErrors = cloneDeep(errors);
    delete newErrors[id];
    validateToolField(`${keypath}`, newErrors);
  };

  const reorder = (from: number, to: number) => {
    const updated = doa.reorder({ from, to, data, order });
    updateTool(keypath, updated);
  };

  return { data, order, errors, add, remove, reorder };
};

export default useOrderedData;

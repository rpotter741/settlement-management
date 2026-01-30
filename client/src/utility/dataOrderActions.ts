import { clone } from 'lodash';

const addDataOrder = ({
  id,
  entry,
  data,
  order,
  sort = false,
}: {
  id: string;
  entry: any;
  data: Record<string, any>;
  order: string[];
  sort?: boolean;
}) => {
  if (data[id]) {
    console.warn(`Entry with id ${id} already exists. Skipping add.`);
    return { data, order };
  }

  const newData = clone(data);
  newData[id] = entry;
  const newOrder = [...order, id];
  if (sort) {
    newOrder.sort((a, b) => {
      const aValue = newData[a]?.max || newData[a]?.value || 0;
      const bValue = newData[b]?.max || newData[b]?.value || 0;
      return aValue - bValue;
    });
  }
  return { data: newData, order: newOrder };
};

const removeDataOrder = ({
  id,
  data,
  order,
}: {
  id: string;
  data: Record<string, any>;
  order: string[];
}) => {
  if (!data[id]) {
    console.warn(`Entry with id ${id} does not exist. Skipping remove.`);
    return { data, order };
  }

  const newData = { ...data };
  delete newData[id];
  const newOrder = order.filter((item) => item !== id);
  return { data: newData, order: newOrder };
};

const reorderDataOrder = ({
  from,
  to,
  data,
  order,
}: {
  from: number;
  to: number;
  data: Record<string, any>;
  order: string[];
}) => {
  if (from < 0 || from >= order.length || to < 0 || to >= order.length) {
    console.warn(
      `Invalid indices for reorder: from ${from}, to ${to}. Skipping.`
    );
    return { data, order };
  }

  const newOrder = [...order];
  const [movedItem] = newOrder.splice(from, 1);
  newOrder.splice(to, 0, movedItem);

  return { data, order: newOrder };
};

const dataOrderAdjuster = {
  add: addDataOrder,
  remove: removeDataOrder,
  reorder: reorderDataOrder,
};

export default dataOrderAdjuster;

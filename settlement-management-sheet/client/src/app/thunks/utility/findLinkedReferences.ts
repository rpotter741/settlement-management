import { cloneDeep } from 'lodash';

export default function findLinkedReferences({
  source,
  subType,
  linkedId,
}: {
  source: any;
  subType: any;
  linkedId: string[];
}): {
  id: string;
  data: { keypath: string; oldValue: any; newValue: any }[];
} | null {
  if (!source || !linkedId)
    throw new Error("Can't remove property link. You done goofed.");
  const data: {
    keypath: string;
    oldValue: any;
    newValue: any;
    compKey?: string;
  }[] = [];
  const workingSource = cloneDeep(source);

  Object.entries(workingSource.groups).forEach(
    ([groupKey, group]: [string, any]) => {
      Object.entries(group.properties).forEach(
        ([propKey, prop]: [string, any]) => {
          const subTypeProperty =
            subType.groupData?.[groupKey]?.propertyData?.[propKey];
          if (subTypeProperty?.relationship) {
            if (Array.isArray(prop.value)) {
              const index = prop.value.findIndex((id: string) =>
                linkedId.includes(id)
              );
              if (index !== -1) {
                const keypath = `groups.${groupKey}.properties.${propKey}.value`;
                const newValue = [...prop.value].filter(
                  (id: string) => !linkedId.includes(id)
                );
                data.push({ keypath, oldValue: prop.value, newValue });
              }
            } else {
              if (linkedId.includes(prop.value)) {
                const keypath = `groups.${groupKey}.properties.${propKey}.value`;
                data.push({ keypath, oldValue: prop.value, newValue: '' });
              }
            }
          } else {
            if (subTypeProperty?.type === 'compound') {
              Object.entries(prop.value).forEach(
                ([compKey, compValue]: [string, any]) => {
                  if (linkedId.includes(compValue.left.value)) {
                    const keypath = `groups.${groupKey}.properties.${propKey}.value.${compKey}.left.value`;
                    const newValue = '';
                    data.push({
                      keypath,
                      oldValue: compValue.left.value,
                      newValue,
                      compKey,
                    });
                  }
                  if (linkedId.includes(compValue.right.value)) {
                    const keypath = `groups.${groupKey}.properties.${propKey}.value.${compKey}.right.value`;
                    const newValue = '';
                    data.push({
                      keypath,
                      oldValue: compValue.right.value,
                      newValue,
                      compKey,
                    });
                  }
                }
              );
            }
          }
        }
      );
    }
  );

  return data.length > 0 ? { id: source.id, data } : null;
}

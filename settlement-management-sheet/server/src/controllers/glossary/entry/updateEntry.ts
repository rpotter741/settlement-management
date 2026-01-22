import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';
import _ from 'lodash';

const subTypeCache: Record<
  string,
  {
    data: Promise<any>;
    timeout: NodeJS.Timeout;
  }
> = {};
const subTypeCacheDuration = 5 * 60 * 1000; // 5 minutes

export function getSubTypeCached(
  subTypeId: string,
  loader: () => Promise<any>
) {
  // Hit: return cached promise
  if (subTypeCache[subTypeId]) {
    return subTypeCache[subTypeId].data;
  }

  // Miss: create promise and cache it immediately
  const promise = loader().then((subType) => {
    // Cache the resolved value (wrapped in resolved promise)
    if (subTypeCache[subTypeId]) {
      clearTimeout(subTypeCache[subTypeId].timeout);
    }

    subTypeCache[subTypeId] = {
      data: Promise.resolve(subType), // cache resolved promise
      timeout: setTimeout(() => {
        delete subTypeCache[subTypeId];
      }, subTypeCacheDuration),
    };

    return subType;
  });

  // Cache the pending promise immediately
  subTypeCache[subTypeId] = {
    data: promise,
    timeout: setTimeout(() => {
      delete subTypeCache[subTypeId];
    }, subTypeCacheDuration),
  };

  return promise;
}

export default async function updateEntry(req: any, res: any) {
  const {
    id,
    subTypeId,
    groups,
    primaryAnchorValue,
    secondaryAnchorValue,
  }: {
    id: string;
    subTypeId: string;
    groups: any;
    primaryAnchorValue: string;
    secondaryAnchorValue: string;
  } = req.body;
  if (
    !requireFields(
      [
        'id',
        'subTypeId',
        'groups',
        'primaryAnchorValue',
        'secondaryAnchorValue',
      ],
      req.body,
      res
    )
  )
    return;

  try {
    const subType = await getSubTypeCached(subTypeId, async () => {
      return prisma.entrySubType.findUnique({
        where: { id: subTypeId },
        include: {
          groups: {
            include: {
              group: {
                include: {
                  properties: {
                    include: {
                      property: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    });
    const entry = await prisma.glossaryEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      return res
        .status(404)
        .json({ message: `Entry with id ${id} not found.` });
    }

    const updateNodeSubType = entry.subTypeId !== subTypeId;

    const oldIds = extractAllRelationshipIds(
      entry.groups as Record<string, any>,
      subType
    );

    const newIds = extractAllRelationshipIds(groups, subType);

    console.table([...oldIds, 'oldIds', ...newIds, 'newIds']);

    const toAdd = newIds.filter(
      (idData) =>
        !oldIds.find(
          (oldId) =>
            oldId.id === idData.id && oldId.propertyId === idData.propertyId
        )
    );

    const toRemove = oldIds.filter(
      (idData) =>
        !newIds.find(
          (newId) =>
            newId.id === idData.id && newId.propertyId === idData.propertyId
        )
    );

    console.table([...toAdd, 'toAdd', ...toRemove, 'toRemove']);

    const toAddArray = toAdd.map((data) => data.id).filter(Boolean);

    const newGroups: any = _.cloneDeep(entry.groups);
    if (!newGroups) {
      return res
        .status(500)
        .json({ message: `Entry with id ${id} has no groups data.` });
    }

    const targetEntries = await prisma.glossaryEntry.findMany({
      where: { id: { in: toAddArray } },
      select: { id: true, name: true },
    });

    const nameMap = Object.fromEntries(
      targetEntries.map((e) => [e.id, e.name])
    );

    const { newEntry, backlinksTo, backlinksFrom } = await prisma.$transaction(
      async (tx) => {
        let newEntry, backlinksTo, backlinksFrom;
        if (toAdd.length) {
          await tx.backlinkIndex.createMany({
            data: toAdd.map((item: BackLinkShape) => ({
              sourceId: id,
              targetId: item.id,
              type: item.type as
                | 'direct'
                | 'indirect'
                | 'hierarchal'
                | 'directCompound',
              fromNameAtLink: entry?.name || '',
              toNameAtLink: nameMap[item.id as keyof typeof nameMap] || '',
              propertyId: item.propertyId || '',
              propertyName: item.propertyName || '',
              propertyValue: item.propertyValue || '',
            })),
          });
          backlinksTo = await tx.backlinkIndex.findMany({
            where: {
              targetId: id,
            },
          });
        }
        if (toRemove.length) {
          for (const item of toRemove) {
            // clean up any ignoredAt fields or other metadata here if needed in future
            console.log('removing backlink to ', item.id);
            await tx.backlinkIndex.deleteMany({
              where: {
                sourceId: id,
                targetId: item.id,
                propertyId: item.propertyId,
              },
            });
          }
          backlinksFrom = await tx.backlinkIndex.findMany({
            where: {
              sourceId: id,
            },
          });
        }

        newEntry = await tx.glossaryEntry.update({
          where: { id },
          data: {
            groups,
            primaryAnchorValue,
            secondaryAnchorValue,
            subTypeId,
          },
        });

        if (updateNodeSubType) {
          await tx.glossaryNode.update({
            where: { id },
            data: {
              subTypeId,
            },
          });
        }
        return { newEntry, backlinksFrom, backlinksTo };
      }
    );

    return res.json({
      message: `Entry updated successfully.`,
      data: {
        newEntry,
        backlinksFrom,
        backlinksTo,
      },
    });
  } catch (error: any) {
    console.error(`Error updating entry for id ${id}:`, error);

    if (error.code === 'P2025') {
      // Prisma: record not found
      return res.status(404).json({ message: 'Entry or subtype not found' });
    }

    if (error.code === 'P2034') {
      // Prisma: transaction conflict
      return res.status(409).json({ message: 'Conflict. Please retry.' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
}

function extractAllRelationshipIds(
  groups: Record<string, any>,
  subType: any
): BackLinkShape[] {
  const ids: BackLinkShape[] = [];

  const allGroups = subType.groups.map((groupLink: any) => groupLink.group);
  const allProperties = allGroups.flatMap((group: any) =>
    group.properties.map((propertyLink: any) => propertyLink.property)
  );

  for (const [groupId, group] of Object.entries(groups)) {
    for (const [propertyId, property] of Object.entries(group.properties) as [
      string,
      any,
    ][]) {
      const propDef = allProperties.find((p: any) => p.id === propertyId);
      if (!propDef) continue;
      if (propDef.shape.relationship) {
        const value = property.value;
        if (Array.isArray(value)) {
          value.forEach((id) =>
            ids.push({
              id,
              propertyName: propDef.name,
              propertyValue: property.value,
              propertyId,
              type: 'direct',
            })
          );
        } else {
          ids.push({
            id: value,
            propertyName: propDef.name,
            propertyValue: property.value,
            propertyId,
            type: 'direct',
          });
        }
      }

      if (propDef.inputType === 'compound') {
        Object.entries(property.value || {}).forEach(
          ([key, compValue]: any, index: number) => {
            if (propDef.shape.left?.shape?.relationship) {
              const leftVal = compValue.left?.value;
              if (Array.isArray(leftVal))
                leftVal.forEach((id) =>
                  ids.push({
                    id,
                    propertyName: propDef.shape.left.name,
                    propertyValue: leftVal,
                    //@ts-ignore
                    propertyId: null,
                    type: 'directCompound',
                  })
                );
              else if (leftVal)
                ids.push({
                  id: leftVal,
                  propertyName: propDef.shape.left.name,
                  propertyValue: leftVal,
                  //@ts-ignore
                  propertyId: null,
                  type: 'directCompound',
                });
            }
            if (propDef.shape.right?.shape?.relationship) {
              const rightVal = compValue.right?.value;
              if (Array.isArray(rightVal))
                rightVal.forEach((id) =>
                  ids.push({
                    id,
                    propertyName: propDef.shape.right.name,
                    propertyValue: rightVal,
                    //@ts-ignore
                    propertyId: null,
                    type: 'directCompound',
                  })
                );
              else if (rightVal)
                ids.push({
                  id: rightVal,
                  propertyName: propDef.shape.right.name,
                  propertyValue: rightVal,
                  //@ts-ignore
                  propertyId: null,
                  type: 'directCompound',
                });
            }
          }
        );
      }
    }
  }

  return ids.filter((item) => item.id);
}

export type BackLinkShape = {
  id: string;
  propertyName: string;
  propertyValue: string | string[];
  propertyId: string;
  type: 'direct' | 'indirect' | 'hierarchal' | 'directCompound';
};

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

    const oldIds = extractAllRelationshipIds(
      entry.groups as Record<string, any>,
      subType
    );
    const newIds = extractAllRelationshipIds(groups, subType);

    const toAdd = [...newIds].filter((id) => !oldIds.has(id));
    const toRemove = [...oldIds].filter((id) => !newIds.has(id));

    const newGroups: any = _.cloneDeep(entry.groups);
    if (!newGroups) {
      return res
        .status(500)
        .json({ message: `Entry with id ${id} has no groups data.` });
    }

    const targetEntries = await prisma.glossaryEntry.findMany({
      where: { id: { in: toAdd } },
      select: { id: true, name: true },
    });

    const nameMap = Object.fromEntries(
      targetEntries.map((e) => [e.id, e.name])
    );

    // futhermore, for the sync workspace, we'll grab all backlinks where sourceId === entryId OR targetId === entryId. By doing this, rendering the sync workspace has everything needed (name, property) to showcase the backlinks in either direction without further queries. Add an `ignoredAt` field to the backlinkIndex instead of an isIgnored boolean, so that we can maybe filter by ignored date. Probably don't need a badge unless 'unanswered' backlinks exceeds a certain number (eg, 5) but we'll see.

    await prisma.$transaction(async (tx) => {
      if (toAdd.length) {
        await tx.backlinkIndex.createMany({
          data: toAdd.map((targetId) => ({
            sourceId: id,
            targetId,
            type: 'dropdown',
            fromNameAtLink: entry?.name || null,
            toNameAtLink: nameMap[targetId] || null,
          })),
        });
      }
      if (toRemove.length) {
        await tx.backlinkIndex.deleteMany({
          where: {
            sourceId: id,
            targetId: { in: toRemove },
          },
        });
      }

      await tx.glossaryEntry.update({
        where: { id },
        data: {
          groups,
          primaryAnchorValue,
          secondaryAnchorValue,
        },
      });
    });

    return res.json({ message: `Entry updated successfully.` });
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

function extractIdsFromCompound(
  sourceData: Record<string, any>,
  side: 'left' | 'right'
): string[] {
  return Object.values(sourceData)
    .flatMap((compValue: any) => {
      const value = compValue[side]?.value;
      return Array.isArray(value) ? value : [value];
    })
    .filter(Boolean);
}

function extractAllRelationshipIds(
  groups: Record<string, any>,
  subType: any
): Set<string> {
  const ids = new Set<string>();

  for (const [groupKey, group] of Object.entries(groups)) {
    for (const [propKey, property] of Object.entries(group.properties) as [
      string,
      any,
    ][]) {
      const propDef = subType.groupData?.[groupKey]?.propertyData?.[propKey];
      if (!propDef) continue;

      if (propDef.relationship) {
        // Simple relationship (dropdown)
        const value = property.value;
        if (Array.isArray(value)) {
          value.forEach((id) => ids.add(id));
        } else if (value) {
          ids.add(value);
        }
      }

      if (propDef.type === 'compound') {
        // Compound relationship
        Object.values(property.value || {}).forEach((compValue: any) => {
          if (propDef.left?.relationship) {
            const leftVal = compValue.left?.value;
            if (Array.isArray(leftVal)) leftVal.forEach((id) => ids.add(id));
            else if (leftVal) ids.add(leftVal);
          }
          if (propDef.right?.relationship) {
            const rightVal = compValue.right?.value;
            if (Array.isArray(rightVal)) rightVal.forEach((id) => ids.add(id));
            else if (rightVal) ids.add(rightVal);
          }
        });
      }
    }
  }

  return ids;
}

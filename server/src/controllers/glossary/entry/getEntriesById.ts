import _ from 'lodash';
import { GenericObject } from '../../../../../shared/types/index.ts';
import prisma from '../../../db/db.ts';
import glossaryModelMap from '../../../utils/glossaryModelMap.ts';
import isDetailFileType from '../../../utils/isDetailFileType.ts';
import requireFields from '../../../utils/requireFields.ts';
import generateFormSource from '../../../utils/generateFormSource.ts';

export default async function getEntriesById(req: any, res: any) {
  try {
    const { ids } = req.body;
    if (!requireFields(['ids'], req.body, res)) return;
    const result = await prisma.$transaction(async (tx) => {
      const entries = await tx.glossaryEntry.findMany({
        where: { id: { in: ids } },
        include: {
          subType: {
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
          },
        },
      });
      const backlinks = await tx.backlinkIndex.findMany({
        where: { OR: [{ targetId: { in: ids } }, { sourceId: { in: ids } }] },
      });
      return { entries, backlinks };
    });

    if (!result || result.entries.length === 0) {
      return res.status(404).json({ message: `Entries not found.` });
    }
    const { backlinks } = result;
    return res.json(result);
  } catch (error) {
    console.error(`Error getting glossary node by ID:`, error);
    return res
      .status(500)
      .json({ message: `Error getting glossary node by ID.` });
  }
}

export function validateDocumentShape(
  source: any,
  shape: any
):
  | {
      source: GenericObject;
      newPropertyCount: number;
      deletedPropertyCount: number;
    }
  | false {
  if (!source || !shape) return false;

  const newSource = _.cloneDeep(source);

  const sourceProperties: Record<string, any> = {};
  Object.values(source.groups).forEach((g: any) => {
    Object.values(g.properties).forEach(
      (p: any) => (sourceProperties[p.id] = p)
    );
  });
  const allGroups = shape.groups.map((g: any) => g.group);
  const allProperties = allGroups.flatMap((g: any) =>
    g.properties.map((p: any) => p.property)
  );

  const newSourceData: { [key: string]: any } = generateFormSource(
    shape,
    allGroups,
    allProperties
  );
  newSource.groups = newSourceData.groups;

  let newPropertyCount = 0;
  // do a crawl through and compare ids of groups / keys to ensure they match / the data is the same and ports over from old to new
  Object.values(newSource.groups).forEach((g: any) => {
    Object.values(g.properties).forEach((p: any) => {
      const existingProp = sourceProperties[p.id];
      if (existingProp) {
        if (p.order) {
          p.order = _.cloneDeep(existingProp.order);
        }
        p.value = _.cloneDeep(existingProp.value);
        delete sourceProperties[p.id];
      } else {
        newPropertyCount++;
      }
      if (p.id === newSource.primaryAnchorId) {
        newSource.primaryAnchorValue = p.value;
      }
      if (p.id === newSource.secondaryAnchorId) {
        newSource.secondaryAnchorValue = p.value;
      }
    });
  });

  return {
    source: newSource,
    newPropertyCount,
    deletedPropertyCount: Object.keys(sourceProperties).length,
  };
}

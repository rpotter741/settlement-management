import isAdminUserId from '../../utils/isAdminUserId';
import prisma from '../db.js';

export const GeographyHandler = {
  create: async ({
    id,
    name,
    userId,
    glossaryId,
    parentId,
    version,
  }: {
    id: string;
    name: string;
    userId: string;
    glossaryId: string;
    parentId?: string | null;
    version: number;
  }) => {
    // Implementation for creating a geography entry
    const entry = {
      id,
      name,
      userId,
      glossaryId,
      version,
      parentId: parentId ?? null,
    };
    return prisma.glossaryGeography.create({ data: entry });
  },
};

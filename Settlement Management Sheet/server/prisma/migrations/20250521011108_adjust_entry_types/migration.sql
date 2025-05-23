/*
  Warnings:

  - The values [Region,Location,POI,Person,Faction] on the enum `EntryTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EntryTypes_new" AS ENUM ('region', 'location', 'poi', 'person', 'faction');
ALTER TABLE "GlossaryNode" ALTER COLUMN "entryType" TYPE "EntryTypes_new" USING ("entryType"::text::"EntryTypes_new");
ALTER TYPE "EntryTypes" RENAME TO "EntryTypes_old";
ALTER TYPE "EntryTypes_new" RENAME TO "EntryTypes";
DROP TYPE "EntryTypes_old";
COMMIT;

/*
  Warnings:

  - The values [domain,province,faction,note] on the enum `EntryTypes` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `faction` on the `TradeHub` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EntryTypes_new" AS ENUM ('continent', 'region', 'nation', 'territory', 'landmark', 'settlement', 'collective', 'location', 'person', 'lore', 'item', 'event');
ALTER TABLE "GlossaryNode" ALTER COLUMN "entryType" TYPE "EntryTypes_new" USING ("entryType"::text::"EntryTypes_new");
ALTER TABLE "GlossaryEntry" ALTER COLUMN "entryType" TYPE "EntryTypes_new" USING ("entryType"::text::"EntryTypes_new");
ALTER TABLE "EntrySubType" ALTER COLUMN "entryType" TYPE "EntryTypes_new" USING ("entryType"::text::"EntryTypes_new");
ALTER TYPE "EntryTypes" RENAME TO "EntryTypes_old";
ALTER TYPE "EntryTypes_new" RENAME TO "EntryTypes";
DROP TYPE "EntryTypes_old";
COMMIT;

-- AlterTable
ALTER TABLE "TradeHub" DROP COLUMN "faction",
ADD COLUMN     "collective" TEXT;

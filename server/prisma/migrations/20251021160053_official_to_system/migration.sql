/*
  Warnings:

  - The values [OFFICIAL] on the enum `ContentTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContentTypes_new" AS ENUM ('SYSTEM', 'CUSTOM');
ALTER TABLE "Attribute" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "Category" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "Event" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "Listener" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "Kit" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "Key" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "gameStatus" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "Building" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "Upgrade" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "TradeHub" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "SettlementType" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "Settlement" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "APT" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "Action" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "StoryThread" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "GlossaryTheme" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "Glossary" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "GlossaryEntry" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TABLE "EntrySubType" ALTER COLUMN "contentType" TYPE "ContentTypes_new" USING ("contentType"::text::"ContentTypes_new");
ALTER TYPE "ContentTypes" RENAME TO "ContentTypes_old";
ALTER TYPE "ContentTypes_new" RENAME TO "ContentTypes";
DROP TYPE "ContentTypes_old";
COMMIT;

/*
  Warnings:

  - The values [folder,file] on the enum `GlossShape` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GlossShape_new" AS ENUM ('section', 'detail');
ALTER TABLE "GlossaryNode" ALTER COLUMN "fileType" TYPE "GlossShape_new" USING ("fileType"::text::"GlossShape_new");
ALTER TYPE "GlossShape" RENAME TO "GlossShape_old";
ALTER TYPE "GlossShape_new" RENAME TO "GlossShape";
DROP TYPE "GlossShape_old";
COMMIT;

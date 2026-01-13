/*
  Warnings:

  - The `primaryAnchorValue` column on the `GlossaryEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `secondaryAnchorValue` column on the `GlossaryEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "GlossaryEntry" DROP COLUMN "primaryAnchorValue",
ADD COLUMN     "primaryAnchorValue" JSONB,
DROP COLUMN "secondaryAnchorValue",
ADD COLUMN     "secondaryAnchorValue" JSONB;

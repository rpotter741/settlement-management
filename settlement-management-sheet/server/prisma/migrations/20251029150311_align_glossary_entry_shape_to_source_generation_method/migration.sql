/*
  Warnings:

  - You are about to drop the column `dataString` on the `GlossaryEntry` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `GlossaryEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BacklinkIndex" ALTER COLUMN "type" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GlossaryEntry" DROP COLUMN "dataString",
DROP COLUMN "description",
ADD COLUMN     "groups" JSONB;

/*
  Warnings:

  - You are about to drop the column `type` on the `GlossarySection` table. All the data in the column will be lost.
  - Added the required column `entryType` to the `GlossarySection` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GlossarySection_type_idx";

-- DropIndex
DROP INDEX "GlossarySection_type_subType_idx";

-- AlterTable
ALTER TABLE "GlossaryGeography" ALTER COLUMN "entryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GlossaryHistory" ALTER COLUMN "entryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GlossaryPolitical" ALTER COLUMN "entryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GlossaryRelationships" ALTER COLUMN "entryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GlossarySection" DROP COLUMN "type",
ADD COLUMN     "entryType" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "GlossarySection_entryType_idx" ON "GlossarySection"("entryType");

-- CreateIndex
CREATE INDEX "GlossarySection_entryType_subType_idx" ON "GlossarySection"("entryType", "subType");

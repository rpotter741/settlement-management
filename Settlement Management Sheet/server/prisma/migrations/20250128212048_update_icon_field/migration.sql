/*
  Warnings:

  - Changed the type of `icon` on the `Attribute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "icon",
ADD COLUMN     "icon" JSONB NOT NULL;

-- CreateIndex
CREATE INDEX "Attribute_refId_updatedAt_idx" ON "Attribute"("refId", "updatedAt" DESC);

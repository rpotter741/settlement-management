/*
  Warnings:

  - A unique constraint covering the columns `[sourceId,targetId]` on the table `BacklinkIndex` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "BacklinkIndex_sourceId_targetId_propertyId_key";

-- CreateIndex
CREATE UNIQUE INDEX "BacklinkIndex_sourceId_targetId_key" ON "BacklinkIndex"("sourceId", "targetId");

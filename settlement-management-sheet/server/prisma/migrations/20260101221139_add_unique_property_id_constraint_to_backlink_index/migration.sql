/*
  Warnings:

  - A unique constraint covering the columns `[sourceId,targetId,propertyId]` on the table `BacklinkIndex` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "BacklinkIndex_sourceId_targetId_key";

-- CreateIndex
CREATE UNIQUE INDEX "BacklinkIndex_sourceId_targetId_propertyId_key" ON "BacklinkIndex"("sourceId", "targetId", "propertyId");

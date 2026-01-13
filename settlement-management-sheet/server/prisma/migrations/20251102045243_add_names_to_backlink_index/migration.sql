/*
  Warnings:

  - A unique constraint covering the columns `[sourceId,targetId,type]` on the table `BacklinkIndex` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BacklinkIndex" ADD COLUMN     "fromNameAtLink" TEXT,
ADD COLUMN     "toNameAtLink" TEXT;

-- CreateIndex
CREATE INDEX "BacklinkIndex_targetId_idx" ON "BacklinkIndex"("targetId");

-- CreateIndex
CREATE UNIQUE INDEX "BacklinkIndex_sourceId_targetId_type_key" ON "BacklinkIndex"("sourceId", "targetId", "type");

/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Attribute` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Building` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `GameStatus` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Listener` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Region` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Settlement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `SettlementType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `TradeHub` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Upgrade` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Attribute_refId_updatedAt_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_id_key" ON "Attribute"("id");

-- CreateIndex
CREATE INDEX "Attribute_id_updatedAt_idx" ON "Attribute"("id", "updatedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Building_id_key" ON "Building"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Category_id_key" ON "Category"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Event_id_key" ON "Event"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GameStatus_id_key" ON "GameStatus"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Listener_id_key" ON "Listener"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Location_id_key" ON "Location"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Region_id_key" ON "Region"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Settlement_id_key" ON "Settlement"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SettlementType_id_key" ON "SettlementType"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TradeHub_id_key" ON "TradeHub"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Upgrade_id_key" ON "Upgrade"("id");

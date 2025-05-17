/*
  Warnings:

  - You are about to drop the column `upgrades` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `resolutions` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `eventRefs` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `linkedRegion` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `linkedRegionId` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `locations` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `pop` on the `Settlement` table. All the data in the column will be lost.
  - You are about to drop the column `ability` on the `Upgrade` table. All the data in the column will be lost.
  - You are about to drop the column `impacts` on the `Upgrade` table. All the data in the column will be lost.
  - You are about to drop the column `upgradeType` on the `Upgrade` table. All the data in the column will be lost.
  - Added the required column `impacts` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialCost` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metrics` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entryPhaseId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `replacement` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `climate` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentType` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terrain` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Location` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `climate` to the `Region` table without a default value. This is not possible if the table is not empty.
  - Added the required column `population` to the `Region` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terrain` to the `Region` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildings` to the `Settlement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `population` to the `Settlement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nodes` to the `Upgrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `root` to the `Upgrade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Building" DROP COLUMN "upgrades",
ADD COLUMN     "attributes" TEXT[],
ADD COLUMN     "dependencies" TEXT[],
ADD COLUMN     "flavorText" TEXT,
ADD COLUMN     "impacts" JSONB NOT NULL,
ADD COLUMN     "initialCost" JSONB NOT NULL,
ADD COLUMN     "metrics" JSONB NOT NULL,
ADD COLUMN     "upgradeTree" JSONB;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "resolutions",
ADD COLUMN     "entryPhaseId" TEXT NOT NULL,
ADD COLUMN     "links" TEXT[],
ADD COLUMN     "narrativeWeight" TEXT,
ADD COLUMN     "replacement" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Listener" ADD COLUMN     "active" BOOLEAN;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "eventRefs",
DROP COLUMN "linkedRegion",
DROP COLUMN "linkedRegionId",
ADD COLUMN     "climate" TEXT NOT NULL,
ADD COLUMN     "contentType" "ContentTypes" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "eventLog" TEXT[],
ADD COLUMN     "region" TEXT[],
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "terrain" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Region" DROP COLUMN "locations",
ADD COLUMN     "climate" TEXT NOT NULL,
ADD COLUMN     "factions" TEXT[],
ADD COLUMN     "notableLocations" TEXT[],
ADD COLUMN     "population" JSONB NOT NULL,
ADD COLUMN     "resources" TEXT[],
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "terrain" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Settlement" DROP COLUMN "pop",
ADD COLUMN     "buildings" JSONB NOT NULL,
ADD COLUMN     "population" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "TradeHub" ADD COLUMN     "faction" TEXT,
ADD COLUMN     "trendRange" INTEGER[],
ALTER COLUMN "location" DROP DEFAULT,
ALTER COLUMN "trend" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Upgrade" DROP COLUMN "ability",
DROP COLUMN "impacts",
DROP COLUMN "upgradeType",
ADD COLUMN     "nodes" JSONB NOT NULL,
ADD COLUMN     "root" TEXT NOT NULL;

-- DropEnum
DROP TYPE "LocationType";

-- CreateTable
CREATE TABLE "APT" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "display" JSONB NOT NULL,
    "eventThresholds" JSONB NOT NULL,
    "progressType" TEXT NOT NULL,
    "decay" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "APT_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Action" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "effects" JSONB NOT NULL,
    "conditions" JSONB,
    "cooldown" TEXT,
    "flavorText" TEXT[],

    CONSTRAINT "Action_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "StoryThread" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "origin" JSONB NOT NULL,
    "primaryKey" JSONB NOT NULL,

    CONSTRAINT "StoryThread_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "POI" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "type" TEXT NOT NULL,
    "region" TEXT[],
    "currentOccupants" TEXT[],
    "nearbyFeatures" JSONB NOT NULL,

    CONSTRAINT "POI_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Person" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "occupation" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "traits" TEXT[],
    "faction" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "relationships" JSONB NOT NULL,
    "notoriety" TEXT NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Faction" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "leader" TEXT NOT NULL,
    "homeBase" TEXT NOT NULL,
    "disposition" JSONB NOT NULL,
    "allies" TEXT[],
    "enemies" TEXT[],
    "influence" INTEGER NOT NULL,
    "notoriety" INTEGER NOT NULL,
    "cultureTags" TEXT[],
    "activeKeys" TEXT[],
    "passiveBonuses" JSONB NOT NULL,

    CONSTRAINT "Faction_pkey" PRIMARY KEY ("refId")
);

-- CreateIndex
CREATE UNIQUE INDEX "APT_id_key" ON "APT"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Action_id_key" ON "Action"("id");

-- CreateIndex
CREATE UNIQUE INDEX "StoryThread_id_key" ON "StoryThread"("id");

-- CreateIndex
CREATE UNIQUE INDEX "POI_id_key" ON "POI"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Person_id_key" ON "Person"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Faction_id_key" ON "Faction"("id");

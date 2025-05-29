/*
  Warnings:

  - You are about to drop the `Faction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Poi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Region` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EntryTypes" ADD VALUE 'continent';
ALTER TYPE "EntryTypes" ADD VALUE 'nation';
ALTER TYPE "EntryTypes" ADD VALUE 'settlement';

-- DropTable
DROP TABLE "Faction";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "Note";

-- DropTable
DROP TABLE "Person";

-- DropTable
DROP TABLE "Poi";

-- DropTable
DROP TABLE "Region";

-- CreateTable
CREATE TABLE "RegionGlossary" (
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
    "climate" TEXT NOT NULL,
    "terrain" TEXT NOT NULL,
    "factions" TEXT[],
    "population" JSONB NOT NULL,
    "notableLocations" TEXT[],
    "resources" TEXT[],

    CONSTRAINT "RegionGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "LocationGlossary" (
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
    "climate" TEXT NOT NULL,
    "terrain" TEXT NOT NULL,
    "eventLog" TEXT[],

    CONSTRAINT "LocationGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "PoiGlossary" (
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

    CONSTRAINT "PoiGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "PersonGlossary" (
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

    CONSTRAINT "PersonGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "FactionGlossary" (
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

    CONSTRAINT "FactionGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "NoteGlossary" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NoteGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "ContinentGlossary" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContinentGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "NationGlossary" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NationGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "SettlementGlossary" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SettlementGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegionGlossary_id_key" ON "RegionGlossary"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LocationGlossary_id_key" ON "LocationGlossary"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PoiGlossary_id_key" ON "PoiGlossary"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PersonGlossary_id_key" ON "PersonGlossary"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FactionGlossary_id_key" ON "FactionGlossary"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NoteGlossary_id_key" ON "NoteGlossary"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ContinentGlossary_id_key" ON "ContinentGlossary"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NationGlossary_id_key" ON "NationGlossary"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SettlementGlossary_id_key" ON "SettlementGlossary"("id");

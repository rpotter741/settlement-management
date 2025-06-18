/*
  Warnings:

  - The values [nation,region,subRegion,geography] on the enum `EntryTypes` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `GeographyGlossary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NationGlossary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RegionGlossary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubRegion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dataString` to the `ContinentGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataString` to the `EventGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataString` to the `FactionGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataString` to the `LocationGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataString` to the `NoteGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataString` to the `PersonGlossary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EntryTypes_new" AS ENUM ('continent', 'territory', 'domain', 'province', 'landmark', 'settlement', 'faction', 'location', 'person', 'note', 'event');
ALTER TABLE "GlossaryNode" ALTER COLUMN "entryType" TYPE "EntryTypes_new" USING ("entryType"::text::"EntryTypes_new");
ALTER TYPE "EntryTypes" RENAME TO "EntryTypes_old";
ALTER TYPE "EntryTypes_new" RENAME TO "EntryTypes";
DROP TYPE "EntryTypes_old";
COMMIT;

-- AlterTable
ALTER TABLE "ContinentGlossary" ADD COLUMN     "dataString" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EventGlossary" ADD COLUMN     "dataString" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FactionGlossary" ADD COLUMN     "dataString" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LocationGlossary" ADD COLUMN     "dataString" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NoteGlossary" ADD COLUMN     "dataString" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PersonGlossary" ADD COLUMN     "dataString" TEXT NOT NULL;

-- DropTable
DROP TABLE "GeographyGlossary";

-- DropTable
DROP TABLE "NationGlossary";

-- DropTable
DROP TABLE "RegionGlossary";

-- DropTable
DROP TABLE "SubRegion";

-- CreateTable
CREATE TABLE "TerritoryGlossary" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dataString" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "climate" TEXT[],
    "terrain" "TerrainTypes"[],
    "nations" TEXT[],
    "factions" TEXT[],
    "population" JSONB NOT NULL,
    "locations" TEXT[],
    "features" TEXT[],
    "resources" TEXT[],

    CONSTRAINT "TerritoryGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "ProvinceGlossary" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dataString" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "nation" TEXT,
    "terrain" "TerrainTypes"[],
    "locations" TEXT[],
    "people" TEXT[],
    "notableEvents" TEXT[],
    "resources" TEXT[],
    "population" JSONB NOT NULL,

    CONSTRAINT "ProvinceGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "DomainGlossary" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dataString" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "continent" TEXT[],
    "regions" TEXT[],
    "capital" TEXT[],
    "population" JSONB NOT NULL,
    "economy" JSONB NOT NULL,
    "culture" JSONB NOT NULL,
    "languages" TEXT[],
    "persons" TEXT[],
    "eventLog" TEXT[],
    "flags" TEXT[],
    "history" TEXT[],
    "relationships" JSONB NOT NULL,
    "locations" TEXT[],
    "geography" TEXT[],

    CONSTRAINT "DomainGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "LandmarkGlossary" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dataString" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "region" TEXT[],
    "climate" "ClimateTypes",
    "terrain" "TerrainTypes",
    "type" "GeographicTypes" NOT NULL,
    "eventLog" TEXT[],

    CONSTRAINT "LandmarkGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TerritoryGlossary_id_key" ON "TerritoryGlossary"("id");

-- CreateIndex
CREATE INDEX "TerritoryGlossary_contentType_idx" ON "TerritoryGlossary"("contentType");

-- CreateIndex
CREATE INDEX "TerritoryGlossary_id_updatedAt_idx" ON "TerritoryGlossary"("id", "updatedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ProvinceGlossary_id_key" ON "ProvinceGlossary"("id");

-- CreateIndex
CREATE INDEX "ProvinceGlossary_contentType_idx" ON "ProvinceGlossary"("contentType");

-- CreateIndex
CREATE INDEX "ProvinceGlossary_id_updatedAt_idx" ON "ProvinceGlossary"("id", "updatedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "DomainGlossary_id_key" ON "DomainGlossary"("id");

-- CreateIndex
CREATE INDEX "DomainGlossary_contentType_idx" ON "DomainGlossary"("contentType");

-- CreateIndex
CREATE INDEX "DomainGlossary_id_updatedAt_idx" ON "DomainGlossary"("id", "updatedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "LandmarkGlossary_id_key" ON "LandmarkGlossary"("id");

-- CreateIndex
CREATE INDEX "LandmarkGlossary_contentType_idx" ON "LandmarkGlossary"("contentType");

-- CreateIndex
CREATE INDEX "LandmarkGlossary_id_updatedAt_idx" ON "LandmarkGlossary"("id", "updatedAt" DESC);

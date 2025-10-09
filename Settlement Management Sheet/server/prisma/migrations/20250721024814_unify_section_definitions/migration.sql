/*
  Warnings:

  - You are about to drop the column `dataString` on the `EventGlossary` table. All the data in the column will be lost.
  - The `theme` column on the `Glossary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `dataString` on the `LocationGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `dataString` on the `NoteGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `dataString` on the `PersonGlossary` table. All the data in the column will be lost.
  - You are about to drop the `ContinentGlossary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DomainGlossary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FactionGlossary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LandmarkGlossary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProvinceGlossary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SettlementGlossary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TerritoryGlossary` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `descDataString` to the `EventGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genre` to the `Glossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subGenre` to the `Glossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descDataString` to the `LocationGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descDataString` to the `NoteGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descDataString` to the `PersonGlossary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventGlossary" DROP COLUMN "dataString",
ADD COLUMN     "descDataString" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Glossary" ADD COLUMN     "genre" TEXT NOT NULL,
ADD COLUMN     "integrationState" JSONB,
ADD COLUMN     "subGenre" TEXT NOT NULL,
DROP COLUMN "theme",
ADD COLUMN     "theme" JSONB;

-- AlterTable
ALTER TABLE "LocationGlossary" DROP COLUMN "dataString",
ADD COLUMN     "descDataString" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NoteGlossary" DROP COLUMN "dataString",
ADD COLUMN     "descDataString" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PersonGlossary" DROP COLUMN "dataString",
ADD COLUMN     "descDataString" TEXT NOT NULL;

-- DropTable
DROP TABLE "ContinentGlossary";

-- DropTable
DROP TABLE "DomainGlossary";

-- DropTable
DROP TABLE "FactionGlossary";

-- DropTable
DROP TABLE "LandmarkGlossary";

-- DropTable
DROP TABLE "ProvinceGlossary";

-- DropTable
DROP TABLE "SettlementGlossary";

-- DropTable
DROP TABLE "TerritoryGlossary";

-- CreateTable
CREATE TABLE "GlossarySection" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "subType" TEXT,
    "name" TEXT,
    "description" JSONB,
    "dataString" TEXT,
    "tags" TEXT[],
    "geographyId" TEXT NOT NULL,
    "politicalId" TEXT NOT NULL,
    "relationshipsId" TEXT NOT NULL,
    "historyId" TEXT NOT NULL,
    "customTabs" JSONB,
    "integrationState" JSONB NOT NULL,

    CONSTRAINT "GlossarySection_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "GlossaryGeography" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "climates" TEXT[],
    "terrain" TEXT[],
    "regions" TEXT[],
    "landmarks" TEXT[],
    "customFields" JSONB,
    "entryId" TEXT NOT NULL,

    CONSTRAINT "GlossaryGeography_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "GlossaryPolitical" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nations" TEXT[],
    "settlements" TEXT[],
    "locations" TEXT[],
    "resources" JSONB,
    "population" JSONB,
    "economy" JSONB,
    "cultures" JSONB,
    "customFields" JSONB,
    "entryId" TEXT NOT NULL,

    CONSTRAINT "GlossaryPolitical_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "GlossaryRelationships" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "allies" TEXT[],
    "enemies" TEXT[],
    "relationships" JSONB,
    "notoriety" JSONB,
    "influence" JSONB,
    "customFields" JSONB,
    "entryId" TEXT NOT NULL,

    CONSTRAINT "GlossaryRelationships_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "GlossaryHistory" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "events" TEXT[],
    "flags" JSONB,
    "history" JSONB,
    "customFields" JSONB,
    "historyDataString" TEXT,
    "entryId" TEXT NOT NULL,

    CONSTRAINT "GlossaryHistory_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "BacklinkIndex" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BacklinkIndex_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GlossarySection_id_key" ON "GlossarySection"("id");

-- CreateIndex
CREATE INDEX "GlossarySection_id_idx" ON "GlossarySection"("id");

-- CreateIndex
CREATE INDEX "GlossarySection_type_idx" ON "GlossarySection"("type");

-- CreateIndex
CREATE INDEX "GlossarySection_subType_idx" ON "GlossarySection"("subType");

-- CreateIndex
CREATE INDEX "GlossarySection_type_subType_idx" ON "GlossarySection"("type", "subType");

-- CreateIndex
CREATE INDEX "GlossarySection_createdBy_idx" ON "GlossarySection"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryGeography_id_key" ON "GlossaryGeography"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryPolitical_id_key" ON "GlossaryPolitical"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryRelationships_id_key" ON "GlossaryRelationships"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryHistory_id_key" ON "GlossaryHistory"("id");

-- AddForeignKey
ALTER TABLE "GlossarySection" ADD CONSTRAINT "GlossarySection_geographyId_fkey" FOREIGN KEY ("geographyId") REFERENCES "GlossaryGeography"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossarySection" ADD CONSTRAINT "GlossarySection_politicalId_fkey" FOREIGN KEY ("politicalId") REFERENCES "GlossaryPolitical"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossarySection" ADD CONSTRAINT "GlossarySection_relationshipsId_fkey" FOREIGN KEY ("relationshipsId") REFERENCES "GlossaryRelationships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossarySection" ADD CONSTRAINT "GlossarySection_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "GlossaryHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BacklinkIndex" ADD CONSTRAINT "BacklinkIndex_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "GlossarySection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BacklinkIndex" ADD CONSTRAINT "BacklinkIndex_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "GlossarySection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

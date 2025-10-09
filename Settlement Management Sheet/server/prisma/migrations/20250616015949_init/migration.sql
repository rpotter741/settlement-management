-- CreateEnum
CREATE TYPE "ContentTypes" AS ENUM ('OFFICIAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('Weather', 'Morale', 'Settlement');

-- CreateEnum
CREATE TYPE "StatusMode" AS ENUM ('Simple', 'Advanced');

-- CreateEnum
CREATE TYPE "UpgradeType" AS ENUM ('Settlement', 'Leadership', 'Building');

-- CreateEnum
CREATE TYPE "GlossShape" AS ENUM ('folder', 'file');

-- CreateEnum
CREATE TYPE "EntryTypes" AS ENUM ('continent', 'nation', 'settlement', 'region', 'subRegion', 'location', 'person', 'faction', 'note', 'event', 'geography');

-- CreateEnum
CREATE TYPE "ClimateTypes" AS ENUM ('tropical', 'arid', 'temperate', 'polar', 'subtropical', 'continental', 'icecap');

-- CreateEnum
CREATE TYPE "TerrainTypes" AS ENUM ('forests', 'mountains', 'deserts', 'swamps', 'plains', 'hills', 'valleys', 'plateaus', 'tundra', 'badlands', 'coastal', 'volcanic', 'glacial', 'taiga');

-- CreateEnum
CREATE TYPE "GeographicTypes" AS ENUM ('forest', 'mountain', 'river', 'lake', 'ocean', 'desert', 'swamp', 'cave', 'hill', 'plain', 'valley', 'plateau', 'island', 'archipelago', 'peninsula', 'bay', 'gulf', 'fjord', 'volcano', 'glacier', 'canyon', 'steppe', 'march', 'wetland', 'reef', 'delta', 'atoll');

-- CreateTable
CREATE TABLE "Attribute" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "positive" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "balance" JSONB NOT NULL,
    "thresholds" JSONB NOT NULL,
    "settlementPointCost" JSONB NOT NULL,
    "icon" JSONB NOT NULL,
    "tags" TEXT[],
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Category" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "thresholds" JSONB NOT NULL,
    "dependencies" JSONB NOT NULL,
    "tags" TEXT[],
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Event" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "flavorText" JSONB NOT NULL,
    "narrativeWeight" TEXT,
    "phases" JSONB NOT NULL,
    "replacement" JSONB NOT NULL,
    "links" TEXT[],
    "entryPhaseId" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Listener" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "conditionEventPairs" JSONB NOT NULL,
    "active" BOOLEAN,
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listener_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Kit" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kit_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Key" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "description" TEXT,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Key_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "KeySettings" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "delay" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "durationType" TEXT NOT NULL,
    "severityOverTime" JSONB NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KeySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gameStatus" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "StatusType" NOT NULL,
    "steps" JSONB NOT NULL,
    "mode" "StatusMode" NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gameStatus_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Building" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metrics" JSONB NOT NULL,
    "attributes" TEXT[],
    "upgradeTree" JSONB,
    "initialCost" JSONB NOT NULL,
    "impacts" JSONB NOT NULL,
    "flavorText" TEXT,
    "dependencies" TEXT[],
    "isValid" BOOLEAN NOT NULL,
    "status" "Status"[],
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Upgrade" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "root" TEXT NOT NULL,
    "nodes" JSONB NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Upgrade_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "TradeHub" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stock" JSONB NOT NULL,
    "region" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "trend" TEXT NOT NULL,
    "trendRange" INTEGER[],
    "faction" TEXT,
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradeHub_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "SettlementType" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "upgrades" TEXT[],
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SettlementType_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Settlement" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "stats" JSONB NOT NULL,
    "population" JSONB NOT NULL,
    "categories" JSONB NOT NULL,
    "buildings" JSONB NOT NULL,
    "eventLog" JSONB NOT NULL,
    "narrativeData" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("refId")
);

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
    "createdBy" TEXT[],
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
    "createdBy" TEXT[],
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
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "origin" JSONB NOT NULL,
    "primaryKey" JSONB NOT NULL,

    CONSTRAINT "StoryThread_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Glossary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "editors" TEXT[],
    "contentType" "ContentTypes" NOT NULL,
    "theme" TEXT NOT NULL,

    CONSTRAINT "Glossary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryTheme" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "description" TEXT NOT NULL,
    "palettes" JSONB NOT NULL,
    "glossaries" TEXT[],

    CONSTRAINT "GlossaryTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryNode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entryType" "EntryTypes",
    "type" "GlossShape" NOT NULL,
    "icon" JSONB,
    "parentId" TEXT,
    "glossaryId" TEXT NOT NULL,
    "sortIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GlossaryNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegionGlossary" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
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

    CONSTRAINT "RegionGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "SubRegion" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "nation" TEXT NOT NULL,
    "terrain" "TerrainTypes"[],
    "locations" TEXT[],
    "people" TEXT[],
    "notableEvents" TEXT[],
    "resources" TEXT[],
    "population" JSONB NOT NULL,

    CONSTRAINT "SubRegion_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "LocationGlossary" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "type" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "currentOccupants" TEXT[],
    "nearbyFeatures" JSONB NOT NULL,
    "eventLog" TEXT[],

    CONSTRAINT "LocationGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "PersonGlossary" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "occupation" TEXT[],
    "title" TEXT[],
    "traits" TEXT[],
    "faction" TEXT[],
    "location" TEXT[],
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
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "leader" TEXT[],
    "homeBase" TEXT[],
    "relationships" JSONB NOT NULL,
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
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "relatedEntries" JSONB NOT NULL,
    "tags" TEXT[],
    "isArchived" BOOLEAN NOT NULL,
    "isPinned" BOOLEAN NOT NULL,
    "isShared" BOOLEAN NOT NULL,
    "sharedWith" TEXT[],
    "attachments" JSONB NOT NULL,

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
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nations" TEXT[],
    "regions" TEXT[],
    "locations" TEXT[],
    "resources" TEXT[],
    "population" JSONB NOT NULL,
    "climate" "ClimateTypes"[],
    "terrain" "GeographicTypes"[],
    "eventLog" TEXT[],

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
    "createdBy" TEXT[],
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
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nation" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "persons" TEXT[],
    "eventLog" TEXT[],
    "locations" TEXT[],
    "history" JSONB NOT NULL,
    "relationships" JSONB NOT NULL,

    CONSTRAINT "SettlementGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "EventGlossary" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "significance" TEXT NOT NULL,
    "gameDate" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "location" TEXT[],
    "relatedEntries" TEXT[],
    "tags" TEXT[],

    CONSTRAINT "EventGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "GeographyGlossary" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "GeographicTypes" NOT NULL,
    "region" TEXT[],
    "climate" "ClimateTypes" NOT NULL,
    "terrain" "TerrainTypes" NOT NULL,
    "eventLog" TEXT[],

    CONSTRAINT "GeographyGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_id_key" ON "Attribute"("id");

-- CreateIndex
CREATE INDEX "Attribute_contentType_idx" ON "Attribute"("contentType");

-- CreateIndex
CREATE INDEX "Attribute_tags_idx" ON "Attribute"("tags");

-- CreateIndex
CREATE INDEX "Attribute_id_updatedAt_idx" ON "Attribute"("id", "updatedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Category_id_key" ON "Category"("id");

-- CreateIndex
CREATE INDEX "Category_contentType_idx" ON "Category"("contentType");

-- CreateIndex
CREATE INDEX "Category_tags_idx" ON "Category"("tags");

-- CreateIndex
CREATE INDEX "Category_refId_updatedAt_idx" ON "Category"("refId", "updatedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Event_id_key" ON "Event"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Listener_id_key" ON "Listener"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Kit_id_key" ON "Kit"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Key_id_key" ON "Key"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Key_name_key" ON "Key"("name");

-- CreateIndex
CREATE UNIQUE INDEX "gameStatus_id_key" ON "gameStatus"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Building_id_key" ON "Building"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Upgrade_id_key" ON "Upgrade"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TradeHub_id_key" ON "TradeHub"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SettlementType_id_key" ON "SettlementType"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Settlement_id_key" ON "Settlement"("id");

-- CreateIndex
CREATE UNIQUE INDEX "APT_id_key" ON "APT"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Action_id_key" ON "Action"("id");

-- CreateIndex
CREATE UNIQUE INDEX "StoryThread_id_key" ON "StoryThread"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RegionGlossary_id_key" ON "RegionGlossary"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SubRegion_id_key" ON "SubRegion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LocationGlossary_id_key" ON "LocationGlossary"("id");

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

-- CreateIndex
CREATE UNIQUE INDEX "EventGlossary_id_key" ON "EventGlossary"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GeographyGlossary_id_key" ON "GeographyGlossary"("id");

-- AddForeignKey
ALTER TABLE "KeySettings" ADD CONSTRAINT "KeySettings_refId_fkey" FOREIGN KEY ("refId") REFERENCES "Key"("refId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossaryNode" ADD CONSTRAINT "GlossaryNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GlossaryNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossaryNode" ADD CONSTRAINT "GlossaryNode_glossaryId_fkey" FOREIGN KEY ("glossaryId") REFERENCES "Glossary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

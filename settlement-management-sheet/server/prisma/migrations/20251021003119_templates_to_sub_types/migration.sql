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
CREATE TYPE "EntryShape" AS ENUM ('section', 'detail');

-- CreateEnum
CREATE TYPE "GlossVisibilitySettings" AS ENUM ('private', 'standard', 'open', 'public');

-- CreateEnum
CREATE TYPE "EntryTypes" AS ENUM ('continent', 'territory', 'domain', 'province', 'landmark', 'settlement', 'faction', 'location', 'person', 'note', 'item', 'event');

-- CreateEnum
CREATE TYPE "ClimateTypes" AS ENUM ('tropical', 'arid', 'temperate', 'polar', 'subtropical', 'continental', 'icecap');

-- CreateEnum
CREATE TYPE "TerrainTypes" AS ENUM ('forests', 'mountains', 'deserts', 'swamps', 'plains', 'hills', 'valleys', 'plateaus', 'tundra', 'badlands', 'coastal', 'volcanic', 'glacial', 'taiga');

-- CreateEnum
CREATE TYPE "GeographicTypes" AS ENUM ('forest', 'mountain', 'river', 'lake', 'ocean', 'desert', 'swamp', 'cave', 'hill', 'plain', 'valley', 'plateau', 'island', 'archipelago', 'peninsula', 'bay', 'gulf', 'fjord', 'volcano', 'glacier', 'canyon', 'steppe', 'march', 'wetland', 'reef', 'delta', 'atoll');

-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "genre" TEXT,
    "subGenre" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "balance" JSONB NOT NULL,
    "thresholds" JSONB NOT NULL,
    "settlementPointCost" JSONB NOT NULL,
    "isPositive" BOOLEAN NOT NULL,
    "canHurt" BOOLEAN NOT NULL,
    "isTradeable" BOOLEAN NOT NULL,
    "hasSPC" BOOLEAN NOT NULL,
    "hasThresholds" BOOLEAN NOT NULL,
    "properties" JSONB NOT NULL,
    "icon" JSONB NOT NULL,
    "tags" TEXT[],
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "thresholds" JSONB NOT NULL,
    "dependencies" JSONB NOT NULL,
    "tags" TEXT[],
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
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

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listener" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "conditionEventPairs" JSONB NOT NULL,
    "active" BOOLEAN,
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Listener_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kit" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Kit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Key" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "settings" JSONB NOT NULL,

    CONSTRAINT "Key_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gameStatus" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "type" "StatusType" NOT NULL,
    "steps" JSONB NOT NULL,
    "mode" "StatusMode" NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "gameStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Building" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
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

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upgrade" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "root" TEXT NOT NULL,
    "nodes" JSONB NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Upgrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeHub" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
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

    CONSTRAINT "TradeHub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementType" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "upgrades" TEXT[],
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "SettlementType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settlement" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "stats" JSONB NOT NULL,
    "population" JSONB NOT NULL,
    "categories" JSONB NOT NULL,
    "buildings" JSONB NOT NULL,
    "eventLog" JSONB NOT NULL,
    "narrativeData" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "APT" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "display" JSONB NOT NULL,
    "eventThresholds" JSONB NOT NULL,
    "progressType" TEXT NOT NULL,
    "decay" INTEGER NOT NULL,

    CONSTRAINT "APT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "effects" JSONB NOT NULL,
    "conditions" JSONB,
    "cooldown" TEXT,
    "flavorText" TEXT[],

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryThread" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "origin" JSONB NOT NULL,
    "primaryKey" JSONB NOT NULL,

    CONSTRAINT "StoryThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryTheme" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "palettes" JSONB NOT NULL,
    "glossaries" TEXT[],

    CONSTRAINT "GlossaryTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Glossary" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "collaborators" TEXT[],
    "forkedBy" TEXT,
    "editors" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "subGenre" TEXT NOT NULL,
    "visibility" "GlossVisibilitySettings" NOT NULL DEFAULT 'standard',
    "description" JSONB,
    "theme" JSONB,
    "integrationState" JSONB,
    "subTypes" JSONB,

    CONSTRAINT "Glossary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryNode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entryType" "EntryTypes",
    "fileType" "EntryShape" NOT NULL,
    "templateId" TEXT,
    "icon" JSONB,
    "integrationState" JSONB,
    "parentId" TEXT,
    "glossaryId" TEXT NOT NULL,
    "sortIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GlossaryNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryEntry" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "forkedBy" TEXT,
    "collaborators" TEXT[],
    "editors" TEXT[],
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "format" "EntryShape" NOT NULL,
    "entryType" "EntryTypes" NOT NULL,
    "subTypeId" TEXT,
    "name" TEXT,
    "description" JSONB,
    "dataString" TEXT,
    "tags" TEXT[],
    "integrationState" JSONB,
    "searchVector" tsvector,

    CONSTRAINT "GlossaryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntrySubType" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdBy" TEXT NOT NULL,
    "forkedBy" TEXT,
    "collaborators" TEXT[],
    "editors" TEXT[],
    "contentType" "ContentTypes" NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "entryType" "EntryTypes" NOT NULL,
    "groupOrder" TEXT[],
    "groupData" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntrySubType_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "Attribute_contentType_idx" ON "Attribute"("contentType");

-- CreateIndex
CREATE INDEX "Attribute_tags_idx" ON "Attribute"("tags");

-- CreateIndex
CREATE INDEX "Attribute_refId_idx" ON "Attribute"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_refId_version_key" ON "Attribute"("refId", "version");

-- CreateIndex
CREATE INDEX "Category_contentType_idx" ON "Category"("contentType");

-- CreateIndex
CREATE INDEX "Category_tags_idx" ON "Category"("tags");

-- CreateIndex
CREATE INDEX "Category_refId_idx" ON "Category"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_refId_version_key" ON "Category"("refId", "version");

-- CreateIndex
CREATE INDEX "Event_contentType_idx" ON "Event"("contentType");

-- CreateIndex
CREATE INDEX "Event_refId_idx" ON "Event"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_refId_version_key" ON "Event"("refId", "version");

-- CreateIndex
CREATE INDEX "Listener_contentType_idx" ON "Listener"("contentType");

-- CreateIndex
CREATE INDEX "Listener_refId_idx" ON "Listener"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Listener_refId_version_key" ON "Listener"("refId", "version");

-- CreateIndex
CREATE INDEX "Kit_refId_idx" ON "Kit"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Kit_refId_version_key" ON "Kit"("refId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Key_refId_key" ON "Key"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Key_name_key" ON "Key"("name");

-- CreateIndex
CREATE INDEX "Key_contentType_idx" ON "Key"("contentType");

-- CreateIndex
CREATE INDEX "Key_refId_idx" ON "Key"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Key_refId_version_key" ON "Key"("refId", "version");

-- CreateIndex
CREATE INDEX "gameStatus_contentType_idx" ON "gameStatus"("contentType");

-- CreateIndex
CREATE INDEX "gameStatus_refId_idx" ON "gameStatus"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "gameStatus_refId_version_key" ON "gameStatus"("refId", "version");

-- CreateIndex
CREATE INDEX "Building_contentType_idx" ON "Building"("contentType");

-- CreateIndex
CREATE INDEX "Building_refId_idx" ON "Building"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Building_refId_version_key" ON "Building"("refId", "version");

-- CreateIndex
CREATE INDEX "Upgrade_contentType_idx" ON "Upgrade"("contentType");

-- CreateIndex
CREATE INDEX "Upgrade_refId_idx" ON "Upgrade"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Upgrade_refId_version_key" ON "Upgrade"("refId", "version");

-- CreateIndex
CREATE INDEX "TradeHub_contentType_idx" ON "TradeHub"("contentType");

-- CreateIndex
CREATE INDEX "TradeHub_refId_idx" ON "TradeHub"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "TradeHub_refId_version_key" ON "TradeHub"("refId", "version");

-- CreateIndex
CREATE INDEX "SettlementType_contentType_idx" ON "SettlementType"("contentType");

-- CreateIndex
CREATE INDEX "SettlementType_refId_idx" ON "SettlementType"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "SettlementType_refId_version_key" ON "SettlementType"("refId", "version");

-- CreateIndex
CREATE INDEX "Settlement_contentType_idx" ON "Settlement"("contentType");

-- CreateIndex
CREATE INDEX "Settlement_refId_idx" ON "Settlement"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Settlement_refId_version_key" ON "Settlement"("refId", "version");

-- CreateIndex
CREATE INDEX "APT_contentType_idx" ON "APT"("contentType");

-- CreateIndex
CREATE INDEX "APT_refId_idx" ON "APT"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "APT_refId_version_key" ON "APT"("refId", "version");

-- CreateIndex
CREATE INDEX "Action_contentType_idx" ON "Action"("contentType");

-- CreateIndex
CREATE INDEX "Action_refId_idx" ON "Action"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Action_refId_version_key" ON "Action"("refId", "version");

-- CreateIndex
CREATE INDEX "StoryThread_contentType_idx" ON "StoryThread"("contentType");

-- CreateIndex
CREATE INDEX "StoryThread_refId_idx" ON "StoryThread"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "StoryThread_refId_version_key" ON "StoryThread"("refId", "version");

-- CreateIndex
CREATE INDEX "GlossaryTheme_contentType_idx" ON "GlossaryTheme"("contentType");

-- CreateIndex
CREATE INDEX "GlossaryTheme_refId_idx" ON "GlossaryTheme"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryTheme_refId_version_key" ON "GlossaryTheme"("refId", "version");

-- CreateIndex
CREATE INDEX "Glossary_contentType_idx" ON "Glossary"("contentType");

-- CreateIndex
CREATE INDEX "Glossary_refId_idx" ON "Glossary"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Glossary_refId_version_key" ON "Glossary"("refId", "version");

-- CreateIndex
CREATE INDEX "GlossaryNode_id_idx" ON "GlossaryNode"("id");

-- CreateIndex
CREATE INDEX "GlossaryEntry_refId_idx" ON "GlossaryEntry"("refId");

-- CreateIndex
CREATE INDEX "GlossaryEntry_entryType_idx" ON "GlossaryEntry"("entryType");

-- CreateIndex
CREATE INDEX "GlossaryEntry_subTypeId_idx" ON "GlossaryEntry"("subTypeId");

-- CreateIndex
CREATE INDEX "GlossaryEntry_entryType_subTypeId_idx" ON "GlossaryEntry"("entryType", "subTypeId");

-- CreateIndex
CREATE INDEX "GlossaryEntry_createdBy_idx" ON "GlossaryEntry"("createdBy");

-- CreateIndex
CREATE INDEX "GlossaryEntry_searchVector_idx" ON "GlossaryEntry" USING GIN ("searchVector");

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryEntry_refId_version_key" ON "GlossaryEntry"("refId", "version");

-- CreateIndex
CREATE INDEX "EntrySubType_refId_idx" ON "EntrySubType"("refId");

-- CreateIndex
CREATE INDEX "EntrySubType_entryType_idx" ON "EntrySubType"("entryType");

-- CreateIndex
CREATE UNIQUE INDEX "EntrySubType_refId_version_key" ON "EntrySubType"("refId", "version");

-- AddForeignKey
ALTER TABLE "GlossaryNode" ADD CONSTRAINT "GlossaryNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GlossaryNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossaryNode" ADD CONSTRAINT "GlossaryNode_glossaryId_fkey" FOREIGN KEY ("glossaryId") REFERENCES "Glossary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossaryEntry" ADD CONSTRAINT "GlossaryEntry_subTypeId_fkey" FOREIGN KEY ("subTypeId") REFERENCES "EntrySubType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BacklinkIndex" ADD CONSTRAINT "BacklinkIndex_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "GlossaryEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BacklinkIndex" ADD CONSTRAINT "BacklinkIndex_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "GlossaryEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

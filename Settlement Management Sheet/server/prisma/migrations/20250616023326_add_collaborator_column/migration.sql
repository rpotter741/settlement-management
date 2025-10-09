-- DropIndex
DROP INDEX "Category_refId_updatedAt_idx";

-- AlterTable
ALTER TABLE "APT" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Building" ADD COLUMN     "collaborators" TEXT[];

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ContinentGlossary" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "EventGlossary" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "FactionGlossary" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "GeographyGlossary" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Glossary" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "GlossaryTheme" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Key" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "KeySettings" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Kit" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Listener" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "LocationGlossary" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "NationGlossary" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "NoteGlossary" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PersonGlossary" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "RegionGlossary" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Settlement" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SettlementGlossary" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SettlementType" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "StoryThread" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SubRegion" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TradeHub" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Upgrade" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "gameStatus" ADD COLUMN     "collaborators" TEXT[],
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "APT_contentType_idx" ON "APT"("contentType");

-- CreateIndex
CREATE INDEX "APT_id_updatedAt_idx" ON "APT"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Action_contentType_idx" ON "Action"("contentType");

-- CreateIndex
CREATE INDEX "Action_id_updatedAt_idx" ON "Action"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Building_contentType_idx" ON "Building"("contentType");

-- CreateIndex
CREATE INDEX "Building_id_updatedAt_idx" ON "Building"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Category_id_updatedAt_idx" ON "Category"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "ContinentGlossary_contentType_idx" ON "ContinentGlossary"("contentType");

-- CreateIndex
CREATE INDEX "ContinentGlossary_id_updatedAt_idx" ON "ContinentGlossary"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Event_contentType_idx" ON "Event"("contentType");

-- CreateIndex
CREATE INDEX "Event_id_updatedAt_idx" ON "Event"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "EventGlossary_contentType_idx" ON "EventGlossary"("contentType");

-- CreateIndex
CREATE INDEX "EventGlossary_id_updatedAt_idx" ON "EventGlossary"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "FactionGlossary_contentType_idx" ON "FactionGlossary"("contentType");

-- CreateIndex
CREATE INDEX "FactionGlossary_id_updatedAt_idx" ON "FactionGlossary"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "GeographyGlossary_contentType_idx" ON "GeographyGlossary"("contentType");

-- CreateIndex
CREATE INDEX "GeographyGlossary_id_updatedAt_idx" ON "GeographyGlossary"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Glossary_contentType_idx" ON "Glossary"("contentType");

-- CreateIndex
CREATE INDEX "Glossary_id_updatedAt_idx" ON "Glossary"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "GlossaryNode_id_idx" ON "GlossaryNode"("id");

-- CreateIndex
CREATE INDEX "GlossaryTheme_contentType_idx" ON "GlossaryTheme"("contentType");

-- CreateIndex
CREATE INDEX "GlossaryTheme_id_updatedAt_idx" ON "GlossaryTheme"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Key_contentType_idx" ON "Key"("contentType");

-- CreateIndex
CREATE INDEX "Key_id_updatedAt_idx" ON "Key"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Listener_contentType_idx" ON "Listener"("contentType");

-- CreateIndex
CREATE INDEX "Listener_id_updatedAt_idx" ON "Listener"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "LocationGlossary_contentType_idx" ON "LocationGlossary"("contentType");

-- CreateIndex
CREATE INDEX "LocationGlossary_id_updatedAt_idx" ON "LocationGlossary"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "NationGlossary_contentType_idx" ON "NationGlossary"("contentType");

-- CreateIndex
CREATE INDEX "NationGlossary_id_updatedAt_idx" ON "NationGlossary"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "NoteGlossary_contentType_idx" ON "NoteGlossary"("contentType");

-- CreateIndex
CREATE INDEX "NoteGlossary_id_updatedAt_idx" ON "NoteGlossary"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "PersonGlossary_contentType_idx" ON "PersonGlossary"("contentType");

-- CreateIndex
CREATE INDEX "PersonGlossary_id_updatedAt_idx" ON "PersonGlossary"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "RegionGlossary_contentType_idx" ON "RegionGlossary"("contentType");

-- CreateIndex
CREATE INDEX "RegionGlossary_id_updatedAt_idx" ON "RegionGlossary"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Settlement_contentType_idx" ON "Settlement"("contentType");

-- CreateIndex
CREATE INDEX "Settlement_id_updatedAt_idx" ON "Settlement"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "SettlementGlossary_contentType_idx" ON "SettlementGlossary"("contentType");

-- CreateIndex
CREATE INDEX "SettlementGlossary_id_updatedAt_idx" ON "SettlementGlossary"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "SettlementType_contentType_idx" ON "SettlementType"("contentType");

-- CreateIndex
CREATE INDEX "SettlementType_id_updatedAt_idx" ON "SettlementType"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "StoryThread_contentType_idx" ON "StoryThread"("contentType");

-- CreateIndex
CREATE INDEX "StoryThread_id_updatedAt_idx" ON "StoryThread"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "SubRegion_contentType_idx" ON "SubRegion"("contentType");

-- CreateIndex
CREATE INDEX "SubRegion_id_updatedAt_idx" ON "SubRegion"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "TradeHub_contentType_idx" ON "TradeHub"("contentType");

-- CreateIndex
CREATE INDEX "TradeHub_id_updatedAt_idx" ON "TradeHub"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Upgrade_contentType_idx" ON "Upgrade"("contentType");

-- CreateIndex
CREATE INDEX "Upgrade_id_updatedAt_idx" ON "Upgrade"("id", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "gameStatus_contentType_idx" ON "gameStatus"("contentType");

-- CreateIndex
CREATE INDEX "gameStatus_id_updatedAt_idx" ON "gameStatus"("id", "updatedAt" DESC);

/*
  Warnings:

  - The values [poi] on the enum `EntryTypes` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `disposition` on the `FactionGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `climate` on the `LocationGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `terrain` on the `LocationGlossary` table. All the data in the column will be lost.
  - You are about to drop the `ContinentGlossary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PoiGlossary` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `frequency` to the `EventGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameDate` to the `EventGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `EventGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `significance` to the `EventGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relationships` to the `FactionGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `climate` to the `GeographyGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terrain` to the `GeographyGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `GeographyGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nearbyFeatures` to the `LocationGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `continent` to the `NationGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `culture` to the `NationGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `economy` to the `NationGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `population` to the `NationGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relationships` to the `NationGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attachments` to the `NoteGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `NoteGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isArchived` to the `NoteGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPinned` to the `NoteGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isShared` to the `NoteGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `NoteGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relatedEntries` to the `NoteGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `NoteGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `history` to the `SettlementGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nation` to the `SettlementGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `SettlementGlossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relationships` to the `SettlementGlossary` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClimateTypes" AS ENUM ('tropical', 'arid', 'temperate', 'polar', 'subtropical', 'mountainous');

-- CreateEnum
CREATE TYPE "TerrainTypes" AS ENUM ('forest', 'mountains', 'desert', 'swamp', 'plains', 'hills', 'tundra');

-- CreateEnum
CREATE TYPE "GeographicTypes" AS ENUM ('forest', 'mountain', 'river', 'lake', 'ocean', 'desert', 'swamp', 'cave', 'hill', 'plain', 'valley', 'plateau', 'island', 'archipelago', 'peninsula', 'bay', 'gulf', 'fjord');

-- AlterEnum
BEGIN;
CREATE TYPE "EntryTypes_new" AS ENUM ('continent', 'nation', 'settlement', 'region', 'location', 'person', 'faction', 'note', 'event', 'geography');
ALTER TABLE "GlossaryNode" ALTER COLUMN "entryType" TYPE "EntryTypes_new" USING ("entryType"::text::"EntryTypes_new");
ALTER TYPE "EntryTypes" RENAME TO "EntryTypes_old";
ALTER TYPE "EntryTypes_new" RENAME TO "EntryTypes";
DROP TYPE "EntryTypes_old";
COMMIT;

-- AlterTable
ALTER TABLE "EventGlossary" ADD COLUMN     "frequency" TEXT NOT NULL,
ADD COLUMN     "gameDate" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "relatedEntries" TEXT[],
ADD COLUMN     "significance" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "FactionGlossary" DROP COLUMN "disposition",
ADD COLUMN     "relationships" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "GeographyGlossary" ADD COLUMN     "climate" "ClimateTypes" NOT NULL,
ADD COLUMN     "eventLog" TEXT[],
ADD COLUMN     "region" TEXT[],
ADD COLUMN     "terrain" "TerrainTypes" NOT NULL,
ADD COLUMN     "type" "GeographicTypes" NOT NULL;

-- AlterTable
ALTER TABLE "LocationGlossary" DROP COLUMN "climate",
DROP COLUMN "terrain",
ADD COLUMN     "currentOccupants" TEXT[],
ADD COLUMN     "nearbyFeatures" JSONB NOT NULL,
ALTER COLUMN "region" SET NOT NULL,
ALTER COLUMN "region" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "NationGlossary" ADD COLUMN     "capital" TEXT[],
ADD COLUMN     "continent" TEXT NOT NULL,
ADD COLUMN     "culture" TEXT NOT NULL,
ADD COLUMN     "economy" TEXT NOT NULL,
ADD COLUMN     "eventLog" TEXT[],
ADD COLUMN     "flags" TEXT[],
ADD COLUMN     "geography" TEXT[],
ADD COLUMN     "history" TEXT[],
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "locations" TEXT[],
ADD COLUMN     "persons" TEXT[],
ADD COLUMN     "population" JSONB NOT NULL,
ADD COLUMN     "regions" TEXT[],
ADD COLUMN     "relationships" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "NoteGlossary" ADD COLUMN     "attachments" JSONB NOT NULL,
ADD COLUMN     "dueDate" TEXT NOT NULL,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL,
ADD COLUMN     "isPinned" BOOLEAN NOT NULL,
ADD COLUMN     "isShared" BOOLEAN NOT NULL,
ADD COLUMN     "priority" TEXT NOT NULL,
ADD COLUMN     "relatedEntries" JSONB NOT NULL,
ADD COLUMN     "sharedWith" TEXT[],
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SettlementGlossary" ADD COLUMN     "eventLog" TEXT[],
ADD COLUMN     "history" TEXT NOT NULL,
ADD COLUMN     "locations" TEXT[],
ADD COLUMN     "nation" TEXT NOT NULL,
ADD COLUMN     "notablePersons" TEXT[],
ADD COLUMN     "region" TEXT NOT NULL,
ADD COLUMN     "relationships" JSONB NOT NULL;

-- DropTable
DROP TABLE "ContinentGlossary";

-- DropTable
DROP TABLE "PoiGlossary";

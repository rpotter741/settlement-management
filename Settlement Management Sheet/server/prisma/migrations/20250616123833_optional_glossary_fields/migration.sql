-- AlterTable
ALTER TABLE "EventGlossary" ALTER COLUMN "significance" DROP NOT NULL,
ALTER COLUMN "gameDate" DROP NOT NULL,
ALTER COLUMN "frequency" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FactionGlossary" ALTER COLUMN "influence" DROP NOT NULL,
ALTER COLUMN "notoriety" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GeographyGlossary" ALTER COLUMN "climate" DROP NOT NULL,
ALTER COLUMN "terrain" DROP NOT NULL;

-- AlterTable
ALTER TABLE "LocationGlossary" ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "region" DROP NOT NULL,
ALTER COLUMN "nearbyFeatures" DROP NOT NULL;

-- AlterTable
ALTER TABLE "NoteGlossary" ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "priority" DROP NOT NULL,
ALTER COLUMN "dueDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SettlementGlossary" ALTER COLUMN "nation" DROP NOT NULL,
ALTER COLUMN "region" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SubRegion" ALTER COLUMN "nation" DROP NOT NULL;

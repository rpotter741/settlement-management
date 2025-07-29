-- AlterTable
ALTER TABLE "EventGlossary" ADD COLUMN     "integrationState" JSONB;

-- AlterTable
ALTER TABLE "LocationGlossary" ADD COLUMN     "integrationState" JSONB;

-- AlterTable
ALTER TABLE "NoteGlossary" ADD COLUMN     "integrationState" JSONB;

-- AlterTable
ALTER TABLE "PersonGlossary" ADD COLUMN     "integrationState" JSONB;

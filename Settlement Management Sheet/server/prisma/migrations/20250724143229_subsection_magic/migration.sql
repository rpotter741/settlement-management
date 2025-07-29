-- AlterTable
ALTER TABLE "GlossaryCustom" ADD COLUMN     "entryId" TEXT,
ALTER COLUMN "customFields" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GlossarySection" ADD COLUMN     "subSections" TEXT[];

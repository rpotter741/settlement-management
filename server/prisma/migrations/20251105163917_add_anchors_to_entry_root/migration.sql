-- AlterTable
ALTER TABLE "GlossaryEntry" ADD COLUMN     "primaryAnchorId" TEXT,
ADD COLUMN     "primaryAnchorValue" TEXT,
ADD COLUMN     "secondaryAnchorId" TEXT,
ADD COLUMN     "secondaryAnchorValue" TEXT;

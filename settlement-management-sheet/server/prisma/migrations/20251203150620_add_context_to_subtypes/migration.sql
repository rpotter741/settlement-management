-- AlterTable
ALTER TABLE "EntrySubType" ADD COLUMN     "context" TEXT,
ADD COLUMN     "isGeneric" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SubTypeGroup" ADD COLUMN     "isGeneric" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SubTypeProperty" ADD COLUMN     "isGeneric" BOOLEAN NOT NULL DEFAULT false;

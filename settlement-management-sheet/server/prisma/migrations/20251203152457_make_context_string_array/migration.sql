/*
  Warnings:

  - The `context` column on the `EntrySubType` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "EntrySubType" DROP COLUMN "context",
ADD COLUMN     "context" TEXT[];

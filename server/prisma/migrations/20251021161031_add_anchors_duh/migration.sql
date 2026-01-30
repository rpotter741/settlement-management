/*
  Warnings:

  - Added the required column `anchors` to the `EntrySubType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EntrySubType" ADD COLUMN     "anchors" JSONB NOT NULL;

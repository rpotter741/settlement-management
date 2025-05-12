/*
  Warnings:

  - Added the required column `contentType` to the `Key` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Key" ADD COLUMN     "contentType" "ContentTypes" NOT NULL;

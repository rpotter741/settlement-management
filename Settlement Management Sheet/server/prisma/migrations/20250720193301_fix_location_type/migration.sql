/*
  Warnings:

  - The `locationType` column on the `LocationGlossary` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "LocationGlossary" DROP COLUMN "locationType",
ADD COLUMN     "locationType" TEXT[];

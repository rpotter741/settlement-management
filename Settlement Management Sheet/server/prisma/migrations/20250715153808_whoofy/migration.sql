/*
  Warnings:

  - The `geographicType` column on the `LandmarkGlossary` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "LandmarkGlossary" DROP COLUMN "geographicType",
ADD COLUMN     "geographicType" TEXT[];

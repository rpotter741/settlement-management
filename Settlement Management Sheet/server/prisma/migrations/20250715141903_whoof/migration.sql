/*
  Warnings:

  - Changed the type of `geographicType` on the `LandmarkGlossary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LandmarkGlossary" DROP COLUMN "geographicType",
ADD COLUMN     "geographicType" TEXT NOT NULL;

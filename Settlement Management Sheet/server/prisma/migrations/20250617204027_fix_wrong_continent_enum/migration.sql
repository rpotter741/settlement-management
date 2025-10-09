/*
  Warnings:

  - The `terrain` column on the `ContinentGlossary` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ContinentGlossary" DROP COLUMN "terrain",
ADD COLUMN     "terrain" "TerrainTypes"[];

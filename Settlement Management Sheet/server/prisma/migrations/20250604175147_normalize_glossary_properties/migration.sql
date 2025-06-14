/*
  Warnings:

  - You are about to drop the column `notableLocations` on the `ContinentGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `notableLocations` on the `RegionGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `notablePersons` on the `SettlementGlossary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContinentGlossary" DROP COLUMN "notableLocations",
ADD COLUMN     "locations" TEXT[];

-- AlterTable
ALTER TABLE "RegionGlossary" DROP COLUMN "notableLocations",
ADD COLUMN     "locations" TEXT[];

-- AlterTable
ALTER TABLE "SettlementGlossary" DROP COLUMN "notablePersons",
ADD COLUMN     "persons" TEXT[];

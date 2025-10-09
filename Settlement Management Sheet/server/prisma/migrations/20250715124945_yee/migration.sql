/*
  Warnings:

  - You are about to drop the column `eventLog` on the `ContinentGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `eventLog` on the `DomainGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `eventLog` on the `LandmarkGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `LandmarkGlossary` table. All the data in the column will be lost.
  - The `terrain` column on the `LandmarkGlossary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `climates` column on the `LandmarkGlossary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `currentOccupants` on the `LocationGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `eventLog` on the `LocationGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `LocationGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `NoteGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `nation` on the `ProvinceGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `notableEvents` on the `ProvinceGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `people` on the `ProvinceGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `eventLog` on the `SettlementGlossary` table. All the data in the column will be lost.
  - The `nations` column on the `SettlementGlossary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `regions` column on the `SettlementGlossary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `geographicType` to the `LandmarkGlossary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContinentGlossary" DROP COLUMN "eventLog",
ADD COLUMN     "events" TEXT[],
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "DomainGlossary" DROP COLUMN "eventLog",
ADD COLUMN     "events" TEXT[],
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "LandmarkGlossary" DROP COLUMN "eventLog",
DROP COLUMN "type",
ADD COLUMN     "events" TEXT[],
ADD COLUMN     "geographicType" "GeographicTypes" NOT NULL,
ADD COLUMN     "locations" TEXT[],
ADD COLUMN     "tags" TEXT[],
DROP COLUMN "terrain",
ADD COLUMN     "terrain" TEXT[],
DROP COLUMN "climates",
ADD COLUMN     "climates" TEXT[];

-- AlterTable
ALTER TABLE "LocationGlossary" DROP COLUMN "currentOccupants",
DROP COLUMN "eventLog",
DROP COLUMN "region",
ADD COLUMN     "events" TEXT[],
ADD COLUMN     "occupants" TEXT[],
ADD COLUMN     "regions" TEXT[];

-- AlterTable
ALTER TABLE "NoteGlossary" DROP COLUMN "type",
ADD COLUMN     "noteType" TEXT;

-- AlterTable
ALTER TABLE "ProvinceGlossary" DROP COLUMN "nation",
DROP COLUMN "notableEvents",
DROP COLUMN "people",
ADD COLUMN     "events" TEXT[],
ADD COLUMN     "nations" TEXT[],
ADD COLUMN     "persons" TEXT[];

-- AlterTable
ALTER TABLE "SettlementGlossary" DROP COLUMN "eventLog",
ADD COLUMN     "events" TEXT[],
ADD COLUMN     "tags" TEXT[],
DROP COLUMN "nations",
ADD COLUMN     "nations" TEXT[],
DROP COLUMN "regions",
ADD COLUMN     "regions" TEXT[];

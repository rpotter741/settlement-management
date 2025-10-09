/*
  Warnings:

  - You are about to drop the column `capital` on the `DomainGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `continent` on the `DomainGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `geography` on the `DomainGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `EventGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `homeBase` on the `FactionGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `leader` on the `FactionGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `LandmarkGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `faction` on the `PersonGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `PersonGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `occupation` on the `PersonGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `PersonGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `climate` on the `TerritoryGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `TerritoryGlossary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DomainGlossary" DROP COLUMN "capital",
DROP COLUMN "continent",
DROP COLUMN "geography",
ADD COLUMN     "capitals" TEXT[],
ADD COLUMN     "continents" TEXT[],
ADD COLUMN     "landmarks" TEXT[];

-- AlterTable
ALTER TABLE "EventGlossary" DROP COLUMN "location",
ADD COLUMN     "locations" TEXT[];

-- AlterTable
ALTER TABLE "FactionGlossary" DROP COLUMN "homeBase",
DROP COLUMN "leader",
ADD COLUMN     "homeBases" TEXT[],
ADD COLUMN     "leaders" TEXT[];

-- AlterTable
ALTER TABLE "LandmarkGlossary" DROP COLUMN "region",
ADD COLUMN     "regions" TEXT[];

-- AlterTable
ALTER TABLE "PersonGlossary" DROP COLUMN "faction",
DROP COLUMN "location",
DROP COLUMN "occupation",
DROP COLUMN "title",
ADD COLUMN     "factions" TEXT[],
ADD COLUMN     "locations" TEXT[],
ADD COLUMN     "occupations" TEXT[],
ADD COLUMN     "titles" TEXT[];

-- AlterTable
ALTER TABLE "TerritoryGlossary" DROP COLUMN "climate",
DROP COLUMN "features",
ADD COLUMN     "climates" TEXT[],
ADD COLUMN     "landmarks" TEXT[];

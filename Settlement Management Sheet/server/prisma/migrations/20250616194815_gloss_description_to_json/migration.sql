/*
  Warnings:

  - Changed the type of `description` on the `ContinentGlossary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `description` on the `DomainGlossary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `description` on the `EventGlossary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `description` on the `FactionGlossary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `description` on the `LandmarkGlossary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `description` on the `LocationGlossary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `description` on the `NoteGlossary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `description` on the `PersonGlossary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `description` on the `ProvinceGlossary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `description` on the `SettlementGlossary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `description` on the `TerritoryGlossary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ContinentGlossary" DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "DomainGlossary" DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "EventGlossary" DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "FactionGlossary" DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "LandmarkGlossary" DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "LocationGlossary" DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "NoteGlossary" DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "PersonGlossary" DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "ProvinceGlossary" DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "SettlementGlossary" DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "TerritoryGlossary" DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL;

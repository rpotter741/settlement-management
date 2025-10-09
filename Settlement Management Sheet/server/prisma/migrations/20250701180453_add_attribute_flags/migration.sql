/*
  Warnings:

  - You are about to drop the column `positive` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `climate` on the `ContinentGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `culture` on the `DomainGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `climate` on the `LandmarkGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `LocationGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `nation` on the `SettlementGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `SettlementGlossary` table. All the data in the column will be lost.
  - Added the required column `canHurt` to the `Attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasThresholds` to the `Attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPositive` to the `Attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isTradeable` to the `Attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `properties` to the `Attribute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "positive",
ADD COLUMN     "canHurt" BOOLEAN NOT NULL,
ADD COLUMN     "hasThresholds" BOOLEAN NOT NULL,
ADD COLUMN     "isPositive" BOOLEAN NOT NULL,
ADD COLUMN     "isTradeable" BOOLEAN NOT NULL,
ADD COLUMN     "properties" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "ContinentGlossary" DROP COLUMN "climate",
ADD COLUMN     "climates" "ClimateTypes"[],
ADD COLUMN     "landmarks" TEXT[];

-- AlterTable
ALTER TABLE "DomainGlossary" DROP COLUMN "culture",
ADD COLUMN     "cultures" JSONB,
ALTER COLUMN "population" DROP NOT NULL,
ALTER COLUMN "economy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "LandmarkGlossary" DROP COLUMN "climate",
ADD COLUMN     "climates" "ClimateTypes";

-- AlterTable
ALTER TABLE "LocationGlossary" DROP COLUMN "type",
ADD COLUMN     "locationType" TEXT;

-- AlterTable
ALTER TABLE "ProvinceGlossary" ADD COLUMN     "landmarks" TEXT[];

-- AlterTable
ALTER TABLE "SettlementGlossary" DROP COLUMN "nation",
DROP COLUMN "region",
ADD COLUMN     "nations" TEXT,
ADD COLUMN     "regions" TEXT;

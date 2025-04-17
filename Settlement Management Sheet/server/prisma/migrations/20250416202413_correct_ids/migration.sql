/*
  Warnings:

  - The primary key for the `Attribute` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `version` to the `Attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('Weather', 'Morale');

-- CreateEnum
CREATE TYPE "UpgradeType" AS ENUM ('Settlement', 'Leadership', 'Building');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('forest', 'mountain', 'plain', 'river', 'lake', 'ocean', 'ruin', 'mine', 'cave', 'poi');

-- AlterTable
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_pkey",
ADD COLUMN     "version" INTEGER NOT NULL,
ALTER COLUMN "status" DROP DEFAULT,
ADD CONSTRAINT "Attribute_pkey" PRIMARY KEY ("refId");

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
ADD COLUMN     "version" INTEGER NOT NULL,
ALTER COLUMN "status" DROP DEFAULT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("refId");

-- CreateTable
CREATE TABLE "Event" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "flavorText" JSONB NOT NULL,
    "phases" JSONB NOT NULL,
    "resolutions" JSONB NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Listener" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "conditions" JSONB NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listener_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "GameStatus" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "StatusType" NOT NULL,
    "steps" JSONB NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameStatus_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Building" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "upgrades" JSONB NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Upgrade" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "impact" JSONB NOT NULL,
    "ability" TEXT NOT NULL,
    "upgradeType" "UpgradeType" NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Upgrade_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "TradeHub" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT 'None',
    "stock" JSONB NOT NULL,
    "trend" JSONB NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradeHub_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "SettlementType" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "upgrades" TEXT[],
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SettlementType_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Settlement" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "stats" JSONB NOT NULL,
    "pop" JSONB NOT NULL,
    "categories" JSONB NOT NULL,
    "eventLog" JSONB NOT NULL,
    "narrativeData" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Location" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventRefs" TEXT[],
    "linkedRegion" TEXT NOT NULL,
    "linkedRegionId" TEXT NOT NULL,
    "type" "LocationType" NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Region" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "locations" TEXT[],
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("refId")
);

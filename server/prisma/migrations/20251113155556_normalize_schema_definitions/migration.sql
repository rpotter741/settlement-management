/*
  Warnings:

  - The `type` column on the `BacklinkIndex` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `groupData` on the `EntrySubType` table. All the data in the column will be lost.
  - You are about to drop the column `groupOrder` on the `EntrySubType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sourceId,targetId,propertyId]` on the table `BacklinkIndex` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `propertyId` to the `BacklinkIndex` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyName` to the `BacklinkIndex` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PropertyInputTypes" AS ENUM ('text', 'date', 'range', 'checkbox', 'select', 'compound');

-- CreateEnum
CREATE TYPE "BacklinkType" AS ENUM ('direct', 'indirect', 'hierarchal');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EntryTypes" ADD VALUE 'district';
ALTER TYPE "EntryTypes" ADD VALUE 'folder';

-- DropIndex
DROP INDEX "BacklinkIndex_sourceId_targetId_type_key";

-- AlterTable
ALTER TABLE "BacklinkIndex" ADD COLUMN     "propertyId" TEXT NOT NULL,
ADD COLUMN     "propertyName" TEXT NOT NULL,
ADD COLUMN     "propertyValue" JSONB,
DROP COLUMN "type",
ADD COLUMN     "type" "BacklinkType";

-- AlterTable
ALTER TABLE "EntrySubType" DROP COLUMN "groupData",
DROP COLUMN "groupOrder";

-- CreateTable
CREATE TABLE "SubTypeProperty" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isAnchor" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "inputType" "PropertyInputTypes" NOT NULL,
    "shape" JSONB NOT NULL,

    CONSTRAINT "SubTypeProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubTypeGroup" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "SubTypeGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubTypeGroupProperty" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "SubTypeGroupProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubTypeSchemaGroup" (
    "id" TEXT NOT NULL,
    "schemaId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "SubTypeSchemaGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubTypeGroupProperty_groupId_propertyId_key" ON "SubTypeGroupProperty"("groupId", "propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "SubTypeSchemaGroup_schemaId_groupId_key" ON "SubTypeSchemaGroup"("schemaId", "groupId");

-- CreateIndex
CREATE INDEX "BacklinkIndex_propertyId_idx" ON "BacklinkIndex"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "BacklinkIndex_sourceId_targetId_propertyId_key" ON "BacklinkIndex"("sourceId", "targetId", "propertyId");

-- AddForeignKey
ALTER TABLE "SubTypeGroupProperty" ADD CONSTRAINT "SubTypeGroupProperty_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "SubTypeGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTypeGroupProperty" ADD CONSTRAINT "SubTypeGroupProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "SubTypeProperty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTypeSchemaGroup" ADD CONSTRAINT "SubTypeSchemaGroup_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "EntrySubType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTypeSchemaGroup" ADD CONSTRAINT "SubTypeSchemaGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "SubTypeGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BacklinkIndex" ADD CONSTRAINT "BacklinkIndex_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "SubTypeProperty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

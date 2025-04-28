/*
  Warnings:

  - Added the required column `mode` to the `GameStatus` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusMode" AS ENUM ('Simple', 'Advanced');

-- AlterEnum
ALTER TYPE "StatusType" ADD VALUE 'Settlement';

-- AlterTable
ALTER TABLE "GameStatus" ADD COLUMN     "mode" "StatusMode" NOT NULL;

-- CreateTable
CREATE TABLE "Kit" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "categories" TEXT[],
    "regions" TEXT[],
    "locations" TEXT[],
    "people" TEXT[],
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kit_pkey" PRIMARY KEY ("refId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kit_id_key" ON "Kit"("id");

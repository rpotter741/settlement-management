/*
  Warnings:

  - The `status` column on the `Attribute` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT';

-- DropEnum
DROP TYPE "AttributeStatus";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "thresholds" JSONB NOT NULL,
    "dependencies" JSONB NOT NULL,
    "tags" TEXT[],
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Category_contentType_idx" ON "Category"("contentType");

-- CreateIndex
CREATE INDEX "Category_tags_idx" ON "Category"("tags");

-- CreateIndex
CREATE INDEX "Category_refId_updatedAt_idx" ON "Category"("refId", "updatedAt" DESC);

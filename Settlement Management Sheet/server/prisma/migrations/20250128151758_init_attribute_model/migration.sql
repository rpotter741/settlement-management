-- CreateEnum
CREATE TYPE "ContentTypes" AS ENUM ('OFFICIAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "AttributeStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "balance" JSONB NOT NULL,
    "thresholds" JSONB NOT NULL,
    "settlementPointCost" JSONB NOT NULL,
    "icon" TEXT NOT NULL,
    "iconColor" TEXT NOT NULL,
    "tags" TEXT[],
    "isValid" BOOLEAN NOT NULL,
    "status" "AttributeStatus" NOT NULL DEFAULT 'DRAFT',
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attribute_contentType_idx" ON "Attribute"("contentType");

-- CreateIndex
CREATE INDEX "Attribute_tags_idx" ON "Attribute"("tags");

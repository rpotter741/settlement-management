/*
  Warnings:

  - Added the required column `theme` to the `Glossary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Glossary" ADD COLUMN     "theme" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GlossaryTheme" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "description" TEXT NOT NULL,
    "palettes" JSONB NOT NULL,
    "glossaries" TEXT[],

    CONSTRAINT "GlossaryTheme_pkey" PRIMARY KEY ("id")
);

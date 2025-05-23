-- CreateEnum
CREATE TYPE "GlossShape" AS ENUM ('folder', 'file');

-- CreateEnum
CREATE TYPE "EntryTypes" AS ENUM ('Region', 'Location', 'POI', 'Person', 'Faction');

-- CreateTable
CREATE TABLE "Glossary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentType" "ContentTypes" NOT NULL,

    CONSTRAINT "Glossary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryNode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entryType" "EntryTypes",
    "type" "GlossShape" NOT NULL,
    "parentId" TEXT,
    "glossaryId" TEXT NOT NULL,
    "sortIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GlossaryNode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GlossaryNode" ADD CONSTRAINT "GlossaryNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GlossaryNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossaryNode" ADD CONSTRAINT "GlossaryNode_glossaryId_fkey" FOREIGN KEY ("glossaryId") REFERENCES "Glossary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

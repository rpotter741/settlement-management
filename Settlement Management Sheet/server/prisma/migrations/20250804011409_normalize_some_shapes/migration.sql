/*
  Warnings:

  - You are about to drop the column `descDataString` on the `EventGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `entryId` on the `GlossaryGeography` table. All the data in the column will be lost.
  - You are about to drop the column `entryId` on the `GlossaryHistory` table. All the data in the column will be lost.
  - You are about to drop the column `entryId` on the `GlossaryPolitics` table. All the data in the column will be lost.
  - You are about to drop the column `entryId` on the `GlossaryRelationships` table. All the data in the column will be lost.
  - You are about to drop the column `descDataString` on the `LocationGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `descDataString` on the `NoteGlossary` table. All the data in the column will be lost.
  - You are about to drop the column `descDataString` on the `PersonGlossary` table. All the data in the column will be lost.
  - Added the required column `dataString` to the `NoteGlossary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventGlossary" DROP COLUMN "descDataString",
ADD COLUMN     "dataString" TEXT,
ADD COLUMN     "editors" TEXT[],
ADD COLUMN     "forkedBy" TEXT,
ADD COLUMN     "sections" TEXT[],
ADD COLUMN     "subType" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GlossaryGeography" DROP COLUMN "entryId";

-- AlterTable
ALTER TABLE "GlossaryHistory" DROP COLUMN "entryId";

-- AlterTable
ALTER TABLE "GlossaryPolitics" DROP COLUMN "entryId";

-- AlterTable
ALTER TABLE "GlossaryRelationships" DROP COLUMN "entryId";

-- AlterTable
ALTER TABLE "LocationGlossary" DROP COLUMN "descDataString",
ADD COLUMN     "dataString" TEXT,
ADD COLUMN     "editors" TEXT[],
ADD COLUMN     "forkedBy" TEXT,
ADD COLUMN     "subType" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "NoteGlossary" DROP COLUMN "descDataString",
ADD COLUMN     "dataString" TEXT NOT NULL,
ADD COLUMN     "editors" TEXT[],
ADD COLUMN     "forkedBy" TEXT;

-- AlterTable
ALTER TABLE "PersonGlossary" DROP COLUMN "descDataString",
ADD COLUMN     "dataString" TEXT,
ADD COLUMN     "editors" TEXT[],
ADD COLUMN     "forkedBy" TEXT,
ADD COLUMN     "subType" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

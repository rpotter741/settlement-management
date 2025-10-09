/*
  Warnings:

  - You are about to drop the `GlossaryPolitical` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GlossaryPolitical" DROP CONSTRAINT "GlossaryPolitical_id_fkey";

-- DropTable
DROP TABLE "GlossaryPolitical";

-- CreateTable
CREATE TABLE "GlossaryPolitics" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nations" TEXT[],
    "settlements" TEXT[],
    "factions" TEXT[],
    "locations" TEXT[],
    "resources" JSONB,
    "population" JSONB,
    "economy" JSONB,
    "cultures" JSONB,
    "customFields" JSONB,
    "entryId" TEXT,

    CONSTRAINT "GlossaryPolitics_pkey" PRIMARY KEY ("refId")
);

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryPolitics_id_key" ON "GlossaryPolitics"("id");

-- AddForeignKey
ALTER TABLE "GlossaryPolitics" ADD CONSTRAINT "GlossaryPolitics_id_fkey" FOREIGN KEY ("id") REFERENCES "GlossarySection"("refId") ON DELETE CASCADE ON UPDATE CASCADE;

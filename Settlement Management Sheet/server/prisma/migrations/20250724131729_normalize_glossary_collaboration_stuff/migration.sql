/*
  Warnings:

  - You are about to drop the column `customTabs` on the `GlossarySection` table. All the data in the column will be lost.
  - Added the required column `forkedBy` to the `GlossarySection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Glossary" ADD COLUMN     "forkedBy" TEXT,
ADD COLUMN     "templates" JSONB;

-- AlterTable
ALTER TABLE "GlossarySection" DROP COLUMN "customTabs",
ADD COLUMN     "editors" TEXT[],
ADD COLUMN     "forkedBy" TEXT NOT NULL,
ALTER COLUMN "integrationState" DROP NOT NULL;

-- CreateTable
CREATE TABLE "GlossaryCustom" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "groups" TEXT[],
    "customFields" JSONB NOT NULL,

    CONSTRAINT "GlossaryCustom_pkey" PRIMARY KEY ("refId")
);

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryCustom_id_key" ON "GlossaryCustom"("id");

-- AddForeignKey
ALTER TABLE "GlossaryCustom" ADD CONSTRAINT "GlossaryCustom_id_fkey" FOREIGN KEY ("id") REFERENCES "GlossarySection"("refId") ON DELETE CASCADE ON UPDATE CASCADE;

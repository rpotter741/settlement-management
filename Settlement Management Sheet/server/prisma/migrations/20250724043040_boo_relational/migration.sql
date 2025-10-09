/*
  Warnings:

  - You are about to drop the column `geographyId` on the `GlossarySection` table. All the data in the column will be lost.
  - You are about to drop the column `historyId` on the `GlossarySection` table. All the data in the column will be lost.
  - You are about to drop the column `politicalId` on the `GlossarySection` table. All the data in the column will be lost.
  - You are about to drop the column `relationshipsId` on the `GlossarySection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GlossarySection" DROP COLUMN "geographyId",
DROP COLUMN "historyId",
DROP COLUMN "politicalId",
DROP COLUMN "relationshipsId";

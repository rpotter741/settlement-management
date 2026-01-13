/*
  Warnings:

  - You are about to drop the column `templateId` on the `GlossaryNode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GlossaryNode" DROP COLUMN "templateId",
ADD COLUMN     "subTypeId" TEXT;

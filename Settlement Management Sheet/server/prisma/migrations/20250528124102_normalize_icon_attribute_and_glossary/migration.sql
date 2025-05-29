/*
  Warnings:

  - You are about to drop the column `iconColor` on the `Attribute` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "iconColor";

-- AlterTable
ALTER TABLE "GlossaryNode" ADD COLUMN     "icon" JSONB;

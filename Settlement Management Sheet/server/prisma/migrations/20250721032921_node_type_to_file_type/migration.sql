/*
  Warnings:

  - You are about to drop the column `type` on the `GlossaryNode` table. All the data in the column will be lost.
  - Added the required column `fileType` to the `GlossaryNode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GlossaryNode" DROP COLUMN "type",
ADD COLUMN     "fileType" "GlossShape" NOT NULL;

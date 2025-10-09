/*
  Warnings:

  - You are about to drop the column `entryId` on the `GlossaryCustom` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,customTabId]` on the table `GlossaryCustom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customTabId` to the `GlossaryCustom` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GlossaryCustom_id_key";

-- AlterTable
ALTER TABLE "GlossaryCustom" DROP COLUMN "entryId",
ADD COLUMN     "customTabId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryCustom_id_customTabId_key" ON "GlossaryCustom"("id", "customTabId");

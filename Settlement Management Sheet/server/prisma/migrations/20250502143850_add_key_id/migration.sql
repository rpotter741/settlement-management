/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Key` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Key` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Key" ADD COLUMN     "id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Key_id_key" ON "Key"("id");

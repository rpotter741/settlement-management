/*
  Warnings:

  - Added the required column `positive` to the `Attribute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "positive" BOOLEAN NOT NULL;

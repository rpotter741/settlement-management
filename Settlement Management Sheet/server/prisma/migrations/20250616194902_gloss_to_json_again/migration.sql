/*
  Warnings:

  - The `description` column on the `Glossary` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Glossary" DROP COLUMN "description",
ADD COLUMN     "description" JSONB;

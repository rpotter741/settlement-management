/*
  Warnings:

  - The values [select] on the enum `PropertyInputTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PropertyInputTypes_new" AS ENUM ('text', 'date', 'range', 'checkbox', 'dropdown', 'compound');
ALTER TABLE "SubTypeProperty" ALTER COLUMN "inputType" TYPE "PropertyInputTypes_new" USING ("inputType"::text::"PropertyInputTypes_new");
ALTER TYPE "PropertyInputTypes" RENAME TO "PropertyInputTypes_old";
ALTER TYPE "PropertyInputTypes_new" RENAME TO "PropertyInputTypes";
DROP TYPE "PropertyInputTypes_old";
COMMIT;

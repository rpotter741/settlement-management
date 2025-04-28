/*
  Warnings:

  - Changed the type of `categories` on the `Kit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `regions` on the `Kit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `locations` on the `Kit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `people` on the `Kit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Kit" DROP COLUMN "categories",
ADD COLUMN     "categories" JSONB NOT NULL,
DROP COLUMN "regions",
ADD COLUMN     "regions" JSONB NOT NULL,
DROP COLUMN "locations",
ADD COLUMN     "locations" JSONB NOT NULL,
DROP COLUMN "people",
ADD COLUMN     "people" JSONB NOT NULL;

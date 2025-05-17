/*
  Warnings:

  - You are about to drop the column `categories` on the `Kit` table. All the data in the column will be lost.
  - You are about to drop the column `locations` on the `Kit` table. All the data in the column will be lost.
  - You are about to drop the column `people` on the `Kit` table. All the data in the column will be lost.
  - You are about to drop the column `regions` on the `Kit` table. All the data in the column will be lost.
  - You are about to drop the column `conditions` on the `Listener` table. All the data in the column will be lost.
  - Added the required column `data` to the `Kit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conditionEventPairs` to the `Listener` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Kit" DROP COLUMN "categories",
DROP COLUMN "locations",
DROP COLUMN "people",
DROP COLUMN "regions",
ADD COLUMN     "data" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Listener" DROP COLUMN "conditions",
ADD COLUMN     "conditionEventPairs" JSONB NOT NULL;

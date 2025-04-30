/*
  Warnings:

  - You are about to drop the column `impact` on the `Upgrade` table. All the data in the column will be lost.
  - You are about to drop the `GameStatus` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `impacts` to the `Upgrade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Upgrade" DROP COLUMN "impact",
ADD COLUMN     "impacts" JSONB NOT NULL;

-- DropTable
DROP TABLE "GameStatus";

-- CreateTable
CREATE TABLE "gameStatus" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "StatusType" NOT NULL,
    "steps" JSONB NOT NULL,
    "mode" "StatusMode" NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gameStatus_pkey" PRIMARY KEY ("refId")
);

-- CreateIndex
CREATE UNIQUE INDEX "gameStatus_id_key" ON "gameStatus"("id");

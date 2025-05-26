/*
  Warnings:

  - You are about to drop the `POI` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "POI";

-- CreateTable
CREATE TABLE "Poi" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "type" TEXT NOT NULL,
    "region" TEXT[],
    "currentOccupants" TEXT[],
    "nearbyFeatures" JSONB NOT NULL,

    CONSTRAINT "Poi_pkey" PRIMARY KEY ("refId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Poi_id_key" ON "Poi"("id");

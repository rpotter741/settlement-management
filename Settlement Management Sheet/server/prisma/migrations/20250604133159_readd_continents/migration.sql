-- CreateTable
CREATE TABLE "ContinentGlossary" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nations" TEXT[],
    "regions" TEXT[],
    "notableLocations" TEXT[],
    "resources" TEXT[],
    "population" JSONB NOT NULL,
    "climate" "ClimateTypes" NOT NULL DEFAULT 'arid',
    "terrain" "GeographicTypes"[],
    "eventLog" TEXT[],

    CONSTRAINT "ContinentGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContinentGlossary_id_key" ON "ContinentGlossary"("id");

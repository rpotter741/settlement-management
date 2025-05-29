-- CreateTable
CREATE TABLE "GeographyGlossary" (
    "refId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeographyGlossary_pkey" PRIMARY KEY ("refId")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeographyGlossary_id_key" ON "GeographyGlossary"("id");

-- CreateTable
CREATE TABLE "Key" (
    "refId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Key_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "KeySettings" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "delay" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "durationType" TEXT NOT NULL,
    "severityOverTime" JSONB NOT NULL,
    "contentType" "ContentTypes" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KeySettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Key_name_key" ON "Key"("name");

-- AddForeignKey
ALTER TABLE "KeySettings" ADD CONSTRAINT "KeySettings_refId_fkey" FOREIGN KEY ("refId") REFERENCES "Key"("refId") ON DELETE CASCADE ON UPDATE CASCADE;

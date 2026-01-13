/*
  Warnings:

  - You are about to drop the column `subTypes` on the `Glossary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Glossary" DROP COLUMN "subTypes";

-- CreateTable
CREATE TABLE "_SubTypes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SubTypes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SubTypes_B_index" ON "_SubTypes"("B");

-- AddForeignKey
ALTER TABLE "_SubTypes" ADD CONSTRAINT "_SubTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "EntrySubType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubTypes" ADD CONSTRAINT "_SubTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "Glossary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

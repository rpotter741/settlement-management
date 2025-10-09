-- DropForeignKey
ALTER TABLE "GlossaryNode" DROP CONSTRAINT "GlossaryNode_parentId_fkey";

-- DropForeignKey
ALTER TABLE "GlossarySection" DROP CONSTRAINT "GlossarySection_geographyId_fkey";

-- DropForeignKey
ALTER TABLE "GlossarySection" DROP CONSTRAINT "GlossarySection_historyId_fkey";

-- DropForeignKey
ALTER TABLE "GlossarySection" DROP CONSTRAINT "GlossarySection_politicalId_fkey";

-- DropForeignKey
ALTER TABLE "GlossarySection" DROP CONSTRAINT "GlossarySection_relationshipsId_fkey";

-- AddForeignKey
ALTER TABLE "GlossarySection" ADD CONSTRAINT "GlossarySection_geographyId_fkey" FOREIGN KEY ("geographyId") REFERENCES "GlossaryGeography"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossarySection" ADD CONSTRAINT "GlossarySection_politicalId_fkey" FOREIGN KEY ("politicalId") REFERENCES "GlossaryPolitical"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossarySection" ADD CONSTRAINT "GlossarySection_relationshipsId_fkey" FOREIGN KEY ("relationshipsId") REFERENCES "GlossaryRelationships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossarySection" ADD CONSTRAINT "GlossarySection_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "GlossaryHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

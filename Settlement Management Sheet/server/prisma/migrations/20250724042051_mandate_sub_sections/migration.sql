-- DropForeignKey
ALTER TABLE "GlossarySection" DROP CONSTRAINT "GlossarySection_geographyId_fkey";

-- DropForeignKey
ALTER TABLE "GlossarySection" DROP CONSTRAINT "GlossarySection_historyId_fkey";

-- DropForeignKey
ALTER TABLE "GlossarySection" DROP CONSTRAINT "GlossarySection_politicalId_fkey";

-- DropForeignKey
ALTER TABLE "GlossarySection" DROP CONSTRAINT "GlossarySection_relationshipsId_fkey";

-- AddForeignKey
ALTER TABLE "GlossaryGeography" ADD CONSTRAINT "GlossaryGeography_id_fkey" FOREIGN KEY ("id") REFERENCES "GlossarySection"("refId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossaryPolitical" ADD CONSTRAINT "GlossaryPolitical_id_fkey" FOREIGN KEY ("id") REFERENCES "GlossarySection"("refId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossaryRelationships" ADD CONSTRAINT "GlossaryRelationships_id_fkey" FOREIGN KEY ("id") REFERENCES "GlossarySection"("refId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossaryHistory" ADD CONSTRAINT "GlossaryHistory_id_fkey" FOREIGN KEY ("id") REFERENCES "GlossarySection"("refId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossaryNode" ADD CONSTRAINT "GlossaryNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GlossaryNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

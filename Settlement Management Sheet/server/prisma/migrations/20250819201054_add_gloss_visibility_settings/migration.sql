-- CreateEnum
CREATE TYPE "GlossVisibilitySettings" AS ENUM ('private', 'standard', 'open', 'public');

-- AlterTable
ALTER TABLE "Glossary" ADD COLUMN     "visibility" "GlossVisibilitySettings" NOT NULL DEFAULT 'standard';

-- AlterTable
ALTER TABLE "GlossaryNode" ADD COLUMN     "integrationState" JSONB;

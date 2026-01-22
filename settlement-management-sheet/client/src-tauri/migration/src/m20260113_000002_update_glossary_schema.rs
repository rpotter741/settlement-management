use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Drop existing tables
        manager
            .get_connection()
            .execute_unprepared(
                r#"
DROP TABLE IF EXISTS "BacklinkIndex";
DROP TABLE IF EXISTS "SubTypeSchemaGroup";
DROP TABLE IF EXISTS "SubTypeGroupProperty";
DROP TABLE IF EXISTS "GlossaryEntry";
DROP TABLE IF EXISTS "EntrySubType";
DROP TABLE IF EXISTS "SubTypeGroup";
DROP TABLE IF EXISTS "SubTypeProperty";
DROP TABLE IF EXISTS "GlossaryNode";
DROP TABLE IF EXISTS "Glossary";
"#,
            )
            .await?;

        // Create tables with updated schema
        manager
            .get_connection()
            .execute_unprepared(
                r#"


-- Glossary table
CREATE TABLE "Glossary" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "genre" TEXT NOT NULL,
  "sub_genre" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "created_by" TEXT NOT NULL,
  "content_type" TEXT NOT NULL,
  "ref_id" TEXT NOT NULL DEFAULT (lower(hex(randomblob(16)))),
  "version" INTEGER NOT NULL DEFAULT 1,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now')),
  "is_immutable" INTEGER NOT NULL DEFAULT 0,
  "visibility" TEXT NOT NULL DEFAULT 'standard',
  "collaborators" TEXT,
  "forked_by" TEXT,
  "editors" TEXT,
  "deleted_at" TEXT,
  "theme" TEXT,
  "integration_state" TEXT,
  UNIQUE("ref_id", "version")
);

CREATE INDEX "Glossary_content_type_idx" ON "Glossary"("content_type");
CREATE INDEX "Glossary_ref_id_idx" ON "Glossary"("ref_id");

-- GlossaryNode table
CREATE TABLE "GlossaryNode" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "entry_type" TEXT NOT NULL,
  "file_type" TEXT NOT NULL,
  "sub_type_id" TEXT NOT NULL,
  "glossary_id" TEXT NOT NULL,
  "sort_index" INTEGER NOT NULL DEFAULT 0,
  "icon" TEXT,
  "integration_state" TEXT,
  "parent_id" TEXT,
  FOREIGN KEY ("glossary_id") REFERENCES "Glossary"("id") ON DELETE CASCADE,
  FOREIGN KEY ("parent_id") REFERENCES "GlossaryNode"("id") ON DELETE CASCADE
);

CREATE INDEX "GlossaryNode_id_idx" ON "GlossaryNode"("id");

-- SubTypeProperty table
CREATE TABLE "SubTypeProperty" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "ref_id" TEXT NOT NULL DEFAULT (lower(hex(randomblob(16)))),
  "version" INTEGER NOT NULL DEFAULT 1,
  "content_type" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "input_type" TEXT NOT NULL,
  "shape" TEXT NOT NULL,
  "created_by" TEXT NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now')),
  "deleted_at" TEXT,
  "display_name" TEXT,
  "smart_sync" TEXT,
  "is_generic" INTEGER NOT NULL DEFAULT 0
);

-- SubTypeGroup table
CREATE TABLE "SubTypeGroup" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "ref_id" TEXT NOT NULL DEFAULT (lower(hex(randomblob(16)))),
  "version" INTEGER NOT NULL DEFAULT 1,
  "content_type" TEXT NOT NULL,
  "created_by" TEXT NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now')),
  "deleted_at" TEXT,
  "name" TEXT NOT NULL,
  "display_name" TEXT,
  "display" TEXT,
  "description" TEXT NOT NULL,
  "is_generic" INTEGER NOT NULL DEFAULT 0
);

-- EntrySubType table
CREATE TABLE "EntrySubType" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "created_by" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "content_type" TEXT NOT NULL,
  "ref_id" TEXT NOT NULL DEFAULT (lower(hex(randomblob(16)))),
  "version" INTEGER NOT NULL DEFAULT 1,
  "forked_by" TEXT,
  "collaborators" TEXT,
  "editors" TEXT,
  "deleted_at" TEXT,
  "is_immutable" INTEGER NOT NULL DEFAULT 0,
  "entry_type" TEXT NOT NULL,
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now')),
  "anchors" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "is_generic" INTEGER NOT NULL DEFAULT 0,
  "context" TEXT,
  UNIQUE("ref_id", "version")
);

CREATE INDEX "EntrySubType_ref_id_idx" ON "EntrySubType"("ref_id");
CREATE INDEX "EntrySubType_entry_type_idx" ON "EntrySubType"("entry_type");

-- GlossaryEntry table
CREATE TABLE "GlossaryEntry" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "content_type" TEXT NOT NULL,
  "created_by" TEXT NOT NULL,
  "format" TEXT NOT NULL,
  "entry_type" TEXT NOT NULL,
  "sub_type_id" TEXT NOT NULL,
  "ref_id" TEXT NOT NULL DEFAULT (lower(hex(randomblob(16)))),
  "version" INTEGER NOT NULL DEFAULT 1,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now')),
  "forked_by" TEXT,
  "collaborators" TEXT,
  "editors" TEXT,
  "deleted_at" TEXT,
  "is_immutable" INTEGER NOT NULL DEFAULT 0,
  "name" TEXT NOT NULL,
  "groups" TEXT,
  "primary_anchor_id" TEXT,
  "primary_anchor_value" TEXT,
  "secondary_anchor_id" TEXT,
  "secondary_anchor_value" TEXT,
  "tags" TEXT,
  "integration_state" TEXT,
  UNIQUE("ref_id", "version"),
  FOREIGN KEY ("sub_type_id") REFERENCES "EntrySubType"("id") ON DELETE SET NULL
);

CREATE INDEX "GlossaryEntry_ref_id_idx" ON "GlossaryEntry"("ref_id");
CREATE INDEX "GlossaryEntry_entry_type_idx" ON "GlossaryEntry"("entry_type");
CREATE INDEX "GlossaryEntry_sub_type_id_idx" ON "GlossaryEntry"("sub_type_id");
CREATE INDEX "GlossaryEntry_entry_type_sub_type_id_idx" ON "GlossaryEntry"("entry_type", "sub_type_id");
CREATE INDEX "GlossaryEntry_created_by_idx" ON "GlossaryEntry"("created_by");

-- SubTypeGroupProperty table
CREATE TABLE "SubTypeGroupProperty" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "group_id" TEXT NOT NULL,
  "property_id" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  FOREIGN KEY ("group_id") REFERENCES "SubTypeGroup"("id") ON DELETE CASCADE,
  FOREIGN KEY ("property_id") REFERENCES "SubTypeProperty"("id") ON DELETE CASCADE,
  UNIQUE("group_id", "property_id")
);

-- SubTypeSchemaGroup table
CREATE TABLE "SubTypeSchemaGroup" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "schema_id" TEXT NOT NULL,
  "group_id" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  FOREIGN KEY ("schema_id") REFERENCES "EntrySubType"("id") ON DELETE CASCADE,
  FOREIGN KEY ("group_id") REFERENCES "SubTypeGroup"("id") ON DELETE CASCADE,
  UNIQUE("schema_id", "group_id")
);

-- BacklinkIndex table
CREATE TABLE "BacklinkIndex" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "source_id" TEXT NOT NULL,
  "target_id" TEXT NOT NULL,
  "type" TEXT,
  "property_id" TEXT,
  "property_name" TEXT NOT NULL,
  "property_value" TEXT,
  "ignore_divergence" INTEGER NOT NULL DEFAULT 0,
  "last_synced_at" TEXT NOT NULL DEFAULT (datetime('now')),
  "target_ignore" INTEGER NOT NULL DEFAULT 0,
  "sub_property_id" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY ("source_id") REFERENCES "GlossaryEntry"("id") ON DELETE CASCADE,
  FOREIGN KEY ("target_id") REFERENCES "GlossaryEntry"("id") ON DELETE CASCADE,
  FOREIGN KEY ("property_id") REFERENCES "SubTypeProperty"("id") ON DELETE CASCADE,
  UNIQUE("source_id", "target_id", "property_id")
);

CREATE INDEX "BacklinkIndex_target_id_idx" ON "BacklinkIndex"("target_id");
CREATE INDEX "BacklinkIndex_property_id_idx" ON "BacklinkIndex"("property_id");
"#,
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .get_connection()
            .execute_unprepared(
                r#"
DROP TABLE IF EXISTS "BacklinkIndex";
DROP TABLE IF EXISTS "SubTypeSchemaGroup";
DROP TABLE IF EXISTS "SubTypeGroupProperty";
DROP TABLE IF EXISTS "GlossaryEntry";
DROP TABLE IF EXISTS "EntrySubType";
DROP TABLE IF EXISTS "SubTypeGroup";
DROP TABLE IF EXISTS "SubTypeProperty";
DROP TABLE IF EXISTS "GlossaryNode";
DROP TABLE IF EXISTS "Glossary";
"#,
            )
            .await?;

        Ok(())
    }
}

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
DROP TABLE IF EXISTS "GlossaryMetaData";
DROP TABLE IF EXISTS "UserGlossary";
DROP TABLE IF EXISTS "SystemGlossary";
DROP TABLE IF EXISTS "UserSettings";
DROP TABLE IF EXISTS "Devices";
DROP TABLE IF EXISTS "UserTiers";
DROP TABLE IF EXISTS "Users";
DROP TABLE IF EXISTS "UserBacklinkIndex";
DROP TABLE IF EXISTS "SystemBacklinkIndex";
DROP TABLE IF EXISTS "UserSubTypeSchemaGroup";
DROP TABLE IF EXISTS "SystemSubTypeSchemaGroup";
DROP TABLE IF EXISTS "UserSubTypeGroupProperty";
DROP TABLE IF EXISTS "UserGlossaryEntry";
DROP TABLE IF EXISTS "UserSubType";
DROP TABLE IF EXISTS "UserSubTypeGroup";
DROP TABLE IF EXISTS "UserSubTypeProperty";
DROP TABLE IF EXISTS "UserGlossaryNode";
DROP TABLE IF EXISTS "SystemGlossaryNode";
DROP TABLE IF EXISTS "SystemSubType";
DROP TABLE IF EXISTS "SystemSubTypeGroup";
DROP TABLE IF EXISTS "SystemSubTypeProperty";
DROP TABLE IF EXISTS "SystemGlossaryEntry";
DROP TABLE IF EXISTS "EntrySubType";
"#,
            )
            .await?;

        // Create tables with updated schema
        manager
            .get_connection()
            .execute_unprepared(
                r#"

-- Users table
CREATE TABLE "Users" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "email" TEXT NOT NULL UNIQUE,
  "role" TEXT NOT NULL DEFAULT 'user',
  "created_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc'))
);

CREATE INDEX "Users_username_idx" ON "Users"("username");
CREATE INDEX "Users_email_idx" ON "Users"("email");

-- UserTiers table
CREATE TABLE "UserTiers" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "tier" TEXT NOT NULL,
  "started_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "ended_at" TEXT,
  "expires_at" TEXT,
  FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE
);

-- Devices table
CREATE TABLE "Devices" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT,
  "device_uuid" TEXT NOT NULL UNIQUE,
  "last_seen" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "created_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE SET NULL
);

-- UserSettings table
CREATE TABLE "UserSettings" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL UNIQUE,
  "settings" TEXT NOT NULL,
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "version" INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE
);

-- SystemGlossary table
CREATE TABLE "SystemGlossary" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "genre" TEXT NOT NULL,
  "sub_genre" TEXT NOT NULL,
  "description" TEXT,
  "rt_description" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "theme" TEXT,
  UNIQUE("name", "genre", "sub_genre", "version")
);

CREATE INDEX "SystemGlossary_name_genre_sub_genre_idx" ON "SystemGlossary"("name", "genre", "sub_genre");

-- UserGlossary table
CREATE TABLE "UserGlossary" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "genre" TEXT NOT NULL,
  "sub_genre" TEXT NOT NULL,
  "description" TEXT,
  "rt_description" TEXT,
  "created_by" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "visibility" TEXT NOT NULL DEFAULT 'standard',
  "deleted_at" TEXT,
  "theme" TEXT,
  "integration_state" TEXT,
  FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE CASCADE,
  UNIQUE("name", "genre", "sub_genre", "created_by", "version")
);

CREATE INDEX "UserGlossary_id_idx" ON "UserGlossary"("id");

-- GlossaryMetaData table
CREATE TABLE "GlossaryMetaData" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "ref_id" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "published_at" TEXT,
  "download_count" INTEGER NOT NULL DEFAULT 0,
  "fork_count" INTEGER NOT NULL DEFAULT 0,
  "forked_from" TEXT,
  "forked_by" TEXT,
  "deleted_at" TEXT,
  "status" TEXT NOT NULL DEFAULT "draft",
  FOREIGN KEY ("id") REFERENCES "UserGlossary"("id") ON DELETE CASCADE
);

CREATE INDEX "GlossaryMetaData_id_idx" ON "GlossaryMetaData"("id");

-- SystemGlossaryNode table
CREATE TABLE "SystemGlossaryNode" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "entry_type" TEXT NOT NULL,
  "glossary_id" TEXT NOT NULL,
  "system_sub_type_id" TEXT NOT NULL,
  "sort_index" INTEGER NOT NULL DEFAULT 0,
  "icon" TEXT,
  "integration_state" TEXT,
  "parent_id" TEXT,
  FOREIGN KEY ("glossary_id") REFERENCES "SystemGlossary"("id") ON DELETE CASCADE,
  FOREIGN KEY ("parent_id") REFERENCES "SystemGlossaryNode"("id") ON DELETE CASCADE
);

-- UserGlossaryNode table
CREATE TABLE "UserGlossaryNode" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "entry_type" TEXT NOT NULL,
  "sub_type_id" TEXT NOT NULL,
  "glossary_id" TEXT NOT NULL,
  "sort_index" INTEGER NOT NULL DEFAULT 0,
  "icon" TEXT,
  "integration_state" TEXT,
  "parent_id" TEXT,
  FOREIGN KEY ("glossary_id") REFERENCES "UserGlossary"("id") ON DELETE CASCADE,
  FOREIGN KEY ("parent_id") REFERENCES "UserGlossaryNode"("id") ON DELETE CASCADE
);

CREATE INDEX "UserGlossaryNode_id_idx" ON "UserGlossaryNode"("id");

-- SystemSubTypeProperty table
CREATE TABLE "SystemSubTypeProperty" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "input_type" TEXT NOT NULL,
  "shape" TEXT NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "display_name" TEXT,
  "smart_sync" TEXT
);

CREATE INDEX "SystemSubTypeProperty_id_idx" ON "SystemSubTypeProperty"("id");

-- UserSubTypeProperty table
CREATE TABLE "UserSubTypeProperty" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "input_type" TEXT NOT NULL,
  "shape" TEXT NOT NULL,
  "created_by" TEXT NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "deleted_at" TEXT,
  "display_name" TEXT,
  "smart_sync" TEXT,
  FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE CASCADE
);

CREATE INDEX "UserSubTypeProperty_id_idx" ON "UserSubTypeProperty"("id");
CREATE INDEX "UserSubTypeProperty_created_by_idx" ON "UserSubTypeProperty"("created_by");

-- UserSubTypePropertyMetadata table
CREATE TABLE "UserSubTypePropertyMetadata" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "ref_id" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "published_at" TEXT,
  "download_count" INTEGER NOT NULL DEFAULT 0,
  "fork_count" INTEGER NOT NULL DEFAULT 0,
  "forked_from" TEXT,
  "forked_by" TEXT,
  "deleted_at" TEXT,
  "status" TEXT NOT NULL DEFAULT "draft",
  FOREIGN KEY ("id") REFERENCES "UserSubTypeProperty"("id") ON DELETE CASCADE
);

CREATE INDEX "UserSubTypePropertyMetadata_id_idx" ON "UserSubTypePropertyMetadata"("id");

-- SystemSubTypeGroup table
CREATE TABLE "SystemSubTypeGroup" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "display_name" TEXT,
  "display" TEXT,
  "description" TEXT,
  "rt_description" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- UserSubTypeGroup table
CREATE TABLE "UserSubTypeGroup" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "created_by" TEXT NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "deleted_at" TEXT,
  "name" TEXT NOT NULL,
  "display_name" TEXT,
  "display" TEXT,
  "description" TEXT,
  "rt_description" TEXT,
  FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE CASCADE
);

CREATE INDEX "UserSubTypeGroup_id_idx" ON "UserSubTypeGroup"("id");

-- UserSubTypeGroupMetadata table
CREATE TABLE "UserSubTypeGroupMetadata" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "ref_id" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "published_at" TEXT,
  "download_count" INTEGER NOT NULL DEFAULT 0,
  "fork_count" INTEGER NOT NULL DEFAULT 0,
  "forked_from" TEXT,
  "forked_by" TEXT,
  "deleted_at" TEXT,
  "status" TEXT NOT NULL DEFAULT "draft",
  FOREIGN KEY ("id") REFERENCES "UserSubTypeGroup"("id") ON DELETE CASCADE
);

-- SystemSubType table
CREATE TABLE "SystemSubType" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "entry_type" TEXT NOT NULL,
  "anchors" TEXT NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "version" INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX "SystemSubType_ref_id_idx" ON "SystemSubType"("ref_id");
CREATE INDEX "SystemSubType_entry_type_idx" ON "SystemSubType"("entry_type");

-- UserSubType table
CREATE TABLE "UserSubType" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "created_by" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "entry_type" TEXT NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "anchors" TEXT NOT NULL,
  "context" TEXT NOT NULL,
  FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("context") REFERENCES "SystemSubType"("id") ON DELETE RESTRICT
);

CREATE INDEX "UserSubType_ref_id_idx" ON "UserSubType"("ref_id");
CREATE INDEX "UserSubType_entry_type_idx" ON "UserSubType"("entry_type");

-- UserSubTypeMetadata table
CREATE TABLE "UserSubTypeMetadata" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "ref_id" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "published_at" TEXT,
  "download_count" INTEGER NOT NULL DEFAULT 0,
  "fork_count" INTEGER NOT NULL DEFAULT 0,
  "forked_from" TEXT,
  "forked_by" TEXT,
  "deleted_at" TEXT,
  "status" TEXT NOT NULL DEFAULT "draft",
  FOREIGN KEY ("id") REFERENCES "UserSubType"("id") ON DELETE CASCADE
);

-- SystemGlossaryEntry table
CREATE TABLE "SystemGlossaryEntry" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "entry_type" TEXT NOT NULL,
  "sub_type_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "version" INTEGER NOT NULL DEFAULT 1,
  "groups" TEXT,
  "custom_properties" TEXT,
  "primary_anchor_id" TEXT,
  "primary_anchor_value" TEXT,
  "secondary_anchor_id" TEXT,
  "secondary_anchor_value" TEXT,
  "visibility" TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY ("sub_type_id") REFERENCES "SystemSubType"("id") ON DELETE SET NULL
);

CREATE INDEX "SystemGlossaryEntry_entry_type_idx" ON "SystemGlossaryEntry"("entry_type");
CREATE INDEX "SystemGlossaryEntry_sub_type_id_idx" ON "SystemGlossaryEntry"("sub_type_id");
CREATE INDEX "SystemGlossaryEntry_entry_type_sub_type_id_idx" ON "SystemGlossaryEntry"("entry_type", "sub_type_id");

-- UserGlossaryEntry table
CREATE TABLE "UserGlossaryEntry" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "entry_type" TEXT NOT NULL,
  "sub_type_id" TEXT NOT NULL,
  "created_by" TEXT NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "name" TEXT NOT NULL,
  "groups" TEXT,
  "custom_properties" TEXT,
  "primary_anchor_id" TEXT,
  "primary_anchor_value" TEXT,
  "secondary_anchor_id" TEXT,
  "secondary_anchor_value" TEXT,
  "visibility" TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY ("sub_type_id") REFERENCES "SystemSubType"("id") ON DELETE SET NULL,
  FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE CASCADE
);

CREATE INDEX "UserGlossaryEntry_entry_type_idx" ON "UserGlossaryEntry"("entry_type");
CREATE INDEX "UserGlossaryEntry_sub_type_id_idx" ON "UserGlossaryEntry"("sub_type_id");
CREATE INDEX "UserGlossaryEntry_entry_type_sub_type_id_idx" ON "UserGlossaryEntry"("entry_type", "sub_type_id");
CREATE INDEX "UserGlossaryEntry_created_by_idx" ON "UserGlossaryEntry"("created_by");

-- UserGlossaryEntryMetadata table
CREATE TABLE "UserGlossaryEntryMetadata" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "ref_id" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "published_at" TEXT,
  "download_count" INTEGER NOT NULL DEFAULT 0,
  "fork_count" INTEGER NOT NULL DEFAULT 0,
  "forked_from" TEXT,
  "forked_by" TEXT,
  "deleted_at" TEXT,
  "status" TEXT NOT NULL DEFAULT "draft",
  FOREIGN KEY ("id") REFERENCES "UserGlossaryEntry"("id") ON DELETE CASCADE
);

-- SystemSubTypeGroupProperty table
CREATE TABLE "SystemSubTypeGroupProperty" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "group_id" TEXT NOT NULL,
  "property_id" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  FOREIGN KEY ("group_id") REFERENCES "SystemSubTypeGroup"("id") ON DELETE CASCADE,
  FOREIGN KEY ("property_id") REFERENCES "SystemSubTypeProperty"("id") ON DELETE CASCADE,
  UNIQUE("group_id", "property_id")
);

-- UserSubTypeGroupProperty table
CREATE TABLE "UserSubTypeGroupProperty" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "group_id" TEXT NOT NULL,
  "user_property_id" TEXT,
  "system_property_id" TEXT,
  "order" INTEGER NOT NULL,
  FOREIGN KEY ("group_id") REFERENCES "UserSubTypeGroup"("id") ON DELETE CASCADE,
  FOREIGN KEY ("user_property_id") REFERENCES "UserSubTypeProperty"("id") ON DELETE CASCADE,
  FOREIGN KEY ("system_property_id") REFERENCES "SystemSubTypeProperty"("id") ON DELETE CASCADE,
  CHECK (
    (user_property_id IS NOT NULL AND system_property_id IS NULL) OR
    (user_property_id IS NULL AND system_property_id IS NOT NULL)
            ),
  UNIQUE("group_id", "user_property_id", "system_property_id")
);

-- SystemSubTypeSchemaGroup table
CREATE TABLE "SystemSubTypeSchemaGroup" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "subtype_id" TEXT NOT NULL,
  "group_id" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  FOREIGN KEY ("subtype_id") REFERENCES "SystemSubType"("id") ON DELETE CASCADE,
  FOREIGN KEY ("group_id") REFERENCES "SystemSubTypeGroup"("id") ON DELETE CASCADE,
  UNIQUE("subtype_id", "group_id")
);

-- UserSubTypeSchemaGroup table
CREATE TABLE "UserSubTypeSchemaGroup" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "subtype_id" TEXT NOT NULL,
  "group_id" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  FOREIGN KEY ("subtype_id") REFERENCES "UserSubType"("id") ON DELETE CASCADE,
  FOREIGN KEY ("group_id") REFERENCES "UserSubTypeGroup"("id") ON DELETE CASCADE,
  UNIQUE("subtype_id", "group_id")
);

-- BacklinkIndex table
CREATE TABLE "UserBacklinkIndex" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "source_id" TEXT NOT NULL,
  "target_id" TEXT NOT NULL,
  "type" TEXT,
  "property_id" TEXT NOT NULL,
  "property_name" TEXT NOT NULL,
  "property_value" TEXT,
  "ignore_divergence" INTEGER NOT NULL DEFAULT 0,
  "last_synced_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "target_ignore" INTEGER NOT NULL DEFAULT 0,
  "sub_property_id" TEXT,
  "is_system_property" INTEGER NOT NULL DEFAULT 0,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  FOREIGN KEY ("source_id") REFERENCES "UserGlossaryEntry"("id") ON DELETE CASCADE,
  FOREIGN KEY ("target_id") REFERENCES "UserGlossaryEntry"("id") ON DELETE CASCADE,
  UNIQUE("source_id", "target_id", "property_id")
);

CREATE INDEX "UserBacklinkIndex_target_id_idx" ON "UserBacklinkIndex"("target_id");
CREATE INDEX "UserBacklinkIndex_property_id_idx" ON "UserBacklinkIndex"("property_id");

-- System BacklinkIndex table
CREATE TABLE "SystemBacklinkIndex" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "source_id" TEXT NOT NULL,
  "target_id" TEXT NOT NULL,
  "type" TEXT,
  "property_id" TEXT NOT NULL,
  "property_name" TEXT NOT NULL,
  "property_value" TEXT,
  "ignore_divergence" INTEGER NOT NULL DEFAULT 0,
  "last_synced_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "target_ignore" INTEGER NOT NULL DEFAULT 0,
  "sub_property_id" TEXT,
  "is_system_property" INTEGER NOT NULL DEFAULT 1,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  FOREIGN KEY ("source_id") REFERENCES "SystemGlossaryEntry"("id") ON DELETE CASCADE,
  FOREIGN KEY ("target_id") REFERENCES "SystemGlossaryEntry"("id") ON DELETE CASCADE,
  UNIQUE("source_id", "target_id", "property_id")
);

CREATE INDEX "SystemBacklinkIndex_target_id_idx" ON "SystemBacklinkIndex"("target_id");
CREATE INDEX "SystemBacklinkIndex_property_id_idx" ON "SystemBacklinkIndex"("property_id");

-- FTS5 virtual table for glossary entries
CREATE VIRTUAL TABLE "UserGlossaryEntryFTS" USING fts5(
  id UNINDEXED,
  name,
  groups,
  entry_type UNINDEXED,
  tokenize = 'porter unicode61'
);

-- Triggers to keep FTS in sync
CREATE TRIGGER "UserGlossaryEntry_ai" AFTER INSERT ON "UserGlossaryEntry" BEGIN
  INSERT INTO "UserGlossaryEntryFTS"(id, name, groups, entry_type)
  VALUES (new.id, new.name, new.groups, new.entry_type);
END;

CREATE TRIGGER "UserGlossaryEntry_au" AFTER UPDATE ON "UserGlossaryEntry" BEGIN
  UPDATE "UserGlossaryEntryFTS"
  SET name = new.name, groups = new.groups, entry_type = new.entry_type
  WHERE id = new.id;
END;

CREATE TRIGGER "UserGlossaryEntry_ad" AFTER DELETE ON "UserGlossaryEntry" BEGIN
  DELETE FROM "UserGlossaryEntryFTS" WHERE id = old.id;
END;

-- Optional: Populate existing data
INSERT INTO "UserGlossaryEntryFTS"(id, name, groups, entry_type)
SELECT id, name, groups, entry_type FROM "UserGlossaryEntry";
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
DROP TABLE IF EXISTS "GlossaryMetaData";
DROP TABLE IF EXISTS "UserGlossary";
DROP TABLE IF EXISTS "SystemGlossary";
DROP TABLE IF EXISTS "UserSettings";
DROP TABLE IF EXISTS "Devices";
DROP TABLE IF EXISTS "UserTiers";
DROP TABLE IF EXISTS "Users";
DROP TABLE IF EXISTS "UserBacklinkIndex";
DROP TABLE IF EXISTS "SystemBacklinkIndex";
DROP TABLE IF EXISTS "UserSubTypeSchemaGroup";
DROP TABLE IF EXISTS "SystemSubTypeSchemaGroup";
DROP TABLE IF EXISTS "UserSubTypeGroupProperty";
DROP TABLE IF EXISTS "UserGlossaryEntry";
DROP TABLE IF EXISTS "UserSubType";
DROP TABLE IF EXISTS "UserSubTypeGroup";
DROP TABLE IF EXISTS "UserSubTypeProperty";
DROP TABLE IF EXISTS "UserGlossaryNode";
DROP TABLE IF EXISTS "SystemGlossaryNode";
DROP TABLE IF EXISTS "SystemSubType";
DROP TABLE IF EXISTS "SystemSubTypeGroup";
DROP TABLE IF EXISTS "SystemSubTypeProperty";
DROP TABLE IF EXISTS "SystemGlossaryEntry";
DROP TABLE IF EXISTS "EntrySubType";
"#,
            )
            .await?;

        Ok(())
    }
}

use crate::entities::{
    system_sub_type, system_sub_type_group, system_sub_type_group_property,
    system_sub_type_property, system_sub_type_schema_group,
};
use sea_orm::{ActiveModelTrait, DatabaseConnection, EntityTrait, Set};
use serde::{Deserialize, Serialize};
use tracing::info;

#[cfg(debug_assertions)]
#[tauri::command]
pub async fn admin_export_sys_content(
    db: tauri::State<'_, DatabaseConnection>,
    app_handle: tauri::AppHandle,
) -> Result<String, String> {
    use serde_json;
    use std::fs;

    // Export system subtypes
    let system_subtypes = system_sub_type::Entity::find()
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    // Export system properties
    let system_properties = system_sub_type_property::Entity::find()
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    // Export system groups
    let system_groups = system_sub_type_group::Entity::find()
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    let system_group_properties = system_sub_type_group_property::Entity::find()
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    let system_schema_groups = system_sub_type_schema_group::Entity::find()
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    // ... export all system tables

    let export = SystemContentExport {
        subtypes: system_subtypes,
        properties: system_properties,
        groups: system_groups,
        group_properties: system_group_properties,
        schema_groups: system_schema_groups,
    };

    // Save to src-tauri/seed_data/
    let export_path = std::env::current_dir()
        .map_err(|e| e.to_string())?
        .join("seed_data")
        .join("system_content.json");

    fs::create_dir_all(export_path.parent().unwrap()).map_err(|e| e.to_string())?;

    let json = serde_json::to_string_pretty(&export).map_err(|e| e.to_string())?;

    fs::write(&export_path, json).map_err(|e| e.to_string())?;

    Ok(format!("Exported to: {:?}", export_path))
}

#[derive(Serialize, Deserialize)]
struct SystemContentExport {
    subtypes: Vec<system_sub_type::Model>,
    properties: Vec<system_sub_type_property::Model>,
    groups: Vec<system_sub_type_group::Model>,
    group_properties: Vec<system_sub_type_group_property::Model>,
    schema_groups: Vec<system_sub_type_schema_group::Model>,
}

pub async fn seed_system_content(
    db: &DatabaseConnection,
) -> Result<(), Box<dyn std::error::Error>> {
    use std::fs;

    // Load JSON from embedded resource or file
    let seed_data = include_str!("../../../seed_data/system_content.json");

    let export: SystemContentExport = serde_json::from_str(seed_data)?;

    // Insert system subtypes
    for subtype in export.subtypes {
        let active_model = system_sub_type::ActiveModel {
            id: Set(subtype.id),
            name: Set(subtype.name),
            entry_type: Set(subtype.entry_type),
            // ... all fields
            ..Default::default()
        };

        active_model.insert(db).await.map_err(|e| e.to_string())?;
    }

    // Insert properties, groups, etc.
    // ...

    info!("System content seeded successfully");
    Ok(())
}

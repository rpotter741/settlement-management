// Create a new glossary entry in the database

use crate::types::SystemSubTypeGroup;
use crate::{entities::system_sub_type_group, types::GroupId};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set};

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateSubTypeGroupInput {
    pub id: GroupId,
    pub name: String,
}

#[cfg(debug_assertions)]
#[tauri::command]
pub async fn sys_create_sub_type_group(
    db: tauri::State<'_, DatabaseConnection>,
    input: CreateSubTypeGroupInput,
) -> Result<SystemSubTypeGroup, String> {
    let new_sub_type_group = system_sub_type_group::ActiveModel {
        id: Set(input.id.0),
        name: Set(input.name),
        description: Set(Some(String::new())),
        display: Set(Some("{}".to_string())),
        ..Default::default()
    };

    let created = new_sub_type_group
        .insert(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(SystemSubTypeGroup::try_from(created)?)
}

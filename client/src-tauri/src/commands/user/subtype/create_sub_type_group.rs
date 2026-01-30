// Create a new glossary entry in the database

use crate::types::UserSubTypeGroup;
use crate::{entities::user_sub_type_group, types::GroupId};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set};

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateSubTypeGroupInput {
    pub id: GroupId,
    pub name: String,
    pub created_by: String,
}

#[tauri::command]
pub async fn create_sub_type_group(
    db: tauri::State<'_, DatabaseConnection>,
    input: CreateSubTypeGroupInput,
) -> Result<UserSubTypeGroup, String> {
    let new_sub_type_group = user_sub_type_group::ActiveModel {
        id: Set(input.id.0),
        name: Set(input.name),
        created_by: Set(input.created_by),
        description: Set(Some(String::new())),
        display: Set(Some("{}".to_string())),
        ..Default::default()
    };

    let created = new_sub_type_group
        .insert(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(UserSubTypeGroup::try_from(created)?)
}

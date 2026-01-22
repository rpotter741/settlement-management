// Create a new glossary entry in the database

use crate::{entities::sub_type_group, types::GroupId};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set};

#[derive(serde::Deserialize)]
pub struct CreateSubTypeGroupInput {
    pub id: GroupId,
    pub name: String,
    pub created_by: String,
    pub content_type: String,
}

#[tauri::command]
pub async fn create_sub_type_group(
    db: tauri::State<'_, DatabaseConnection>,
    input: CreateSubTypeGroupInput,
) -> Result<sub_type_group::Model, String> {
    let new_sub_type_group = sub_type_group::ActiveModel {
        id: Set(input.id.0),
        name: Set(input.name),
        created_by: Set(input.created_by),
        content_type: Set(input.content_type),
        ..Default::default()
    };

    new_sub_type_group
        .insert(db.inner())
        .await
        .map_err(|e| e.to_string())
}

// Create a new glossary entry in the database

use crate::{entities::entry_sub_type, types::SubTypeId};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set};

#[derive(serde::Deserialize)]
pub struct CreateEntrySubTypeInput {
    pub id: SubTypeId,
    pub name: String,
    pub created_by: String,
    pub content_type: String,
}

#[tauri::command]
pub async fn create_sub_type(
    db: tauri::State<'_, DatabaseConnection>,
    input: CreateEntrySubTypeInput,
) -> Result<entry_sub_type::Model, String> {
    let new_sub_type_group = entry_sub_type::ActiveModel {
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

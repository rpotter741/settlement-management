// Create a new glossary entry in the database

use crate::{
    entities::sub_type_property,
    types::{InputTypeEnum, PropertyId, PropertyShape},
};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set};

#[derive(serde::Deserialize)]
pub struct CreateSubTypePropertyInput {
    pub id: PropertyId,
    pub name: String,
    pub content_type: String,
    pub created_by: String,
    pub input_type: InputTypeEnum,
    pub shape: PropertyShape,
}

#[tauri::command]
pub async fn create_sub_type_property(
    db: tauri::State<'_, DatabaseConnection>,
    input: CreateSubTypePropertyInput,
) -> Result<sub_type_property::Model, String> {
    let new_sub_type_property = sub_type_property::ActiveModel {
        id: Set(input.id.0),
        name: Set(input.name),
        created_by: Set(input.created_by),
        content_type: Set(input.content_type),
        input_type: Set(serde_json::to_string(&input.input_type).map_err(|e| e.to_string())?),
        shape: Set(serde_json::to_string(&input.shape).map_err(|e| e.to_string())?),
        ..Default::default()
    };

    new_sub_type_property
        .insert(db.inner())
        .await
        .map_err(|e| e.to_string())
}

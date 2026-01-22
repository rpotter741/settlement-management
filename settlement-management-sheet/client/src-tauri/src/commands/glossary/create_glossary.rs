// Create a new glossary entry in the database

use crate::{
    entities::glossary,
    types::{Glossary, GlossaryId},
};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set};

#[derive(serde::Deserialize)]
pub struct CreateGlossaryInput {
    pub id: GlossaryId,
    pub name: String,
    pub genre: String,
    pub sub_genre: String,
    pub description: String,
    pub created_by: String,
    pub content_type: String,
}

#[tauri::command]
pub async fn create_glossary(
    db: tauri::State<'_, DatabaseConnection>,
    input: CreateGlossaryInput,
) -> Result<Glossary, String> {
    let new_glossary = glossary::ActiveModel {
        id: Set(input.id.0),
        name: Set(input.name),
        genre: Set(input.genre),
        sub_genre: Set(input.sub_genre),
        description: Set(input.description),
        created_by: Set(input.created_by),
        content_type: Set(input.content_type),
        ..Default::default()
    };

    let new_glossary = new_glossary
        .insert(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(Glossary::try_from(new_glossary)?)
}

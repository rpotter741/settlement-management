// Create a new glossary entry in the database

use std::collections::HashMap;

use crate::{
    entities::user_glossary,
    types::{GlossaryEntrySettings, GlossaryEntryType, GlossaryId, GlossaryThemes, UserGlossary},
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
}

#[tauri::command]
pub async fn create_glossary(
    db: tauri::State<'_, DatabaseConnection>,
    input: CreateGlossaryInput,
) -> Result<UserGlossary, String> {
    let new_glossary = user_glossary::ActiveModel {
        id: Set(input.id.0),
        name: Set(input.name),
        genre: Set(input.genre),
        sub_genre: Set(input.sub_genre),
        description: Set(Some(input.description)),
        created_by: Set(input.created_by),
        visibility: Set(serde_json::to_string(
            &HashMap::<GlossaryEntryType, GlossaryEntrySettings>::new(),
        )
        .map_err(|e| e.to_string())?),
        theme: Set(Some(
            serde_json::to_string(&GlossaryThemes::default()).map_err(|e| e.to_string())?,
        )),
        integration_state: Set(Some(
            serde_json::to_string(&HashMap::<GlossaryEntryType, GlossaryEntrySettings>::new())
                .map_err(|e| e.to_string())?,
        )),
        ..Default::default()
    };

    let new_glossary = new_glossary
        .insert(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(UserGlossary::try_from(new_glossary)?)
}

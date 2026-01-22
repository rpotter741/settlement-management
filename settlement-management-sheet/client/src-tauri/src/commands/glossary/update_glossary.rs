// Create a new glossary entry in the database

use std::collections::HashMap;

use crate::entities::glossary;
use crate::types::{
    bool_to_sqlite, GlossaryEntrySettings, GlossaryEntryType, GlossaryId, GlossaryThemes,
};
use crate::{set_if_some, some_set_if_some, some_set_json_if_some};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[derive(serde::Deserialize)]
pub struct UpdateGlossaryInput {
    pub id: GlossaryId,
    pub name: Option<String>,
    pub genre: Option<String>,
    pub sub_genre: Option<String>,
    pub description: Option<String>,
    pub ref_id: Option<String>,
    pub version: Option<i32>,
    pub is_immutable: Option<bool>,
    pub visibility: Option<HashMap<GlossaryEntryType, GlossaryEntrySettings>>,
    pub collaborators: Option<Vec<String>>,
    pub forked_by: Option<Vec<String>>,
    pub editors: Option<Vec<String>>,
    pub theme: Option<GlossaryThemes>,
    pub integration_state: Option<String>,
}

#[tauri::command]
pub async fn update_glossary(
    db: tauri::State<'_, DatabaseConnection>,
    input: UpdateGlossaryInput,
) -> Result<glossary::Model, String> {
    use sea_orm::{ActiveModelTrait, Set};

    let existing = glossary::Entity::find()
        .filter(glossary::Column::Id.eq(input.id.0.clone()))
        .one(db.inner())
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "Glossary entry not found".to_string())?;

    let existing_clone = existing.clone();
    let mut active: glossary::ActiveModel = existing.into();
    set_if_some!(active, name, input.name);
    set_if_some!(active, genre, input.genre);
    set_if_some!(active, sub_genre, input.sub_genre);
    set_if_some!(active, description, input.description);
    set_if_some!(active, ref_id, input.ref_id);
    set_if_some!(active, version, input.version);
    active.is_immutable = if let Some(is_immutable) = &input.is_immutable {
        Set(bool_to_sqlite(*is_immutable))
    } else {
        Set(existing_clone.is_immutable)
    };
    active.visibility = if let Some(visibility) = &input.visibility {
        Set(serde_json::to_string(visibility).map_err(|e| e.to_string())?)
    } else {
        Set(existing_clone.visibility.clone())
    };
    some_set_json_if_some!(active, collaborators, input.collaborators);
    some_set_json_if_some!(active, forked_by, input.forked_by);
    some_set_json_if_some!(active, editors, input.editors);
    active.theme = if let Some(theme) = &input.theme {
        Set(Some(
            serde_json::to_string(theme).map_err(|e| e.to_string())?,
        ))
    } else {
        Set(existing_clone.theme)
    };
    some_set_if_some!(active, integration_state, input.integration_state);
    active.updated_at = Set(chrono::Utc::now()
        .naive_utc()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string());

    let updated = active.update(db.inner()).await.map_err(|e| e.to_string())?;

    Ok(updated)
}

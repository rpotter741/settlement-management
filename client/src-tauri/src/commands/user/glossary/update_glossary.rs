// Create a new glossary entry in the database

use std::collections::HashMap;

use crate::entities::user_glossary;
use crate::types::{
    GlossaryEntrySettings, GlossaryEntryType, GlossaryId, GlossaryThemes, UserGlossary,
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
    pub visibility: Option<String>,
    pub theme: Option<GlossaryThemes>,
    pub integration_state: Option<HashMap<GlossaryEntryType, GlossaryEntrySettings>>,
}

#[tauri::command]
pub async fn update_glossary(
    db: tauri::State<'_, DatabaseConnection>,
    input: UpdateGlossaryInput,
) -> Result<UserGlossary, String> {
    use sea_orm::{ActiveModelTrait, Set};

    let existing = user_glossary::Entity::find()
        .filter(user_glossary::Column::Id.eq(input.id.0.clone()))
        .one(db.inner())
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "Glossary entry not found".to_string())?;

    let existing_clone = existing.clone();
    let mut active: user_glossary::ActiveModel = existing.into();
    set_if_some!(active, name, input.name);
    set_if_some!(active, genre, input.genre);
    set_if_some!(active, sub_genre, input.sub_genre);
    some_set_if_some!(active, description, input.description);
    active.visibility = if let Some(visibility) = &input.visibility {
        Set(serde_json::to_string(visibility).map_err(|e| e.to_string())?)
    } else {
        Set(existing_clone.visibility.clone())
    };
    active.theme = if let Some(theme) = &input.theme {
        Set(Some(
            serde_json::to_string(theme).map_err(|e| e.to_string())?,
        ))
    } else {
        Set(existing_clone.theme)
    };
    some_set_json_if_some!(active, integration_state, input.integration_state);
    active.updated_at = Set(chrono::Utc::now()
        .naive_utc()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string());

    let updated = active.update(db.inner()).await.map_err(|e| e.to_string())?;

    Ok(UserGlossary::try_from(updated)?)
}

use crate::{entities::user_glossary_entry, types::UserGlossaryEntry};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[tauri::command]
pub async fn get_entries_by_id(
    db: tauri::State<'_, DatabaseConnection>,
    ids: Vec<String>,
) -> Result<Vec<UserGlossaryEntry>, String> {
    let query = user_glossary_entry::Entity::find()
        .filter(user_glossary_entry::Column::Id.is_in(ids))
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    let result = query
        .into_iter()
        .map(UserGlossaryEntry::try_from)
        .collect::<Result<Vec<UserGlossaryEntry>, String>>()?;

    Ok(result)
}

use crate::{entities::glossary_entry, types::GlossaryEntry};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[tauri::command]
pub async fn get_entries_by_id(
    db: tauri::State<'_, DatabaseConnection>,
    ids: Vec<String>,
) -> Result<Vec<GlossaryEntry>, String> {
    let query = glossary_entry::Entity::find()
        .filter(glossary_entry::Column::Id.is_in(ids))
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    let result = query
        .into_iter()
        .map(GlossaryEntry::try_from)
        .collect::<Result<Vec<GlossaryEntry>, String>>()?;

    Ok(result)
}

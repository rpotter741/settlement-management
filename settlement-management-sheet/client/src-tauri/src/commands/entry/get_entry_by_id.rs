use crate::{
    entities::glossary_entry,
    types::{GlossaryEntry, NodeEntryId},
};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[tauri::command]
pub async fn get_entry_by_id(
    db: tauri::State<'_, DatabaseConnection>,
    id: NodeEntryId,
) -> Result<GlossaryEntry, String> {
    let query = glossary_entry::Entity::find()
        .filter(glossary_entry::Column::Id.eq(id.0))
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    let entry = query
        .into_iter()
        .map(GlossaryEntry::try_from)
        .collect::<Result<Vec<GlossaryEntry>, String>>()?;
    Ok(entry
        .into_iter()
        .next()
        .ok_or_else(|| "Entry not found".to_string())?)
}

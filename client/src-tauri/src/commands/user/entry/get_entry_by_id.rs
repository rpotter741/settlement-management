use crate::{
    entities::user_glossary_entry,
    types::{NodeEntryId, UserGlossaryEntry},
};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[tauri::command]
pub async fn get_entry_by_id(
    db: tauri::State<'_, DatabaseConnection>,
    id: NodeEntryId,
) -> Result<UserGlossaryEntry, String> {
    let query = user_glossary_entry::Entity::find()
        .filter(user_glossary_entry::Column::Id.eq(id.0))
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    let entry = query
        .into_iter()
        .map(UserGlossaryEntry::try_from)
        .collect::<Result<Vec<UserGlossaryEntry>, String>>()?;
    Ok(entry
        .into_iter()
        .next()
        .ok_or_else(|| "Entry not found".to_string())?)
}

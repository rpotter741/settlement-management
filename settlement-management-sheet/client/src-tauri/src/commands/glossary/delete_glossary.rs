// Create a new glossary entry in the database

use crate::{entities::glossary, types::GlossaryId};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[tauri::command]
pub async fn delete_glossary(
    db: tauri::State<'_, DatabaseConnection>,
    id: GlossaryId,
) -> Result<u64, String> {
    let result = glossary::Entity::delete_many()
        .filter(glossary::Column::Id.eq(id.0))
        .exec(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(result.rows_affected)
}

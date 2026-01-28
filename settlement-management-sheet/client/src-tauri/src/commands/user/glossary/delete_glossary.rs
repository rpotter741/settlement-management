// Create a new glossary entry in the database

use crate::{entities::user_glossary, types::GlossaryId};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[tauri::command]
pub async fn delete_glossary(
    db: tauri::State<'_, DatabaseConnection>,
    id: GlossaryId,
) -> Result<u64, String> {
    let result = user_glossary::Entity::delete_many()
        .filter(user_glossary::Column::Id.eq(id.0))
        .exec(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(result.rows_affected)
}

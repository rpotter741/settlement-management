// Create a new glossary entry in the database

use crate::{entities::entry_sub_type, types::SubTypeId};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[tauri::command]
pub async fn delete_sub_type(
    db: tauri::State<'_, DatabaseConnection>,
    id: SubTypeId,
) -> Result<u64, String> {
    let result = entry_sub_type::Entity::delete_many()
        .filter(entry_sub_type::Column::Id.eq(id.0))
        .exec(db.inner())
        .await
        .map_err(|e| e.to_string())?;
    Ok(result.rows_affected)
}

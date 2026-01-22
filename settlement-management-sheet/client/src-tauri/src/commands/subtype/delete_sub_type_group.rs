// Create a new glossary entry in the database

use sea_orm::{DatabaseConnection, ColumnTrait, EntityTrait, QueryFilter};
use crate::entities::{sub_type_group};

#[tauri::command]
pub async fn delete_sub_type_group(
  db: tauri::State<'_, DatabaseConnection>,
  id: String,
) -> Result<u64, String> {
  let result = sub_type_group::Entity::delete_many()
    .filter(sub_type_group::Column::Id.eq(id))
    .exec(db.inner())
    .await
    .map_err(|e| e.to_string())?;
  Ok(result.rows_affected)
}
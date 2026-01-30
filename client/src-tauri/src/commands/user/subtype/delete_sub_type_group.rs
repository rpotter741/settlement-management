use crate::entities::user_sub_type_group;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[tauri::command]
pub async fn delete_sub_type_group(
    db: tauri::State<'_, DatabaseConnection>,
    id: String,
) -> Result<u64, String> {
    let result = user_sub_type_group::Entity::delete_many()
        .filter(user_sub_type_group::Column::Id.eq(id))
        .exec(db.inner())
        .await
        .map_err(|e| e.to_string())?;
    Ok(result.rows_affected)
}

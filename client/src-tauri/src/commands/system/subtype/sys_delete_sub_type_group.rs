use crate::entities::system_sub_type_group;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[cfg(debug_assertions)]
#[tauri::command]
pub async fn sys_delete_sub_type_group(
    db: tauri::State<'_, DatabaseConnection>,
    id: String,
) -> Result<u64, String> {
    let result = system_sub_type_group::Entity::delete_many()
        .filter(system_sub_type_group::Column::Id.eq(id))
        .exec(db.inner())
        .await
        .map_err(|e| e.to_string())?;
    Ok(result.rows_affected)
}

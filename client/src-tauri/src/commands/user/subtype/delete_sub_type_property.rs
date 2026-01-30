use crate::{entities::user_sub_type_property, types::PropertyId};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[tauri::command]
pub async fn delete_sub_type_property(
    db: tauri::State<'_, DatabaseConnection>,
    id: PropertyId,
) -> Result<u64, String> {
    let result = user_sub_type_property::Entity::delete_many()
        .filter(user_sub_type_property::Column::Id.eq(id.0))
        .exec(db.inner())
        .await
        .map_err(|e| e.to_string())?;
    Ok(result.rows_affected)
}

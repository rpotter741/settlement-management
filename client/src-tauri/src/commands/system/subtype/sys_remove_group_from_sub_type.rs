use crate::entities::system_sub_type_schema_group;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, TransactionTrait};

#[cfg(debug_assertions)]
#[tauri::command]
pub async fn sys_remove_group_from_sub_type(
    db: tauri::State<'_, DatabaseConnection>,
    link_ids: Vec<String>,
) -> Result<(), String> {
    let txn = db.begin().await.map_err(|e| e.to_string())?;

    system_sub_type_schema_group::Entity::delete_many()
        .filter(system_sub_type_schema_group::Column::Id.is_in(link_ids))
        .exec(&txn)
        .await
        .map_err(|e| e.to_string())?;

    txn.commit().await.map_err(|e| e.to_string())?;
    Ok(())
}

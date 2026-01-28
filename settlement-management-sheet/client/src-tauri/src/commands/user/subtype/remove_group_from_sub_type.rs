// Create a new glossary entry in the database

use crate::entities::user_sub_type_schema_group;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, TransactionTrait};

#[tauri::command]
pub async fn remove_group_from_sub_type(
    db: tauri::State<'_, DatabaseConnection>,
    link_ids: Vec<String>,
) -> Result<(), String> {
    let txn = db.begin().await.map_err(|e| e.to_string())?;

    user_sub_type_schema_group::Entity::delete_many()
        .filter(user_sub_type_schema_group::Column::Id.is_in(link_ids))
        .exec(&txn)
        .await
        .map_err(|e| e.to_string())?;

    txn.commit().await.map_err(|e| e.to_string())?;
    Ok(())
}

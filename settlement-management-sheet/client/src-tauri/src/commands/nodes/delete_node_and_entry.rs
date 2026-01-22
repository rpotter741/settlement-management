// Create a new glossary entry in the database

use crate::entities::{glossary_entry, glossary_node};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, TransactionTrait};

#[tauri::command]
pub async fn delete_node_and_entry(
    db: tauri::State<'_, DatabaseConnection>,
    ids: Vec<String>,
) -> Result<u64, String> {
    let txn = db.begin().await.map_err(|e| e.to_string())?;

    let node_result = glossary_node::Entity::delete_many()
        .filter(glossary_node::Column::Id.is_in(ids.clone()))
        .exec(&txn)
        .await
        .map_err(|e| e.to_string())?;

    let entry_result = glossary_entry::Entity::delete_many()
        .filter(glossary_entry::Column::Id.is_in(ids.clone()))
        .exec(&txn)
        .await
        .map_err(|e| e.to_string())?;

    txn.commit().await.map_err(|e| e.to_string())?;

    Ok(node_result.rows_affected + entry_result.rows_affected)
}

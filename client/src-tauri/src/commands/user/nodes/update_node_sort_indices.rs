use crate::{entities::user_glossary_node, types::NodeEntryId};
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set,
    TransactionTrait,
};

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SortUpdate {
    id: NodeEntryId,
    sort_index: i32,
}

#[tauri::command]
pub async fn update_node_sort_indices(
    db: tauri::State<'_, DatabaseConnection>,
    updates: Vec<SortUpdate>,
) -> Result<(), String> {
    let txn = db.begin().await.map_err(|e| e.to_string())?;

    for update in updates {
        let existing_node = user_glossary_node::Entity::find()
            .filter(user_glossary_node::Column::Id.eq(update.id.0))
            .one(&txn)
            .await
            .map_err(|e| e.to_string())?
            .ok_or_else(|| "Glossary node not found".to_string())?;

        let mut active_node: user_glossary_node::ActiveModel = existing_node.into();
        active_node.sort_index = Set(update.sort_index);

        active_node.update(&txn).await.map_err(|e| e.to_string())?;
    }

    txn.commit().await.map_err(|e| e.to_string())?;

    Ok(())
}

use crate::{entities::user_glossary_node, types::NodeEntryId};
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set,
    TransactionTrait,
};

#[tauri::command]
pub async fn update_node_parent_id(
    db: tauri::State<'_, DatabaseConnection>,
    ids: Vec<NodeEntryId>,
    parent_id: Option<NodeEntryId>,
) -> Result<(), String> {
    let txn = db.begin().await.map_err(|e| e.to_string())?;

    for id in ids {
        let existing_node = user_glossary_node::Entity::find()
            .filter(user_glossary_node::Column::Id.eq(id.0))
            .one(&txn)
            .await
            .map_err(|e| e.to_string())?
            .ok_or_else(|| "Glossary node not found".to_string())?;

        let mut active_node: user_glossary_node::ActiveModel = existing_node.into();
        active_node.parent_id = if let Some(parent_id) = parent_id.clone() {
            Set(Some(parent_id.0))
        } else {
            Set(None)
        };

        active_node.update(&txn).await.map_err(|e| e.to_string())?;
    }

    txn.commit().await.map_err(|e| e.to_string())?;

    Ok(())
}

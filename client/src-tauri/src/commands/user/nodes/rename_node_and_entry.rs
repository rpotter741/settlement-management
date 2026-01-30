use crate::{
    entities::{user_glossary_entry, user_glossary_node},
    types::{UserGlossaryEntry, UserGlossaryNode},
    utility::get_now,
};
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set,
    TransactionTrait,
};

#[derive(serde::Serialize)]
pub struct RenameNodeAndEntryOutput {
    glossary_node: UserGlossaryNode,
    glossary_entry: UserGlossaryEntry,
}

#[tauri::command]
pub async fn rename_node_and_entry(
    db: tauri::State<'_, DatabaseConnection>,
    id: String,
    name: String,
) -> Result<RenameNodeAndEntryOutput, String> {
    let txn = db.begin().await.map_err(|e| e.to_string())?;

    // query existing node
    let existing_node = user_glossary_node::Entity::find()
        .filter(user_glossary_node::Column::Id.eq(&id))
        .one(&txn)
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "Glossary node not found".to_string())?;

    // update node name
    let mut active_node: user_glossary_node::ActiveModel = existing_node.into();
    active_node.name = Set(name.clone());

    let updated_node = active_node.update(&txn).await.map_err(|e| e.to_string())?;

    // query existing entry
    let existing_entry = user_glossary_entry::Entity::find()
        .filter(user_glossary_entry::Column::Id.eq(&id))
        .one(&txn)
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "Glossary entry not found".to_string())?;

    // update entry name
    let mut active_entry: user_glossary_entry::ActiveModel = existing_entry.into();
    active_entry.name = Set(name);
    active_entry.updated_at = Set(get_now());

    let updated_entry = active_entry.update(&txn).await.map_err(|e| e.to_string())?;

    // commit transaction
    txn.commit().await.map_err(|e| e.to_string())?;

    // convert updated node and entry to output types
    let node = UserGlossaryNode::try_from(updated_node).map_err(|e| e.to_string())?;
    let entry = UserGlossaryEntry::try_from(updated_entry).map_err(|e| e.to_string())?;

    Ok(RenameNodeAndEntryOutput {
        glossary_node: node,
        glossary_entry: entry,
    })
}

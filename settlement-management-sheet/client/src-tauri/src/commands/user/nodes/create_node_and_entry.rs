// Create a new glossary entry in the database
use crate::{
    entities::{user_glossary_entry, user_glossary_node},
    types::{UserGlossaryEntry, UserGlossaryNode},
};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set, TransactionTrait};

#[derive(serde::Deserialize)]
pub struct CreateNodeAndEntryInput {
    pub id: String,
    pub name: String,
    pub entry_type: String,
    pub file_type: String,
    pub sub_type_id: String,
    pub glossary_id: String,
    pub sort_index: i32,
    pub icon: Option<String>,
    pub integration_state: Option<String>,
    pub parent_id: Option<String>,
    pub created_by: String,
}

#[derive(serde::Serialize)]
pub struct CreateNodeAndEntryOutput {
    glossary_node: UserGlossaryNode,
    glossary_entry: UserGlossaryEntry,
}

#[tauri::command]
pub async fn create_node_and_entry(
    db: tauri::State<'_, DatabaseConnection>,
    input: CreateNodeAndEntryInput,
) -> Result<CreateNodeAndEntryOutput, String> {
    let txn = db.begin().await.map_err(|e| e.to_string())?;

    let new_node = user_glossary_node::ActiveModel {
        id: Set(input.id.clone()),
        name: Set(input.name.clone()),
        entry_type: Set(input.entry_type.clone()),
        sub_type_id: Set(input.sub_type_id.clone()),
        glossary_id: Set(input.glossary_id.clone()),
        sort_index: Set(input.sort_index),
        icon: Set(input.icon),
        integration_state: Set(input.integration_state),
        parent_id: Set(input.parent_id),
        ..Default::default()
    };

    let inserted_node = new_node.insert(&txn).await.map_err(|e| e.to_string())?;

    // Create a new glossary entry associated with the node
    let new_entry = user_glossary_entry::ActiveModel {
        id: Set(input.id),
        created_by: Set(input.created_by),
        entry_type: Set(input.entry_type),
        sub_type_id: Set(input.sub_type_id),
        name: Set(input.name),
        ..Default::default()
    };

    let inserted_entry = new_entry.insert(&txn).await.map_err(|e| e.to_string())?;

    txn.commit().await.map_err(|e| e.to_string())?;

    let node = UserGlossaryNode::try_from(inserted_node)?;
    let entry = UserGlossaryEntry::try_from(inserted_entry)?;

    Ok(CreateNodeAndEntryOutput {
        glossary_node: node,
        glossary_entry: entry,
    })
}

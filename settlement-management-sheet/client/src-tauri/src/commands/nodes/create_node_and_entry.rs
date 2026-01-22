// Create a new glossary entry in the database
use crate::entities::{glossary_entry, glossary_node};
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
    pub content_type: String,
}

#[derive(serde::Serialize)]
pub struct CreateNodeAndEntryOutput {
    glossary_node: glossary_node::Model,
    glossary_entry: glossary_entry::Model,
}

#[tauri::command]
pub async fn create_node_and_entry(
    db: tauri::State<'_, DatabaseConnection>,
    input: CreateNodeAndEntryInput,
) -> Result<CreateNodeAndEntryOutput, String> {
    let txn = db.begin().await.map_err(|e| e.to_string())?;

    let new_node = glossary_node::ActiveModel {
        id: Set(input.id.clone()),
        name: Set(input.name.clone()),
        entry_type: Set(input.entry_type.clone()),
        file_type: Set(input.file_type.clone()),
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
    let new_entry = glossary_entry::ActiveModel {
        id: Set(input.id),
        content_type: Set(input.content_type),
        created_by: Set(input.created_by),
        format: Set(input.file_type),
        entry_type: Set(input.entry_type),
        sub_type_id: Set(input.sub_type_id),
        name: Set(input.name),
        ..Default::default()
    };

    let inserted_entry = new_entry.insert(&txn).await.map_err(|e| e.to_string())?;

    txn.commit().await.map_err(|e| e.to_string())?;

    Ok(CreateNodeAndEntryOutput {
        glossary_node: inserted_node,
        glossary_entry: inserted_entry,
    })
}

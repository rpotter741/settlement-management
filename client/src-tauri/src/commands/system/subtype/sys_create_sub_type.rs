// Create a new glossary entry in the database

use crate::{
    entities::system_sub_type,
    types::{GlossaryEntryType, SubTypeId, SystemSubType},
};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set};

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateEntrySubTypeInput {
    pub id: SubTypeId,
    pub name: String,
    pub entry_type: GlossaryEntryType,
}

#[cfg(debug_assertions)]
#[tauri::command]
pub async fn sys_create_sub_type(
    db: tauri::State<'_, DatabaseConnection>,
    input: CreateEntrySubTypeInput,
) -> Result<SystemSubType, String> {
    let new_sub_type_group = system_sub_type::ActiveModel {
        id: Set(input.id.0),
        name: Set(input.name),
        entry_type: Set(serde_json::to_string(&input.entry_type).map_err(|e| e.to_string())?),
        ..Default::default()
    };

    let model = new_sub_type_group
        .insert(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(SystemSubType::try_from(model)?)
}

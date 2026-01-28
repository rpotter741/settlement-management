// Create a new glossary entry in the database

use crate::{
    entities::user_sub_type,
    types::{GlossaryEntryType, SubTypeId, UserSubType},
};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set};

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateEntrySubTypeInput {
    pub id: SubTypeId,
    pub name: String,
    pub created_by: String,
    pub entry_type: GlossaryEntryType,
}

#[tauri::command]
pub async fn create_sub_type(
    db: tauri::State<'_, DatabaseConnection>,
    input: CreateEntrySubTypeInput,
) -> Result<UserSubType, String> {
    let new_sub_type_group = user_sub_type::ActiveModel {
        id: Set(input.id.0),
        name: Set(input.name),
        created_by: Set(input.created_by),
        entry_type: Set(serde_json::to_string(&input.entry_type).map_err(|e| e.to_string())?),
        ..Default::default()
    };

    let model = new_sub_type_group
        .insert(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(UserSubType::try_from(model)?)
}

use crate::{
    entities::{system_sub_type, user_sub_type},
    types::{SystemSubType, UserSubType},
};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetSubTypesInput {
    user_id: String,
    system: Option<bool>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetSubTypeReturn {
    pub user: Vec<UserSubType>,
    pub system: Vec<SystemSubType>,
}

#[tauri::command]
pub async fn get_sub_types(
    db: tauri::State<'_, DatabaseConnection>,
    input: GetSubTypesInput,
) -> Result<GetSubTypeReturn, String> {
    let system_input = input.system.unwrap_or(false);
    let mut system_sub_types = Vec::new();

    if system_input {
        // Pass the inner connection reference, not the State
        system_sub_types = get_system_sub_types(db.inner()).await?;
    }

    let query =
        user_sub_type::Entity::find().filter(user_sub_type::Column::CreatedBy.eq(&input.user_id));

    let result = query
        .order_by_desc(user_sub_type::Column::UpdatedAt)
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    let user_sub_types = result
        .into_iter()
        .map(UserSubType::try_from)
        .collect::<Result<Vec<UserSubType>, String>>()?;

    Ok(GetSubTypeReturn {
        user: user_sub_types,
        system: system_sub_types,
    })
}

// Helper takes &DatabaseConnection, not State
pub async fn get_system_sub_types(db: &DatabaseConnection) -> Result<Vec<SystemSubType>, String> {
    let result = system_sub_type::Entity::find()
        .order_by_desc(system_sub_type::Column::UpdatedAt)
        .all(db) // No .inner() needed here
        .await
        .map_err(|e| e.to_string())?;

    let system_sub_types = result
        .into_iter()
        .map(SystemSubType::try_from)
        .collect::<Result<Vec<SystemSubType>, String>>()?;

    Ok(system_sub_types)
}

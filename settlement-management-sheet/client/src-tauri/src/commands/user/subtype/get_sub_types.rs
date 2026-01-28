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
    pub user_sub_types: Vec<UserSubType>,
    pub system_sub_types: Vec<SystemSubType>,
}

#[tauri::command]
pub async fn get_sub_types(
    db: tauri::State<'_, DatabaseConnection>,
    input: GetSubTypesInput,
) -> Result<GetSubTypeReturn, String> {
    let system_input = input.system.unwrap_or(false);
    let mut system_sub_types = Vec::new();
    if system_input {
        system_sub_types = get_system_sub_types(db.clone()).await?;
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
        user_sub_types,
        system_sub_types,
    })
}

pub async fn get_system_sub_types(
    db: tauri::State<'_, DatabaseConnection>,
) -> Result<Vec<SystemSubType>, String> {
    let query = system_sub_type::Entity::find();

    let result = query
        .order_by_desc(system_sub_type::Column::UpdatedAt)
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    let system_sub_types = result
        .into_iter()
        .map(SystemSubType::try_from)
        .collect::<Result<Vec<SystemSubType>, String>>()?;

    Ok(system_sub_types)
}

use crate::{
    entities::{system_sub_type_property, user_sub_type_property},
    types::{SystemSubTypeProperty, UserSubTypeProperty},
};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetSubTypePropertiesInput {
    user_id: String,
    system: Option<bool>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetSubTypePropertiesOutput {
    pub user_properties: Vec<UserSubTypeProperty>,
    pub system_properties: Vec<SystemSubTypeProperty>,
}

#[tauri::command]
pub async fn get_sub_type_properties(
    db: tauri::State<'_, DatabaseConnection>,
    input: GetSubTypePropertiesInput,
) -> Result<GetSubTypePropertiesOutput, String> {
    let system_input = input.system.unwrap_or(false);
    let mut system_properties = Vec::new();
    if system_input {
        system_properties = get_system_sub_type_properties(db.clone()).await?;
    }

    // build query
    let query = user_sub_type_property::Entity::find()
        .filter(user_sub_type_property::Column::CreatedBy.eq(input.user_id));

    // execute query
    let properties = query
        .order_by_desc(user_sub_type_property::Column::UpdatedAt)
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    // convert to SubTypeProperty
    let result = properties
        .into_iter()
        .map(UserSubTypeProperty::try_from)
        .collect::<Result<Vec<UserSubTypeProperty>, _>>()
        .map_err(|e| e.to_string())?;

    // return result

    Ok(GetSubTypePropertiesOutput {
        user_properties: result,
        system_properties,
    })
}

pub async fn get_system_sub_type_properties(
    db: tauri::State<'_, DatabaseConnection>,
) -> Result<Vec<SystemSubTypeProperty>, String> {
    let properties = system_sub_type_property::Entity::find()
        .order_by_desc(system_sub_type_property::Column::UpdatedAt)
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    let result = properties
        .into_iter()
        .map(SystemSubTypeProperty::try_from)
        .collect::<Result<Vec<SystemSubTypeProperty>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(result)
}

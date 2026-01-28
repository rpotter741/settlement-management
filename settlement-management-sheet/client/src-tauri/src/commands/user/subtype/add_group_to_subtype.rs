use crate::{
    entities::user_sub_type_schema_group,
    types::{GroupId, SubTypeId, UserSubTypeGroupLink},
};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set};

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AddGroupToSubTypeInput {
    pub id: String,
    pub group_id: GroupId,
    pub subtype_id: SubTypeId,
    pub order: i32,
}

#[tauri::command]
pub async fn add_group_to_subtype(
    db: tauri::State<'_, DatabaseConnection>,
    input: AddGroupToSubTypeInput,
) -> Result<UserSubTypeGroupLink, String> {
    let new_sub_type_schema_group = user_sub_type_schema_group::ActiveModel {
        id: Set(input.id),
        group_id: Set(input.group_id.0),
        subtype_id: Set(input.subtype_id.0),
        order: Set(input.order),
    };

    let created = new_sub_type_schema_group
        .insert(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(UserSubTypeGroupLink::try_from(created)?)
}

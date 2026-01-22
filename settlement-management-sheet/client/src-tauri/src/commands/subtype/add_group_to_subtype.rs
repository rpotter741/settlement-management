use crate::{
    entities::sub_type_schema_group,
    types::{GroupId, SubTypeId},
};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set};

#[derive(serde::Deserialize)]
pub struct AddGroupToSubTypeInput {
    pub id: String,
    pub group_id: GroupId,
    pub schema_id: SubTypeId,
    pub order: i32,
}

#[tauri::command]
pub async fn add_group_to_subtype(
    db: tauri::State<'_, DatabaseConnection>,
    input: AddGroupToSubTypeInput,
) -> Result<sub_type_schema_group::Model, String> {
    let new_sub_type_schema_group = sub_type_schema_group::ActiveModel {
        id: Set(input.id),
        group_id: Set(input.group_id.0),
        schema_id: Set(input.schema_id.0),
        order: Set(input.order),
    };

    new_sub_type_schema_group
        .insert(db.inner())
        .await
        .map_err(|e| e.to_string())
}

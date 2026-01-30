use crate::{
    commands::user::subtype::AddGroupToSubTypeInput, entities::system_sub_type_schema_group,
    types::SystemSubTypeGroupLink,
};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set};

#[cfg(debug_assertions)]
#[tauri::command]
pub async fn sys_add_group_to_subtype(
    db: tauri::State<'_, DatabaseConnection>,
    input: AddGroupToSubTypeInput,
) -> Result<SystemSubTypeGroupLink, String> {
    let new_sub_type_schema_group = system_sub_type_schema_group::ActiveModel {
        id: Set(input.id),
        group_id: Set(input.group_id.0),
        subtype_id: Set(input.subtype_id.0),
        order: Set(input.order),
    };

    let created = new_sub_type_schema_group
        .insert(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(SystemSubTypeGroupLink::try_from(created)?)
}

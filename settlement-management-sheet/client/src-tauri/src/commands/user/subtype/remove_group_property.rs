use crate::{
    entities::{user_sub_type_group, user_sub_type_group_property},
    types::UserSubTypeGroup,
    utility::get_now,
};
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set,
    TransactionTrait,
};

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RemoveGroupPropertyInput {
    pub link_id: String,
    pub group_id: String,
    pub new_group_display: String,
}

#[tauri::command]
pub async fn remove_group_property(
    db: tauri::State<'_, DatabaseConnection>,
    input: RemoveGroupPropertyInput,
) -> Result<UserSubTypeGroup, String> {
    let txn = db.begin().await.map_err(|e| e.to_string())?;

    user_sub_type_group_property::Entity::delete_many()
        .filter(user_sub_type_group_property::Column::Id.eq(input.link_id))
        .exec(&txn)
        .await
        .map_err(|e| e.to_string())?;

    let mod_group = user_sub_type_group::ActiveModel {
        id: Set(input.group_id),
        display: Set(Some(input.new_group_display.clone())),
        updated_at: Set(get_now()),
        ..Default::default()
    };

    let mod_group = mod_group.update(&txn).await.map_err(|e| e.to_string())?;

    txn.commit().await.map_err(|e| e.to_string())?;

    let group = UserSubTypeGroup::try_from(mod_group).map_err(|e| e.to_string())?;

    Ok(group)
}

use crate::{
    entities::{user_sub_type_group, user_sub_type_group_property},
    types::{DisplayColumn, GroupId, PropertyId, UserSubTypePropertyLink},
};
use sea_orm::{ActiveModelTrait, DatabaseConnection, EntityTrait, Set, TransactionTrait};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateGroupPropertyInput {
    pub id: String,
    pub group_id: GroupId,
    pub user_property_id: Option<PropertyId>,
    pub system_property_id: Option<PropertyId>,
    pub order: i32,
}

#[tauri::command]
pub async fn create_group_property(
    db: tauri::State<'_, DatabaseConnection>,
    input: CreateGroupPropertyInput,
) -> Result<UserSubTypePropertyLink, String> {
    let txn = db.begin().await.map_err(|e| e.to_string())?;

    let new_group_property = user_sub_type_group_property::ActiveModel {
        id: Set(input.id),
        group_id: Set(input.group_id.0.clone()),
        user_property_id: Set(input.user_property_id.clone().map(|id| id.0.clone())),
        system_property_id: Set(input.system_property_id.clone().map(|id| id.0.clone())),
        order: Set(input.order),
    };

    let inserted_property = new_group_property
        .insert(&txn)
        .await
        .map_err(|e| e.to_string())?;

    let group = user_sub_type_group::Entity::find_by_id(input.group_id.0)
        .one(&txn)
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "Group not found".to_string())?;

    let mut group_display: HashMap<PropertyId, DisplayColumn> = group
        .display
        .as_ref()
        .and_then(|s| serde_json::from_str(s).ok())
        .unwrap_or_default();

    group_display.insert(
        input.user_property_id.clone().unwrap_or_else(|| {
            input
                .system_property_id
                .clone()
                .expect("Either user_property_id or system_property_id must be set")
        }),
        DisplayColumn { columns: 4 },
    );

    let mut group: user_sub_type_group::ActiveModel = group.into();
    group.display = Set(Some(
        serde_json::to_string(&group_display).map_err(|e| e.to_string())?,
    ));
    group.update(&txn).await.map_err(|e| e.to_string())?;

    txn.commit().await.map_err(|e| e.to_string())?;

    Ok(UserSubTypePropertyLink::try_from(inserted_property).map_err(|e| e.to_string())?)
}

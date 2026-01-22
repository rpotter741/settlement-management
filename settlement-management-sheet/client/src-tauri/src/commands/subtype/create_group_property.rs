use crate::{
    entities::{sub_type_group, sub_type_group_property},
    types::{DisplayColumn, GroupId, PropertyId},
};
use sea_orm::{ActiveModelTrait, DatabaseConnection, EntityTrait, Set, TransactionTrait};
use std::collections::HashMap;

#[derive(serde::Deserialize)]
pub struct CreateGroupPropertyInput {
    pub id: String,
    pub group_id: GroupId,
    pub property_id: PropertyId,
    pub order: i32,
}

#[tauri::command]
pub async fn create_group_property(
    db: tauri::State<'_, DatabaseConnection>,
    input: CreateGroupPropertyInput,
) -> Result<sub_type_group_property::Model, String> {
    let txn = db.begin().await.map_err(|e| e.to_string())?;

    let new_group_property = sub_type_group_property::ActiveModel {
        id: Set(input.id),
        group_id: Set(input.group_id.0.clone()),
        property_id: Set(input.property_id.0.clone()),
        order: Set(input.order),
    };

    let inserted_property = new_group_property
        .insert(&txn)
        .await
        .map_err(|e| e.to_string())?;

    let group = sub_type_group::Entity::find_by_id(input.group_id.0)
        .one(&txn)
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "Group not found".to_string())?;

    let mut group_display: HashMap<PropertyId, DisplayColumn> = group
        .display
        .as_ref()
        .and_then(|s| serde_json::from_str(s).ok())
        .unwrap_or_default();

    group_display.insert(input.property_id, DisplayColumn { columns: 4 });

    let mut group: sub_type_group::ActiveModel = group.into();
    group.display = Set(Some(
        serde_json::to_string(&group_display).map_err(|e| e.to_string())?,
    ));
    group.update(&txn).await.map_err(|e| e.to_string())?;

    txn.commit().await.map_err(|e| e.to_string())?;

    Ok(inserted_property)
}

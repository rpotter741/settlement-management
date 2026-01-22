// Create a new glossary entry in the database

use std::collections::HashMap;

use crate::{
    entities::{sub_type_group, sub_type_group_property},
    types::{get_now, DisplayColumn, PropertyId},
};
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set,
    TransactionTrait,
};

#[tauri::command]
pub async fn remove_group_property(
    db: tauri::State<'_, DatabaseConnection>,
    link_id: String,
    group_id: String,
    new_group_display: HashMap<PropertyId, DisplayColumn>,
) -> Result<(), String> {
    let txn = db.begin().await.map_err(|e| e.to_string())?;

    sub_type_group_property::Entity::delete_many()
        .filter(sub_type_group_property::Column::Id.eq(link_id))
        .exec(&txn)
        .await
        .map_err(|e| e.to_string())?;

    let mod_group = sub_type_group::ActiveModel {
        id: Set(group_id),
        display: Set(Some(
            serde_json::to_string(&new_group_display).map_err(|e| e.to_string())?,
        )),
        updated_at: Set(get_now()),
        ..Default::default()
    };

    mod_group.update(&txn).await.map_err(|e| e.to_string())?;

    txn.commit().await.map_err(|e| e.to_string())?;
    Ok(())
}

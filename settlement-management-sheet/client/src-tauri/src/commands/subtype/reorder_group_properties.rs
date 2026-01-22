// Create a new glossary entry in the database

use crate::entities::sub_type_group_property;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, IntoActiveModel, QueryFilter,
    Set, TransactionTrait,
};

#[tauri::command]
pub async fn reorder_group_properties(
    db: tauri::State<'_, DatabaseConnection>,
    group_id: String,
    new_order: Vec<String>,
) -> Result<(), String> {
    let all_group_properties = sub_type_group_property::Entity::find()
        .filter(sub_type_group_property::Column::GroupId.eq(group_id.clone()))
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    let txn = db.begin().await.map_err(|e| e.to_string())?;

    for (index, property_id) in new_order.iter().enumerate() {
        if let Some(group_property) = all_group_properties
            .iter()
            .find(|gp| gp.id == *property_id)
            .cloned()
        {
            let mut active_model: sub_type_group_property::ActiveModel =
                group_property.into_active_model();
            active_model.order = Set(index as i32);
            let _updated: sub_type_group_property::Model =
                active_model.update(&txn).await.map_err(|e| e.to_string())?;
        }
    }

    txn.commit().await.map_err(|e| e.to_string())?;
    Ok(())
}
